/**
 * usePrompts Hook
 * Fetches and manages prompts list with filtering and pagination
 * Integrates with PromptsContext for global state management
 */

import { useEffect } from 'react';
import { usePromptsContext } from '../contexts';
import type { FilterOptions } from '../types';

/**
 * usePrompts Hook
 * @param filters - Optional filter options to override context filters
 * @returns Prompts data, loading state, error, and refetch function
 */
export function usePrompts(filters?: FilterOptions) {
  const context = usePromptsContext();
  const {
    prompts,
    filters: contextFilters,
    loading,
    error,
    pagination,
    setFilters,
    refreshPrompts,
  } = context;

  // Update filters if provided
  useEffect(() => {
    if (filters) {
      setFilters(filters);
    }
  }, [filters, setFilters]);

  // Fetch prompts on mount and when context filters change
  // Using JSON.stringify to track filter changes by value, not reference
  useEffect(() => {
    refreshPrompts();
  }, [JSON.stringify(contextFilters)]);

  return {
    data: prompts,
    filters: contextFilters,
    loading,
    error,
    pagination,
    refetch: refreshPrompts,
    setFilters,
  };
}
