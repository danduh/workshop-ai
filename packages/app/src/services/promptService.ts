/**
 * Prompt Service - API integration for prompt management
 * Handles all HTTP requests to the backend API
 */

import apiClient from '../lib/api-client';
import type {
  Prompt,
  PaginatedResponse,
  CreatePromptDto,
  CreateVersionDto,
  FilterOptions,
} from '../types';

/**
 * PromptService class
 * Provides methods for CRUD operations on prompts
 */
class PromptService {
  /**
   * Get all active prompts with optional filtering and pagination
   * @param filters - Optional filter options (model_name, tags, page, limit, search)
   * @returns Promise<PaginatedResponse> - Paginated list of prompts
   */
  async getPrompts(filters?: FilterOptions): Promise<PaginatedResponse> {
    const params: Record<string, string | number | string[]> = {};

    if (filters?.model_name) {
      params.model_name = filters.model_name;
    }

    if (filters?.tags && filters.tags.length > 0) {
      params.tags = filters.tags;
    }

    if (filters?.page) {
      params.page = filters.page;
    }

    if (filters?.limit) {
      params.limit = filters.limit;
    }

    if (filters?.search) {
      params.search = filters.search;
    }

    const response = await apiClient.get<PaginatedResponse>('/prompts', {
      params,
    });

    return response.data;
  }

  /**
   * Get active prompt by prompt key
   * @param promptKey - The prompt key identifier
   * @returns Promise<Prompt> - Single prompt object
   * @throws 404 if prompt not found
   */
  async getPromptByKey(promptKey: string): Promise<Prompt> {
    const response = await apiClient.get<Prompt>(`/prompts/${promptKey}`);
    return response.data;
  }

  /**
   * Get all versions of a prompt family
   * @param promptKey - The prompt key identifier
   * @returns Promise<Prompt[]> - Array of all versions
   * @throws 404 if no versions found
   */
  async getPromptVersions(promptKey: string): Promise<Prompt[]> {
    const response = await apiClient.get<Prompt[]>(
      `/prompts/${promptKey}/versions`
    );
    return response.data;
  }

  /**
   * Create a new prompt (first version)
   * @param data - CreatePromptDto with prompt_key, model_name, content, etc.
   * @returns Promise<Prompt> - Created prompt object
   * @throws 400 if validation fails
   * @throws 409 if prompt_key already exists
   */
  async createPrompt(data: CreatePromptDto): Promise<Prompt> {
    const response = await apiClient.post<Prompt>('/prompts', data);
    return response.data;
  }

  /**
   * Create a new version of an existing prompt
   * @param promptKey - The prompt key identifier
   * @param data - CreateVersionDto with model_name, content, etc.
   * @returns Promise<Prompt> - Created version object
   * @throws 404 if prompt family not found
   * @throws 409 if version conflict
   */
  async createVersion(
    promptKey: string,
    data: CreateVersionDto
  ): Promise<Prompt> {
    const response = await apiClient.post<Prompt>(
      `/prompts/${promptKey}/versions`,
      data
    );
    return response.data;
  }

  /**
   * Activate a specific version of a prompt
   * Deactivates the currently active version
   * @param promptKey - The prompt key identifier
   * @param version - The version string to activate
   * @returns Promise<Prompt> - Activated prompt object
   * @throws 404 if prompt or version not found
   */
  async activateVersion(promptKey: string, version: string): Promise<Prompt> {
    const response = await apiClient.patch<Prompt>(
      `/prompts/${promptKey}/activate/${version}`
    );
    return response.data;
  }

  /**
   * Soft delete a prompt (inactive prompts only)
   * @param id - The prompt UUID
   * @returns Promise<void>
   * @throws 400 if trying to delete an active prompt
   * @throws 404 if prompt not found
   */
  async deletePrompt(id: string): Promise<void> {
    await apiClient.delete(`/prompts/${id}`);
  }
}

// Export singleton instance
export const promptService = new PromptService();

// Export class for testing purposes
export default PromptService;
