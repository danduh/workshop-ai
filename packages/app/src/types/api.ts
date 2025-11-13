// API Response Types
export interface PromptResponseDto {
  id: string;
  promptKey: string;
  version: string;
  isActive: boolean;
  dateCreation: string;
  modelName: string;
  content: string;
  description?: string;
  tags: string[];
  createdBy: string;
}

export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PromptListResponseDto {
  data: PromptResponseDto[];
  pagination: PaginationDto;
}

export interface PromptSingleResponseDto {
  data: PromptResponseDto;
}

// API Request Types
export interface CreatePromptDto {
  promptKey: string;
  version?: string;
  modelName: ModelName;
  content: string;
  description?: string;
  tags?: string[];
  createdBy: string;
  isActive?: boolean;
}

export interface CreateVersionDto {
  version: string;
  modelName: ModelName;
  content: string;
  description?: string;
  tags?: string[];
  createdBy: string;
  isActive?: boolean;
}

// Enums and Unions
export type ModelName = 
  | 'GPT-4o' 
  | 'GPT-4' 
  | 'GPT-3.5-turbo' 
  | 'Claude-3' 
  | 'Claude-2' 
  | 'Gemini-Pro';

export type SortField = 'dateCreation' | 'promptKey' | 'version';
export type SortOrder = 'asc' | 'desc';

// Query Parameters
export interface PromptsQueryParams {
  page?: number;
  limit?: number;
  promptKey?: string;
  modelName?: string;
  tags?: string[];
  isActive?: boolean;
  createdBy?: string;
  sortBy?: SortField;
  sortOrder?: SortOrder;
}

export interface VersionsQueryParams {
  page?: number;
  limit?: number;
}

// UI State Types
export interface FilterState {
  search: string;
  modelName: string;
  tags: string[];
  isActive: boolean | null;
  createdBy: string;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export interface PaginationState {
  page: number;
  limit: number;
}

// Form Types
export interface PromptFormData {
  promptKey: string;
  version: string;
  modelName: ModelName;
  content: string;
  description: string;
  tags: string[];
  createdBy: string;
  isActive: boolean;
}

export interface PromptCardProps {
  prompt: PromptResponseDto;
  onEdit?: (prompt: PromptResponseDto) => void;
  onDelete?: (prompt: PromptResponseDto) => void;
  onCreateVersion?: (prompt: PromptResponseDto) => void;
  onActivate?: (prompt: PromptResponseDto) => void;
}
