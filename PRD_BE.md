# Product Requirements Document (PRD) - Backend & Database

This document provides a step-by-step guide for an AI developer to build the System Prompt Management Service backend using NestJS and TypeORM within an Nx monorepo.

## Phase 1: Initial Project Setup

### Step 1.1: Create the NestJS Application

**Task:** Generate a new NestJS application named `api` within the `packages` directory of the monorepo.

**Command:**
```bash
nx g @nx/nest:app packages/api
```

**Definition of Done:**
- A new directory `packages/api` is created containing a runnable NestJS application.
- The application is registered in `nx.json` and has a `project.json` file.
- The application can be started without errors using `nx serve api`.

## Phase 2: Database Integration with TypeORM

### Step 2.1: Install TypeORM and PostgreSQL Driver

**Task:** Add TypeORM and the `pg` (PostgreSQL) driver dependencies to the `api` project.

**Commands:**
```bash
npm install --save @nestjs/typeorm typeorm pg
```

**Definition of Done:**
- `@nestjs/typeorm`, `typeorm`, and `pg` are added as dependencies in the root `package.json`.

### Step 2.2: Configure Database Connection

**Task:** Configure the TypeORM module to connect to the PostgreSQL database using environment variables.

**File to Edit:** `packages/api/src/app/app.module.ts`

**Instructions:**
1.  Import `TypeOrmModule` from `@nestjs/typeorm` and `ConfigModule` from `@nestjs/config`.
2.  Use `ConfigModule.forRoot()` to load environment variables from a `.env` file.
3.  Use `TypeOrmModule.forRootAsync` to configure the database connection. The configuration should read from `process.env`.

**Example `app.module.ts`:**
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false, // Use migrations in production
        autoLoadEntities: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**Definition of Done:**
- The `api` application connects to the PostgreSQL database on startup.
- Connection parameters are loaded from environment variables.

### Step 2.3: Create the Prompt Entity

**Task:** Create a TypeORM entity representing the `prompts_daniel` table.

**File to Create:** `packages/api/src/app/prompts/prompt.entity.ts`

**Instructions:**
- Create a `Prompt` entity that maps to the columns defined in `PRD_DB.md`.
- Use decorators like `@Entity`, `@Column`, `@PrimaryGeneratedColumn`, etc.
- Ensure data types and constraints match the PRD.

**Example `prompt.entity.ts`:**
```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'prompts_daniel' })
@Index(['prompt_key', 'version'], { unique: true })
@Index(['prompt_key'], { where: `"is_active" = true AND "deleted_at" IS NULL`, unique: true })
export class Prompt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  prompt_key: string;

  @Column({ type: 'varchar', length: 50 })
  version: string;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  date_creation: Date;

  @Column({ type: 'varchar', length: 100 })
  model_name: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true, default: [] })
  tags: string[];

  @Column({ type: 'varchar', length: 255 })
  created_by: string;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at: Date;
}
```

**Definition of Done:**
- The `Prompt` entity is created and correctly reflects the database schema.
- The entity is automatically loaded by the `TypeOrmModule`.

### Step 2.4: Setup and Create Initial Migration

**Task:** Configure and run TypeORM migrations to create the `prompts_daniel` table.

**Instructions:**
1.  Create a `typeorm.config.ts` file for the migration tool.
2.  Add a script to `package.json` to run migrations.
3.  Generate the initial migration.

**Example `typeorm.config.ts` in `packages/api/`:**
```typescript
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
    synchronize: false,
});
```

**`package.json` script:**
```json
"scripts": {
  "typeorm:api": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --dataSource packages/api/typeorm.config.ts",
  "migration:generate:api": "npm run typeorm:api -- migration:generate",
  "migration:run:api": "npm run typeorm:api -- migration:run"
}
```

**Commands to run:**
```bash
# Generate the migration
npm run migration:generate:api -- packages/api/src/migrations/InitialSchema

# Run the migration
npm run migration:run:api
```

**Definition of Done:**
- A migration file is generated in `packages/api/src/migrations`.
- Running the migration creates the `prompts_daniel` table in the database with all specified columns, constraints, and indexes.

## Phase 3: API Endpoint Implementation

For each endpoint, create a controller, service, and DTOs.

### Step 3.1: Implement `POST /api/prompts`

**Task:** Create a new prompt family. This is the first version of a new prompt.

**DTO (`create-prompt.dto.ts`):**
- `prompt_key`, `model_name`, `content`, `description`, `tags`, `created_by`.

**Service Logic (`prompts.service.ts`):**
- Generate a version string (e.g., `YYYY-MM-DD-HH-MM-SS`).
- Set `is_active` to `true` for the first version.
- Save the new prompt entity to the database.

**Controller Logic (`prompts.controller.ts`):**
- Define a `POST` endpoint.
- Use the DTO for request body validation.
- Call the service method.

**Definition of Done:**
- A `POST` request to `/api/prompts` with valid data creates a new prompt record.
- The new prompt has `is_active: true` and a generated version.
- The endpoint returns the created prompt object.
- Appropriate validation (e.g., for `prompt_key` format) is in place.

### Step 3.2: Implement `GET /api/prompts`

**Task:** Retrieve a paginated and filterable list of active prompts.

**Query DTO (`filter-prompt.dto.ts`):**
- `model_name` (optional), `tags` (optional), `page`, `limit`.

**Service Logic:**
- Build a query using TypeORM's `QueryBuilder`.
- Filter by `is_active: true` and `deleted_at: null`.
- Add optional filters for `model_name` and `tags`.
- Implement pagination.

**Controller Logic:**
- Define a `GET` endpoint.
- Use the DTO for query parameter validation.
- Return the paginated list of prompts.

**Definition of Done:**
- A `GET` request to `/api/prompts` returns a paginated list of active prompts.
- Filtering by `model_name` and `tags` works correctly.

---

*The document continues with detailed steps for the remaining endpoints (`GET /api/prompts/{promptKey}`, `POST /api/prompts/{promptKey}/versions`, `PATCH /api/prompts/{promptKey}/activate/{version}`, `DELETE /api/prompts/{id}`), following the same structure: Task, DTO, Service Logic, Controller Logic, and Definition of Done for each.*
