## 1. Executive Summary

### 1.1 Product Overview
The System Prompt Management Backend Service is a RESTful API service that provides centralized management of versioned system prompts for AI applications. It enables teams to store, version, and retrieve prompts with proper lifecycle management and immutability guarantees.

### 1.2 Business Objectives
- Centralize prompt management across multiple AI applications
- Ensure prompt versioning and immutability for production stability
- Provide fast, reliable access to prompts via REST API
- Enable proper governance and lifecycle management of AI prompts

### 1.3 Success Criteria
- API response time < 100ms for prompt retrieval
- 99.9% service uptime
- Support for concurrent access by multiple AI applications
- Zero data loss with ACID compliance

---

## 2. Product Scope

### 2.1 In Scope (Phase 1)
- RESTful API for prompt CRUD operations
- Version management with active status control
- Input validation and error handling
- Basic filtering and pagination
- Health check endpoints

### 2.2 Out of Scope (Future Phases)
- Authentication and authorization
- Rate limiting
- Audit logging
- Monitoring and analytics
- Caching mechanisms
- Backup and disaster recovery

---

## 3. Technical Requirements

### 3.1 Technology Stack
- **Runtime**: Node.js (v18+)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL (v14+)
- **ORM**: typeorm
- **Validation**: class-validator
- **Testing**: Jest
- **API Documentation**: OpenAPI/Swagger

### 3.2 Architecture Patterns
- Clean Architecture with clear separation of concerns
- Repository pattern for data access
- Service layer for business logic
- DTO (Data Transfer Objects) for API contracts
- Dependency injection for testability

---

## 4. Data Model Specification

### 4.1 Database Schema
`.hiddenPrompts/create_prompts_table.sql`
<!-- IMPORTANT TO KEEP TABLE NAME UNIQ -->

### 4.2 Data Validation Rules
- **promptKey**: 3-100 characters, alphanumeric with underscores and hyphens
- **version**: Semantic versioning format (e.g., "1.0.0") or timestamp-based
- **modelName**: Predefined list of supported models
- **content**: Non-empty, max 50,000 characters
- **description**: Optional, max 1,000 characters
- **tags**: Array of strings, each tag 1-50 characters
- **createdBy**: Non-empty string, max 255 characters

---

## 5. API Specification

### 5.1 Base Configuration
- **Base URL**: `/api/v1`
- **Content-Type**: `application/json`
- **Response Format**: JSON with consistent error structure

### 5.2 Error Response Format
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

### 5.3 Endpoints Specification

#### 5.3.1 Get All Prompts
```
GET /api/v1/prompts
```

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `promptKey`: string (filter by prompt key)
- `modelName`: string (filter by model)
- `tags`: string[] (filter by tags)
- `isActive`: boolean (filter by active status)
- `createdBy`: string (filter by creator)
- `sortBy`: enum ['dateCreation', 'promptKey', 'version'] (default: 'dateCreation')
- `sortOrder`: enum ['asc', 'desc'] (default: 'desc')

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "promptKey": "CUSTOMER_SUPPORT_AGENT",
      "version": "1.0.0",
      "isActive": true,
      "dateCreation": "2025-07-17T10:30:00Z",
      "modelName": "GPT-4o",
      "content": "You are a helpful customer support agent...",
      "description": "Primary customer support prompt",
      "tags": ["support", "customer-service"],
      "createdBy": "john.doe@company.com"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

#### 5.3.2 Get Active Prompt by Key
```
GET /api/v1/prompts/{promptKey}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "promptKey": "CUSTOMER_SUPPORT_AGENT",
    "version": "1.0.0",
    "isActive": true,
    "dateCreation": "2025-07-17T10:30:00Z",
    "modelName": "GPT-4o",
    "content": "You are a helpful customer support agent...",
    "description": "Primary customer support prompt",
    "tags": ["support", "customer-service"],
    "createdBy": "john.doe@company.com"
  }
}
```

#### 5.3.3 Get All Versions of a Prompt
```
GET /api/v1/prompts/{promptKey}/versions
```

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)

**Response:** Same format as Get All Prompts

#### 5.3.4 Create New Prompt
```
POST /api/v1/prompts
```

**Request Body:**
```json
{
  "promptKey": "CUSTOMER_SUPPORT_AGENT",
  "version": "1.0.0",
  "modelName": "GPT-4o",
  "content": "You are a helpful customer support agent...",
  "description": "Primary customer support prompt",
  "tags": ["support", "customer-service"],
  "createdBy": "john.doe@company.com",
  "isActive": false
}
```

**Response:** 201 Created with the created prompt object

#### 5.3.5 Create New Version
```
POST /api/v1/prompts/{promptKey}/versions
```

**Request Body:**
```json
{
  "version": "1.1.0",
  "modelName": "GPT-4o",
  "content": "Updated prompt content...",
  "description": "Updated description",
  "tags": ["support", "customer-service", "v2"],
  "createdBy": "jane.doe@company.com",
  "isActive": false
}
```

**Response:** 201 Created with the created version object

#### 5.3.6 Activate Prompt Version
```
PATCH /api/v1/prompts/{promptKey}/activate/{version}
```

**Response:** 200 OK with the activated prompt object

#### 5.3.7 Delete Prompt
```
DELETE /api/v1/prompts/{id}
```

**Business Rules:**
- Only inactive prompts can be deleted
- Returns 409 Conflict if trying to delete active prompt

**Response:** 204 No Content

#### 5.3.8 Health Check
```
GET /api/v1/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-07-17T10:30:00Z",
  "database": "connected",
  "version": "1.0.0"
}
```

---

## 6. Business Logic Requirements

### 6.1 Version Management
- Auto-generate version if not provided (timestamp-based: YYYY-MM-DD-HH-MM-SS)
- Prevent duplicate versions for the same promptKey
- Only one active version per promptKey at any time
- When activating a version, automatically deactivate the previous active version

### 6.2 Validation Rules
- Validate promptKey uniqueness for new prompts
- Ensure content is not empty and within size limits
- Validate modelName against supported models list
- Sanitize input to prevent injection attacks

### 6.3 Error Handling
- Return appropriate HTTP status codes
- Provide clear error messages for validation failures
- Handle database constraint violations gracefully
- Log errors for debugging while not exposing sensitive information

---

## 7. Performance Requirements

### 7.1 Response Time Targets
- GET requests: < 100ms (95th percentile)
- POST requests: < 200ms (95th percentile)
- PATCH requests: < 150ms (95th percentile)
- DELETE requests: < 100ms (95th percentile)

### 7.2 Throughput Requirements
- Support 1000 concurrent requests
- Handle 10,000 requests per minute
- Database connection pooling for optimal resource usage

### 7.3 Data Limits
- Maximum prompt content: 50,000 characters
- Maximum description: 1,000 characters
- Maximum tags per prompt: 20
- Maximum tag length: 50 characters

---

## 8. Development Guidelines

Application located in `packages/api/`

### 8.1 Code Structure
```
src/
├── modules/
│   └── prompts/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── entities/
│       ├── dto/
│       └── prompts.module.ts
├── common/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/
├── app.module.ts
└── main.ts
```

### 8.2 Testing Requirements
- Unit tests for all services and controllers (>90% coverage)
- Integration tests for API endpoints
- Database integration tests
- Performance testing for response time requirements

### 8.3 Documentation Requirements
- OpenAPI/Swagger documentation for all endpoints
- README with setup and deployment instructions
- API usage examples
- Database schema documentation

---

## 9. Deployment Requirements

### 9.1 Environment Configuration
- Support for multiple environments (development, staging, production)
- Environment-specific configuration via environment variables
- Database connection string configuration
- Port and host configuration

### 9.2 Database Setup
- Migration scripts for schema creation
- Seed data for initial setup
- Database connection health checks

### 9.3 Monitoring and Logging
- Structured logging with appropriate log levels
- Request/response logging for debugging
- Performance metrics collection
- Error tracking and alerting

---

## 10. Acceptance Criteria

### 10.1 Functional Criteria
- [ ] All API endpoints implemented according to specification
- [ ] Database schema created with proper constraints and indexes
- [ ] Business logic for version management implemented correctly
- [ ] Input validation and error handling working as specified
- [ ] Pagination and filtering working correctly

### 10.2 Non-Functional Criteria
- [ ] Response times meet performance requirements
- [ ] API documentation is complete and accurate
- [ ] Test coverage exceeds 90%
- [ ] Code follows established patterns and conventions
- [ ] Health check endpoint provides accurate status

### 10.3 Quality Criteria
- [ ] No critical or high-severity security vulnerabilities
- [ ] Code passes linting and formatting checks
- [ ] Database operations are optimized with proper indexing
- [ ] Error messages are clear and actionable
- [ ] API follows RESTful principles

---

## 11. Dependencies and Integration

### 11.1 External Dependencies
- PostgreSQL database server
- Node.js runtime environment
- npm package registry access

### 11.2 Internal Dependencies
- None for Phase 1 (standalone service)

### 11.3 Future Integration Points
- Authentication service (Phase 2)
- Monitoring and analytics service (Phase 2)
- Frontend application (separate service)
