-- Database Setup Script for System Prompt Management Service
-- Based on PRD_DB.md requirements
-- Created: 2025-07-17

-- Create the prompts_daniel table according to PRD specifications
CREATE TABLE prompts_daniel (
    -- Primary identifier
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    
    -- Prompt family identifier
    prompt_key VARCHAR(255) NOT NULL,
    
    -- Version identifier (date-based format)
    version VARCHAR(50) NOT NULL,
    
    -- Production status flag
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Auto-generated creation timestamp
    date_creation TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Target LLM model
    model_name VARCHAR(100) NOT NULL,
    
    -- The actual prompt content
    content TEXT NOT NULL,
    
    -- Human-readable description
    description TEXT NULL,
    
    -- Categorization tags as JSONB array
    tags JSONB NULL DEFAULT '[]',
    
    -- Creator identifier
    created_by VARCHAR(255) NOT NULL,
    
    -- Soft delete timestamp
    deleted_at TIMESTAMPTZ NULL,
    
    -- CONSTRAINTS
    
    -- Unique version per prompt family
    CONSTRAINT unique_prompt_version UNIQUE (prompt_key, version),
    
    -- Version format validation (YYYY-MM-DD-HH-MM-SS)
    CONSTRAINT valid_version_format CHECK (version ~ '^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$'),
    
    -- Content must not be empty after trimming
    CONSTRAINT content_not_empty CHECK (LENGTH(TRIM(content)) > 0),
    
    -- Prompt key format validation (uppercase with underscores)
    CONSTRAINT valid_prompt_key_format CHECK (prompt_key ~ '^[A-Z][A-Z0-9_]*$'),
    
    -- Content length limits
    CONSTRAINT content_length_check CHECK (LENGTH(content) >= 10 AND LENGTH(content) <= 100000)
);

-- CREATE REQUIRED INDEXES

-- Partial unique index to ensure only one active prompt per family (excluding deleted)
CREATE UNIQUE INDEX idx_single_active_prompt ON prompts_daniel (prompt_key) 
WHERE (is_active = true AND deleted_at IS NULL);

-- Index on prompt_key for fast family lookups
CREATE INDEX idx_prompts_prompt_key ON prompts_daniel (prompt_key);

-- Index on is_active for active prompt queries
CREATE INDEX idx_prompts_active ON prompts_daniel (is_active);

-- Index on model_name for model filtering
CREATE INDEX idx_prompts_model_name ON prompts_daniel (model_name);

-- GIN index on tags for tag-based filtering
CREATE INDEX idx_prompts_tags ON prompts_daniel USING GIN (tags);

-- Index on date_creation for temporal queries
CREATE INDEX idx_prompts_date_creation ON prompts_daniel (date_creation);

-- Partial index on deleted_at for non-deleted records
CREATE INDEX idx_prompts_deleted_at ON prompts_daniel (deleted_at) WHERE deleted_at IS NULL;

-- COMMENTS for documentation

COMMENT ON TABLE prompts_daniel IS 'Store all prompt versions with immutable history and active status management';
COMMENT ON COLUMN prompts_daniel.id IS 'Unique identifier for each prompt record';
COMMENT ON COLUMN prompts_daniel.prompt_key IS 'Unique identifier for prompt family (e.g., "PROMPT_FOR_AI_TOOL")';
COMMENT ON COLUMN prompts_daniel.version IS 'Version string (date-based format: YYYY-MM-DD-HH-MM-SS)';
COMMENT ON COLUMN prompts_daniel.is_active IS 'Production status flag (only one active per prompt_key)';
COMMENT ON COLUMN prompts_daniel.date_creation IS 'Auto-generated creation timestamp';
COMMENT ON COLUMN prompts_daniel.model_name IS 'Target LLM model (e.g., "GPT-4o", "Claude-3.5-Sonnet")';
COMMENT ON COLUMN prompts_daniel.content IS 'The actual prompt text/markdown content';
COMMENT ON COLUMN prompts_daniel.description IS 'Human-readable description of prompt purpose';
COMMENT ON COLUMN prompts_daniel.tags IS 'Array of categorization tags for filtering';
COMMENT ON COLUMN prompts_daniel.created_by IS 'User identifier who created this version';
COMMENT ON COLUMN prompts_daniel.deleted_at IS 'Soft delete timestamp (NULL = not deleted)';

-- SAMPLE DATA FOR TESTING

INSERT INTO prompts_daniel (prompt_key, version, is_active, model_name, content, description, tags, created_by) VALUES
(
    'CODE_REVIEW_PROMPT',
    '2025-07-17-14-30-25',
    true,
    'GPT-4o',
    'You are an expert code reviewer. Please review the following code and provide constructive feedback focusing on:\n1. Code quality and best practices\n2. Security vulnerabilities\n3. Performance optimizations\n4. Maintainability improvements\n\nProvide specific suggestions with examples when possible.',
    'AI prompt for automated code review assistance',
    '["code-review", "development", "quality-assurance"]',
    'system'
),
(
    'DOCUMENTATION_GENERATOR',
    '2025-07-17-14-31-00',
    true,
    'Claude-3.5-Sonnet',
    'You are a technical documentation specialist. Generate comprehensive documentation for the provided code including:\n1. Purpose and functionality overview\n2. API documentation with parameters and return values\n3. Usage examples\n4. Installation and setup instructions\n\nUse clear, concise language and follow standard documentation formats.',
    'AI prompt for generating technical documentation',
    '["documentation", "technical-writing", "api-docs"]',
    'system'
),
(
    'TEST_CASE_CREATOR',
    '2025-07-17-14-31-30',
    true,
    'Gemini-Pro',
    'You are a software testing expert. Create comprehensive test cases for the given code including:\n1. Unit tests covering all functions and methods\n2. Integration tests for component interactions\n3. Edge cases and error handling scenarios\n4. Performance and boundary testing\n\nGenerate tests using appropriate testing frameworks and include both positive and negative test scenarios.',
    'AI prompt for automated test case generation',
    '["testing", "quality-assurance", "automation"]',
    'system'
);

-- Verify the table creation and sample data
SELECT 
    prompt_key,
    version,
    is_active,
    model_name,
    LEFT(content, 50) || '...' as content_preview,
    description,
    tags,
    created_by,
    date_creation
FROM prompts_daniel 
ORDER BY prompt_key, date_creation;
