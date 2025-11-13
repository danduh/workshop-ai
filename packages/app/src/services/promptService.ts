import axios from 'axios';
import {
  PromptListResponseDto,
  PromptSingleResponseDto,
  CreatePromptDto,
  CreateVersionDto,
  PromptsQueryParams,
  VersionsQueryParams,
} from '../types/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for cross-origin requests
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Request interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export class PromptService {
  /**
   * Get all prompts with filtering and pagination
   */
  static async getPrompts(params?: PromptsQueryParams): Promise<PromptListResponseDto> {
    const response = await apiClient.get('/prompts', { params });
    return response.data;
  }

  /**
   * Get active prompt by key
   */
  static async getActivePromptByKey(promptKey: string): Promise<PromptSingleResponseDto> {
    const response = await apiClient.get(`/prompts/${promptKey}`);
    return response.data;
  }

  /**
   * Get specific version of a prompt by key and version
   */
  static async getPromptVersion(promptKey: string, version: string): Promise<PromptSingleResponseDto> {
    const response = await apiClient.get(`/prompts/${promptKey}/versions/${version}`);
    return response.data;
  }

  /**
   * Get all versions of a prompt by key
   */
  static async getVersionsByKey(
    promptKey: string, 
    params?: VersionsQueryParams
  ): Promise<PromptListResponseDto> {
    const response = await apiClient.get(`/prompts/${promptKey}/versions`, { params });
    return response.data;
  }

  /**
   * Create a new prompt
   */
  static async createPrompt(data: CreatePromptDto): Promise<PromptSingleResponseDto> {
    const response = await apiClient.post('/prompts', data);
    return response.data;
  }

  /**
   * Create a new version of an existing prompt
   */
  static async createVersion(
    promptKey: string, 
    data: CreateVersionDto
  ): Promise<PromptSingleResponseDto> {
    const response = await apiClient.post(`/prompts/${promptKey}/versions`, data);
    return response.data;
  }

  /**
   * Update an existing prompt
   */
  static async updatePrompt(
    promptKey: string,
    version: string,
    data: Partial<CreatePromptDto>
  ): Promise<PromptSingleResponseDto> {
    const response = await apiClient.put(`/prompts/${promptKey}/versions/${version}`, data);
    return response.data;
  }

  /**
   * Activate a specific version of a prompt
   */
  static async activateVersion(promptKey: string, version: string): Promise<PromptSingleResponseDto> {
    console.log(`🔄 Activating version: PATCH /prompts/${promptKey}/activate/${version}`);
    const response = await apiClient.patch(`/prompts/${promptKey}/activate/${version}`);
    console.log('✅ Activation response:', response.data);
    return response.data;
  }

  /**
   * Get available model names
   */
  static getModelNames() {
    return ['GPT-4o', 'GPT-4', 'GPT-3.5-turbo', 'Claude-3', 'Claude-2', 'Gemini-Pro'] as const;
  }

  /**
   * Get available sort fields
   */
  static getSortFields() {
    return [
      { value: 'dateCreation', label: 'Date Created' },
      { value: 'promptKey', label: 'Prompt Key' },
      { value: 'version', label: 'Version' },
    ] as const;
  }

  /**
   * Get available sort orders
   */
  static getSortOrders() {
    return [
      { value: 'desc', label: 'Descending' },
      { value: 'asc', label: 'Ascending' },
    ] as const;
  }
}
