-- Create the prompts table
CREATE TABLE IF NOT EXISTS prompts_ws (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_key VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT false,
    date_creation TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    model_name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for optimal performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_prompts_key_version ON prompts_ws(prompt_key, version);
CREATE UNIQUE INDEX IF NOT EXISTS idx_prompts_key_active ON prompts_ws(prompt_key) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_prompts_key ON prompts_ws(prompt_key);
CREATE INDEX IF NOT EXISTS idx_prompts_model ON prompts_ws(model_name);
CREATE INDEX IF NOT EXISTS idx_prompts_tags ON prompts_ws USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts_ws(created_at);

-- Add comments for documentation
COMMENT ON TABLE prompts_ws IS 'System prompts for AI applications with version management';
COMMENT ON COLUMN prompts_ws.id IS 'Unique identifier for the prompt';
COMMENT ON COLUMN prompts_ws.prompt_key IS 'Unique key identifying the prompt type';
COMMENT ON COLUMN prompts_ws.version IS 'Version of the prompt (semantic or timestamp-based)';
COMMENT ON COLUMN prompts_ws.is_active IS 'Whether this version is currently active';
COMMENT ON COLUMN prompts_ws.date_creation IS 'When this prompt version was created';
COMMENT ON COLUMN prompts_ws.model_name IS 'AI model this prompt is designed for';
COMMENT ON COLUMN prompts_ws.content IS 'The actual prompt content';
COMMENT ON COLUMN prompts_ws.description IS 'Optional description of the prompt';
COMMENT ON COLUMN prompts_ws.tags IS 'JSON array of tags for categorization';
COMMENT ON COLUMN prompts_ws.created_by IS 'User who created this prompt version';
COMMENT ON COLUMN prompts_ws.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN prompts_ws.updated_at IS 'Record last update timestamp';
