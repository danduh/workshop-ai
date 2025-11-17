const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function createTable() {
  const sqlFile = path.join(__dirname, '../../../create-table.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');

  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!\n');

    console.log('Creating prompts_daniel table and indexes...\n');
    
    // Execute the entire SQL script
    await client.query(sql);
    
    console.log('✓ Table created successfully!');
    console.log('✓ Indexes created successfully!');
    console.log('✓ Migration tracking table created!');
    console.log('\nDatabase setup complete! You can now run: nx serve api');

  } catch (err) {
    console.error('✗ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createTable();
