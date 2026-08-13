#!/bin/bash
# Database initialization script untuk Render deployment

set -e

echo "🗄️  Initializing database..."

# Run Node script untuk initialize SQLite database
node -e "
const { initializeDatabase } = require('./lib/sqlite.js');
initializeDatabase();
console.log('✓ Database initialized successfully');
"

echo "✓ Database setup complete"
