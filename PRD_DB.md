# Product Requirements Document (PRD) - Database Schema for System Prompt Management Service

## Database Requirements Overview

### Database Platform
- **Primary Database**: PostgreSQL 14+
- **Rationale**: ACID compliance required for versioning integrity and concurrent access
- **Connection Requirements**: Standard PostgreSQL connection with UUID extension support

### Core Table Structure

<!-- IMPORTANT!!!! Each should add his/hername or random four lattes -->
#### Primary Table: `prompts_daniel` 

**Table Purpose**: Store all prompt versions with immutable history and active status management

**Column Specifications**:

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, NOT NULL, DEFAULT gen_random_uuid() | Unique identifier for each prompt record |
| `prompt_key` | VARCHAR(255) | NOT NULL, INDEX | Unique identifier for prompt family (e.g., "PROMPT_FOR_AI_TOOL") |
| `version` | VARCHAR(50) | NOT NULL | Version string (date-based format: YYYY-MM-DD-HH-MM-SS) |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT FALSE | Production status flag (only one active per prompt_key) |
| `date_creation` | TIMESTAMPTZ | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Auto-generated creation timestamp |
| `model_name` | VARCHAR(100) | NOT NULL | Target LLM model (e.g., "GPT-4o", "Claude-3.5-Sonnet") |
| `content` | TEXT | NOT NULL | The actual prompt text/markdown content |
| `description` | TEXT | NULL | Human-readable description of prompt purpose |
| `tags` | JSONB | NULL, DEFAULT '[]' | Array of categorization tags for filtering |
| `created_by` | VARCHAR(255) | NOT NULL | User identifier who created this version |
| `deleted_at` | TIMESTAMPTZ | NULL | Soft delete timestamp (NULL = not deleted) |

**Required Constraints**:
1. **Unique Version Constraint**: 
   ```sql
   CONSTRAINT unique_prompt_version UNIQUE (prompt_key, version)
   ```

2. **Single Active Constraint**: 
   ```sql
   CONSTRAINT single_active_prompt UNIQUE (prompt_key) WHERE (is_active = true AND deleted_at IS NULL)
   ```

3. **Version Format Check**: 
   ```sql
   CONSTRAINT valid_version_format CHECK (version ~ '^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$')
   ```

4. **Content Not Empty**: 
   ```sql
   CONSTRAINT content_not_empty CHECK (LENGTH(TRIM(content)) > 0)
   ```

**Required Indexes**:
1. `idx_prompts_prompt_key` - Index on `prompt_key` for fast family lookups
2. `idx_prompts_active` - Index on `is_active` for active prompt queries
3. `idx_prompts_model_name` - Index on `model_name` for model filtering
4. `idx_prompts_tags` - GIN index on `tags` for tag-based filtering
5. `idx_prompts_date_creation` - Index on `date_creation` for temporal queries
6. `idx_prompts_deleted_at` - Partial index on `deleted_at` WHERE `deleted_at IS NULL`

### Data Validation Rules

**Prompt Key Requirements**:
- Must be uppercase with underscores only
- Pattern: `^[A-Z][A-Z0-9_]*$`
- Maximum length: 255 characters
- Must be descriptive and self-explanatory

**Version Requirements**:
- Format: YYYY-MM-DD-HH-MM-SS (e.g., "2025-07-17-14-30-25")
- Must be unique per prompt_key
- Auto-generated based on creation timestamp

**Model Name Requirements**:
- String
- Examples: "GPT-4o", "Claude-3.5-Sonnet", "Gemini-Pro"
- Case-sensitive exact match

**Content Requirements**:
- Minimum length: 10 characters (after trimming)
- Maximum length: 100,000 characters
- UTF-8 encoding

**Tags Requirements**:
- Array of strings in JSONB format
- Each tag: 1-50 characters, alphanumeric with hyphens
- Maximum 20 tags per prompt
- Case-insensitive storage (convert to lowercase)

### Performance Requirements

**Query Performance Targets**:
- Single prompt retrieval by prompt_key + active: < 5ms
- Prompt family version list: < 10ms
- Filtered prompt search: < 50ms
- Tag-based filtering: < 100ms

**Concurrency Requirements**:
- Support 100+ concurrent read operations
- Support 10+ concurrent write operations
- Handle version creation without conflicts
- Ensure single active constraint integrity

### Data Integrity Requirements

**Immutability Rules**:
- Once created, prompt content cannot be modified
- Only `is_active` and `deleted_at` fields can be updated
- Version numbers are immutable after creation

**Activation Rules**:
- Only one prompt per prompt_key can be active
- Activating a prompt must deactivate others in the same family
- Deleted prompts cannot be activated

**Deletion Rules**:
- Soft delete only (set `deleted_at` timestamp)
- Active prompts cannot be deleted
- Deleted prompts are hidden from standard queries

### Migration and Seeding Requirements

**Initial Data Requirements**:
- Create database with UTF-8 encoding
- Enable UUID extension: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
- Enable JSONB support for tags column

**Sample Data for Testing**:
```sql
-- Example prompt families to seed:
-- 1. CODE_REVIEW_PROMPT (for code review AI)
-- 2. DOCUMENTATION_GENERATOR (for doc generation)
-- 3. TEST_CASE_CREATOR (for test generation)
```


