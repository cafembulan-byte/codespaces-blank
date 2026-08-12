import { createPool, Pool } from 'mysql2/promise'

let pool: Pool | null = null

function getPool(): Pool {
  if (pool) return pool

  pool = createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'coffee_shop',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })

  return pool
}

export async function query<T = any>(sql: string, params: Array<unknown> = []): Promise<T> {
  const connection = getPool()
  const [rows] = (await connection.query(sql, params)) as [T, any]
  return rows
}
