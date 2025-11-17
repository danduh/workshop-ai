const { Client } = require('pg');
require('dotenv').config();

async function checkPermissions() {
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
    await client.connect();
    console.log('Connected successfully!\n');

    // Check schema permissions
    const schemaPerms = await client.query(`
      SELECT 
        nspname as schema_name,
        r.rolname as grantee,
        has_schema_privilege(r.rolname, nspname, 'CREATE') as can_create,
        has_schema_privilege(r.rolname, nspname, 'USAGE') as can_usage
      FROM pg_namespace n
      CROSS JOIN pg_roles r
      WHERE nspname = 'public' 
        AND r.rolname = '${process.env.DB_USER}'
    `);

    console.log('Schema permissions for user:', process.env.DB_USER);
    console.log(schemaPerms.rows);
    console.log('');

    // Try to create a test table
    console.log('Attempting to create a test table...');
    try {
      await client.query('CREATE TABLE test_permissions (id serial PRIMARY KEY)');
      console.log('✓ Success! User can create tables.');
      await client.query('DROP TABLE test_permissions');
      console.log('✓ Test table dropped.');
    } catch (err) {
      console.error('✗ Failed to create table:', err.message);
    }

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

checkPermissions();
