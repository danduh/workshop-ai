/**
 * TypeScript interfaces for the System Prompt Management Application
 * Based on OpenAPI schema from api.json
 */

/**
 * Main Prompt entity
 * Represents a single version of a prompt in the system
 */
export interface Prompt {
  /** Unique identifier (UUID) */
  id: string;
  
  /** Prompt key identifier - groups related versions together */
  prompt_key: string;
  
  /** Version number/identifier */
  version: string;
  
  /** Whether this version is currently active */
  is_active: boolean;
  
  /** Creation timestamp */
  date_creation: string;
  
  /** AI model name (e.g., "gpt-4", "claude-3") */
  model_name: string;
  
  /** Prompt content/template */
  content: string;
  
  /** Optional description of the prompt */
  description?: string;
  
  /** Tags for categorization */
  tags?: string[];
  
  /** User who created the prompt */
  created_by: string;
  
  /** Soft delete timestamp (null if not deleted) */
  deleted_at?: string | null;
}

/**
 * Paginated response for prompts list
 */
export interface PaginatedResponse {
  /** Array of prompt objects */
  data: Prompt[];
  
  /** Total number of items across all pages */
  total: number;
  
  /** Current page number (1-indexed) */
  page: number;
  
  /** Number of items per page */
  limit: number;
  
  /** Total number of pages */
  totalPages: number;
}

/**
 * DTO for creating a new prompt
 * Creates the first version of a new prompt family
 */
export interface CreatePromptDto {
  /** Unique identifier for the prompt (lowercase letters, numbers, hyphens, and underscores only) */
  prompt_key: string;
  
  /** Name of the AI model to use */
  model_name: string;
  
  /** The content/template of the prompt */
  content: string;
  
  /** Optional description of the prompt */
  description?: string;
  
  /** Optional tags for categorizing the prompt */
  tags?: string[];
  
  /** User who created the prompt */
  created_by: string;
}

/**
 * DTO for creating a new version of an existing prompt
 */
export interface CreateVersionDto {
  /** Name of the AI model to use */
  model_name: string;
  
  /** The content/template of the prompt */
  content: string;
  
  /** Optional description of the prompt */
  description?: string;
  
  /** Optional tags for categorizing the prompt */
  tags?: string[];
  
  /** User identifier who created this version */
  created_by: string;
}

/**
 * Filter and pagination options for prompts API
 */
export interface FilterOptions {
  /** Filter by model name */
  model_name?: string;
  
  /** Filter by tags (array of tag strings) */
  tags?: string[];
  
  /** Page number (1-indexed) */
  page?: number;
  
  /** Number of items per page (1-100) */
  limit?: number;
  
  /** Optional search query for filtering prompts */
  search?: string;
}

/**
 * API error response structure
 */
export interface ApiError {
  /** HTTP status code */
  statusCode: number;
  
  /** Error message */
  message: string | string[];
  
  /** Error type/code */
  error?: string;
}

/**
 * Available AI model options
 * Can be extended as new models are added
 */
export type ModelName = 
  | 'gpt-4'
  | 'gpt-4-turbo'
  | 'gpt-3.5-turbo'
  | 'claude-3-opus'
  | 'claude-3-sonnet'
  | 'claude-3-haiku'
  | string; // Allow custom models

/**
 * Size variants for UI components
 */
export type SizeVariant = 'small' | 'medium' | 'large';

/**
 * Notification types for toast messages
 */
export type NotificationType = 'success' | 'error' | 'info' | 'warning';
