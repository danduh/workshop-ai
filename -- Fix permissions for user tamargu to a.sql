-- Fix permissions for user tamargu to allow migrations
-- This script MUST be run by a database administrator with sufficient privileges

-- Grant USAGE on the public schema
GRANT USAGE ON SCHEMA public TO tamargu;

-- Grant CREATE privilege on the public schema (required for creating tables)
GRANT CREATE ON SCHEMA public TO tamargu;

-- Grant all privileges on all existing tables in the schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tamargu;

-- Grant all privileges on all existing sequences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tamargu;

-- Grant all privileges on all existing functions
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO tamargu;

-- Set default privileges for future tables created by ANY role
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO tamargu;

-- Set default privileges for future sequences created by ANY role
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO tamargu;

-- Set default privileges for future functions created by ANY role
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO tamargu;

-- Verify permissions were granted
SELECT 
    grantee,
    privilege_type
FROM information_schema.role_table_grants 
WHERE grantee = 'tamargu';