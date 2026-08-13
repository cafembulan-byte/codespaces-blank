#!/usr/bin/env node

/**
 * Script untuk membuat admin user di database
 * 
 * Usage:
 *   npm run create-admin -- <email> <password>
 *   node scripts/create-admin.js admin@example.com mypassword
 */

const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Import database functions
const { run } = require('../lib/sqlite.ts');

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('❌ Usage: npm run create-admin -- <email> <password>');
  console.error('   Example: npm run create-admin -- admin@coffee.com SecurePass123');
  process.exit(1);
}

// Validate email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error('❌ Invalid email format');
  process.exit(1);
}

// Validate password strength
if (password.length < 6) {
  console.error('❌ Password must be at least 6 characters');
  process.exit(1);
}

(async () => {
  try {
    console.log('🔐 Creating admin user...');
    
    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    // Insert into database
    await run(
      'INSERT INTO admin_users (email, password_hash) VALUES (?, ?)',
      [email, hashedPassword]
    );
    
    console.log(`✅ Admin user created successfully!`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`\n📝 Note: Save your password securely!`);
    
    process.exit(0);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      console.error(`❌ Admin user with email "${email}" already exists`);
    } else {
      console.error('❌ Error creating admin user:', error.message);
    }
    process.exit(1);
  }
})();
