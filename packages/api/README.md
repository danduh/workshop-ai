# System Prompt Management API

A RESTful API service for centralized management of versioned system prompts for AI applications.

## Features

- ✅ **CRUD Operations**: Create, read, update, and delete prompts
- ✅ **Version Management**: Support for semantic versioning with active/inactive states
- ✅ **Filtering & Pagination**: Advanced query capabilities with pagination
- ✅ **Input Validation**: Comprehensive validation using class-validator
- ✅ **API Documentation**: Auto-generated OpenAPI/Swagger documentation
- ✅ **Error Handling**: Structured error responses with proper HTTP status codes
- ✅ **Health Checks**: Built-in health monitoring endpoints
- ✅ **TypeScript**: Full TypeScript support with strict typing
- ✅ **Testing**: Unit tests with Jest

## Technology Stack

- **Runtime**: Node.js
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Validation**: class-validator & class-transformer
- **Documentation**: OpenAPI/Swagger
- **Testing**: Jest

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   # Edit .env with your database configuration
   ```

3. **Database Setup**:
   ```bash
   # Create database
   createdb prompts_db
   
   # Run migrations (manually for now)
   psql -d prompts_db -f migrations/001_create_prompts_table.sql
   psql -d prompts_db -f migrations/002_seed_sample_data.sql
   ```

4. **Start the application**:
   ```bash
   npm run serve
   ```

The API will be available at `http://localhost:3000/api`

### API Documentation

Once the application is running, visit:
- **Swagger UI**: `http://localhost:3000/api/docs`
- **Health Check**: `http://localhost:3000/api/health`

## API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/prompts` | Get all prompts with filtering |
| `GET` | `/api/prompts/{key}` | Get active prompt by key |
| `GET` | `/api/prompts/{key}/versions` | Get all versions of a prompt |
| `POST` | `/api/prompts` | Create new prompt |
| `POST` | `/api/prompts/{key}/versions` | Create new version |
| `PATCH` | `/api/prompts/{key}/activate/{version}` | Activate specific version |
| `DELETE` | `/api/prompts/{id}` | Delete prompt (inactive only) |
| `GET` | `/api/health` | Health check |

### Query Parameters

**GET /api/prompts** supports:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `promptKey` - Filter by prompt key
- `modelName` - Filter by model name
- `tags` - Filter by tags
- `isActive` - Filter by active status
- `createdBy` - Filter by creator
- `sortBy` - Sort field (dateCreation, promptKey, version)
- `sortOrder` - Sort order (asc, desc)

## Data Model

### Prompt Entity

```typescript
{
  id: string;                    // UUID
  promptKey: string;             // Unique identifier (3-100 chars)
  version: string;               // Version string (max 50 chars)
  isActive: boolean;             // Active status
  dateCreation: Date;            // Creation timestamp
  modelName: string;             // AI model name
  content: string;               // Prompt content (max 50,000 chars)
  description?: string;          // Optional description (max 1,000 chars)
  tags: string[];               // Tags array (max 20 tags, 50 chars each)
  createdBy: string;            // Creator identifier
}
```

### Supported Models

- GPT-4o
- GPT-4
- GPT-3.5-turbo
- Claude-3
- Claude-2
- Gemini-Pro

## Business Rules

### Version Management
- Only one active version per `promptKey` at any time
- Activating a version automatically deactivates the previous active version
- Version strings must be unique within a `promptKey`
- Auto-generated versions use timestamp format: `YYYY-MM-DD-HH-MM-SS`

### Validation Rules
- `promptKey`: 3-100 characters, alphanumeric with underscores and hyphens
- `content`: Non-empty, max 50,000 characters
- `description`: Optional, max 1,000 characters
- `tags`: Array of strings, max 20 tags, each 1-50 characters
- `modelName`: Must be from supported models list

### Deletion Rules
- Only inactive prompts can be deleted
- Returns 409 Conflict when attempting to delete active prompts

## Development

### Running Tests

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

### Code Style

```bash
# Linting
npm run lint

# Format code
npm run format
```

### Build

```bash
# Development build
npm run build

# Production build
npm run build:prod
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Application port | `3000` |
| `GLOBAL_PREFIX` | API prefix | `api` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `DB_DATABASE` | Database name | `prompts_db` |
| `DB_SSL` | Enable SSL | `false` |
| `CORS_ORIGIN` | CORS origins | `http://localhost:3000` |

## Error Handling

All errors follow a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {},
    "timestamp": "2025-07-17T10:30:00Z"
  }
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (business rule violations)
- `500` - Internal Server Error

## Contributing

1. Follow the established code style and patterns
2. Write tests for new features
3. Update documentation for API changes
4. Ensure all tests pass before submitting

## License

MIT License - see LICENSE file for details
