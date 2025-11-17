const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function fixPermissionsAsAdmin() {
  const sqlFile = path.join(__dirname, '../../../fix-permissions.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');

  // Use admin credentials from environment or prompt
  const adminUser = process.env.ADMIN_USER || process.env.DB_USER;
  const adminPassword = process.env.ADMIN_PASSWORD || process.env.DB_PASSWORD;

  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: adminUser,
    password: adminPassword,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database as admin user:', adminUser);
    await client.connect();
    console.log('✓ Connected successfully!\n');

    // Remove comments and split by semicolons
    const lines = sql.split('\n');
    const cleanedLines = lines
      .filter(line => !line.trim().startsWith('--') && line.trim().length > 0)
      .join('\n');
    
    const statements = cleanedLines
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log('Executing permission grants...\n');

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`[${i + 1}/${statements.length}] ${statement.substring(0, 60)}...`);
      try {
        await client.query(statement);
        console.log('✓ Success\n');
      } catch (err) {
        console.error(`✗ Error: ${err.message}\n`);
        throw err;
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✓ All permissions granted successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nUser "danielos" now has full permissions to:');
    console.log('  - CREATE tables and objects in the public schema');
    console.log('  - All privileges on all tables');
    console.log('  - All privileges on all sequences');
    console.log('  - Default privileges for future objects');
    console.log('\nYou can now run: npm run migration:run:api');

  } catch (err) {
    console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('✗ Failed to grant permissions');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Error:', err.message);
    console.error('\nMake sure you are running this script with admin credentials:');
    console.error('ADMIN_USER=<admin_user> ADMIN_PASSWORD=<admin_password> node packages/api/scripts/fix-permissions-as-admin.js');
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixPermissionsAsAdmin();
