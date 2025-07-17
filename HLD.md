## System Prompt Management Service

### Overview
A web-based service for managing versioned system prompts used by AI tools. The service provides immutable prompt storage with REST API access for external AI applications.

### Core Requirements

#### Data Model
Each prompt record contains:
- **promptKey** - Unique identifier for prompt family (string). should be self explained name "PROMPT_FOR_AI_TOOL"
- **version** - Version (string) date creation based.
- **isActive** - Boolean flag for production status (only one active per promptKey)
- **dateCreation** - Timestamp of creation (auto-generated)
- **modelName** - Target LLM model (e.g., "GPT-4o", "Claude-3.5-Sonnet")
- **content** - The actual prompt text (text/markdown)
- **description** - Human-readable description of prompt purpose
- **tags** - Array of categorization tags for filtering
- **createdBy** - User identifier who created this version

#### Database Design
**Primary Table: `prompts`**
```sql
- id (UUID, primary key)
- prompt_key (string, indexed)
- version (string)
- is_active (boolean, default false)
- date_creation (timestamp)
- model_name (string)
- content (text)
- description (string)
- tags (JSON array)
- created_by (string)
```

**Constraints:**
- Unique constraint on (prompt_key, version)
- Unique constraint on (prompt_key) WHERE is_active = true

#### Backend API

**Core Endpoints:**
```
GET /api/prompts (with filtering)
GET /api/prompts/{promptKey}
GET /api/prompts/{promptKey}/versions
POST /api/prompts
POST /api/prompts/{promptKey}/versions
PATCH /api/prompts/{promptKey}/activate/{version}
DELETE /api/prompts/{id}
```

**Key Features:**
- Input validation and sanitization
- Automatic version incrementing
- Active status management (ensure only one active per key)
- Soft delete for inactive prompts only
- Filtering by model, tags, creation date
- Pagination for list endpoints

#### Frontend Application

**Core Views:**
1. **Prompt Library** - Browse all prompt families with search/filter
2. **Prompt Detail** - View specific prompt with version history
3. **Create Prompt** - Form for new prompt creation
4. **Version Management** - Compare versions, activate/deactivate

**Key Features:**
- Rich text editor for prompt content, MARKDOWN support
- Version comparison tool
- Tag-based categorization system
- Model-specific filtering
- Activity status indicators
- Copy-to-create-new functionality

#### Security & Access Control [Phase-2]
- API key authentication for external tools [Phase-2]
- Role-based access (admin, editor, viewer) [Phase-2]
- Audit logging for all modifications [Phase-2]
- Rate limiting on API endpoints [Phase-2]

#### Technical Considerations
- **Backend**: Node.js/NestJS
- **Database**: PostgreSQL for ACID compliance
- **Frontend**: React with state management based on context and hook
- **Deployment**: Containerized with Docker [Phase-2]
- **Monitoring**: Health checks and usage analytics [Phase-2]

#### Success Metrics
- API response time < 100ms for prompt retrieval
- 99.9% uptime for external tool integrations
- User adoption rate across AI development teams
- Reduction in prompt management overhead

This service will centralize prompt management, ensure consistency across AI applications, and provide proper versioning controls for production environments.