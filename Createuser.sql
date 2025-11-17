-- Create a new user with password
CREATE USER danielos WITH PASSWORD 'danielos123';

-- Grant privileges to the user (optional, based on your needs)
-- Grant connect privilege to a specific database
GRANT CONNECT ON DATABASE danielos_prompts_db TO danielos;

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO danielos;

-- Grant privileges on all tables in the schema
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO danielos;

-- Grant privileges on all sequences (for auto-increment fields)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO danielos;

-- Grant privileges on future tables (optional)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO danielos;

-- If you need the user to be a superuser (use with caution)
-- ALTER USER your_username WITH SUPERUSER;

-- If you need to grant database creation privilege
-- ALTER USER your_username CREATEDB;