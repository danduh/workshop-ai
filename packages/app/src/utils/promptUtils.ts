/**
 * Utility functions for working with prompts
 */

import type { Prompt, FilterOptions } from '../types';

/**
 * Check if a prompt is active
 */
export function isActivePrompt(prompt: Prompt): boolean {
  return prompt.is_active && !prompt.deleted_at;
}

/**
 * Check if a prompt is deleted (soft delete)
 */
export function isDeletedPrompt(prompt: Prompt): boolean {
  return !!prompt.deleted_at;
}

/**
 * Format date to human-readable string
 * Format: "MMM DD, YYYY HH:MM AM/PM"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  
  return date.toLocaleString('en-US', options);
}

/**
 * Validate prompt key format
 * Must contain only lowercase letters, numbers, hyphens, and underscores
 */
export function validatePromptKey(key: string): boolean {
  const pattern = /^[a-z0-9_-]+$/;
  return pattern.test(key);
}

/**
 * Build query string from filter options
 */
export function buildQueryString(filters: FilterOptions): string {
  const params = new URLSearchParams();
  
  if (filters.model_name) {
    params.append('model_name', filters.model_name);
  }
  
  if (filters.tags && filters.tags.length > 0) {
    filters.tags.forEach(tag => params.append('tags', tag));
  }
  
  if (filters.page) {
    params.append('page', filters.page.toString());
  }
  
  if (filters.limit) {
    params.append('limit', filters.limit.toString());
  }
  
  if (filters.search) {
    params.append('search', filters.search);
  }
  
  return params.toString();
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Count characters in text
 */
export function countCharacters(text: string): number {
  return text.length;
}
