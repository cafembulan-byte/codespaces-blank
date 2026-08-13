import sqlite3 from 'sqlite3'
import path from 'path'
import fs from 'fs'

let db: sqlite3.Database | null = null
let dbInitialized = false

function getDbPath(): string {
  const dbDir = path.join(process.cwd(), 'data')
  const dbPath = path.join(dbDir, 'app.db')
  
  // Ensure directory exists
  if (!fs.existsSync(dbDir)) {
    try {
      fs.mkdirSync(dbDir, { recursive: true })
    } catch (error) {
      console.warn('Failed to create data directory:', error)
    }
  }
  
  return dbPath
}

function getDb(): sqlite3.Database {
  if (!db) {
    try {
      db = new sqlite3.Database(getDbPath())
      // Enable foreign keys and other pragmas
      db.run('PRAGMA foreign_keys = ON')
    } catch (error) {
      console.error('Failed to initialize database:', error)
      throw new Error('Database connection failed')
    }
  }
  return db
}

export async function initializeDatabase(): Promise<void> {
  if (dbInitialized) return
  
  return new Promise((resolve, reject) => {
    try {
      const database = getDb()
      
      database.serialize(() => {
        database.run(`
          CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `)

        database.run(`
          CREATE TABLE IF NOT EXISTS menu_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            price TEXT NOT NULL,
            badge TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `)

        database.run(`
          CREATE TABLE IF NOT EXISTS gallery_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            caption TEXT NOT NULL,
            image TEXT NOT NULL,
            position TEXT DEFAULT 'grid',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `)

        database.run(`
          CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            rating INTEGER NOT NULL,
            comment TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            console.error('Database initialization error:', err)
            reject(err)
          } else {
            dbInitialized = true
            resolve()
          }
        })
      })
    } catch (error) {
      console.error('Failed to initialize database:', error)
      reject(error)
    }
  })
}

export function run<T = any>(sql: string, params: any[] = []): Promise<T> {
  return new Promise((resolve, reject) => {
    getDb().run(sql, params, function (err) {
      if (err) return reject(err)
      resolve({ lastID: this.lastID, changes: this.changes } as T)
    })
  })
}

export function all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    getDb().all(sql, params, (err, rows) => {
      if (err) return reject(err)
      resolve(rows as T[])
    })
  })
}

export function get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    getDb().get(sql, params, (err, row) => {
      if (err) return reject(err)
      resolve(row as T | undefined)
    })
  })
}

export async function seedDefaults(): Promise<void> {
  try {
    const bcrypt = require('bcryptjs')
    const defaultHash = bcrypt.hashSync('coffee2026', 10)

    await run(
      'INSERT OR IGNORE INTO admin_users (email, password_hash) VALUES (?, ?)',
      ['admin@harvestgrounds.com', defaultHash]
    )

    await run(
      `INSERT OR IGNORE INTO menu_items (category, name, description, price, badge)
       VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?), (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)
      `,
      [
        'Espresso Based', 'Single Origin Espresso', 'Bright citrus notes with chocolate undercurrents.', '$5.50', 'Best Seller',
        'Espresso Based', 'Cappuccino', 'Velvety steamed milk with rich crema.', '$6.00', 'New',
        'Manual Brew', 'Pour Over', 'Light and floral, brewed to highlight terroir.', '$7.50', 'Seasonal',
        'Pastries', 'Almond Croissant', 'Flaky pastry with toasted almond flavor.', '$4.95', 'Best Seller'
      ]
    )

    await run(
      `INSERT OR IGNORE INTO gallery_items (title, caption, image, position)
       VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)
      `,
      [
        'Cozy Café Interior', 'Warm light, handcrafted brews, and slow mornings.', 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80', 'featured',
        'Outdoor Seating', 'Open-air moments made for easy conversations.', 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=1200&q=80', 'normal',
        'Plantation View', 'Fresh air, rich soil, and the rhythm of the farm.', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', 'normal',
        'Latte Art', 'Well-crafted pours, and a little moment of joy.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80', 'wide'
      ]
    )

    await run(
      `INSERT OR IGNORE INTO reviews (name, rating, comment)
       VALUES (?, ?, ?), (?, ?, ?)
      `,
      [
        'Nadia', 5, 'The coffee and plantation view felt so peaceful.',
        'Raka', 5, 'Perfect place for a morning coffee. The indoor seating is cozy.'
      ]
    )
  } catch (error) {
    console.error('Error seeding defaults:', error)
  }
}

// Export a function to initialize database on demand
export async function ensureDatabaseReady(): Promise<void> {
  if (!dbInitialized) {
    await initializeDatabase()
    // Give a small delay for tables to be created
    await new Promise(resolve => setTimeout(resolve, 100))
    // Optionally seed defaults
    // await seedDefaults()
  }
}

export default getDb
