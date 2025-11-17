const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function fixPermissions() {
  // Read the SQL file
  const sqlFile = path.join(__dirname, '../../../fix-permissions.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');

  // Create a client connection
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
    console.log('Connected successfully!');

    // Remove comments and split by semicolons
    const lines = sql.split('\n');
    const cleanedLines = lines
      .filter(line => !line.trim().startsWith('--') && line.trim().length > 0)
      .join('\n');
    
    const statements = cleanedLines
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`\nExecuting ${statements.length} SQL statements...\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Statement ${i + 1}/${statements.length}:`);
      console.log(statement);
      console.log('');
      try {
        await client.query(statement);
        console.log('✓ Success\n');
      } catch (err) {
        console.error(`✗ Error: ${err.message}\n`);
        if (err.message.includes('permission denied')) {
          console.error('⚠️  This user does not have sufficient privileges to grant permissions.');
          console.error('You need to run these SQL statements as a database administrator.\n');
        }
      }
    }

    console.log('Permission fix script completed!');
  } catch (err) {
    console.error('Connection error:', err.message);
    console.error('\nNote: If you see permission errors, you need to run this script with admin credentials.');
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixPermissions();
