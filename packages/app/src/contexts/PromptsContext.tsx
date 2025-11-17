/**
 * PromptsContext - Global state management for prompts
 * Provides prompts list, filters, and actions to components
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Prompt, FilterOptions, PaginatedResponse } from '../types';
import { promptService } from '../services';

/**
 * Prompts Context State Interface
 */
interface PromptsContextValue {
  // State
  prompts: Prompt[];
  filters: FilterOptions;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  setFilters: (filters: FilterOptions) => void;
  refreshPrompts: () => Promise<void>;
  clearFilters: () => void;
}

/**
 * Initial filter state
 */
const initialFilters: FilterOptions = {
  page: 1,
  limit: 10,
};

/**
 * Create Context
 */
const PromptsContext = createContext<PromptsContextValue | undefined>(
  undefined
);

/**
 * PromptsContextProvider Component
 * Wraps the application to provide global prompts state
 */
export const PromptsContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filters, setFiltersState] = useState<FilterOptions>(initialFilters);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  /**
   * Fetch prompts from API
   */
  const refreshPrompts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: PaginatedResponse = await promptService.getPrompts(
        filters
      );

      setPrompts(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err: unknown) {
      console.error('Error fetching prompts:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to load prompts. Please try again.';
      setError(errorMessage);
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Update filters and trigger refresh
   */
  const setFilters = useCallback((newFilters: FilterOptions) => {
    setFiltersState(newFilters);
  }, []);

  /**
   * Clear all filters and reset to defaults
   */
  const clearFilters = useCallback(() => {
    setFiltersState(initialFilters);
  }, []);

  const value: PromptsContextValue = {
    prompts,
    filters,
    loading,
    error,
    pagination,
    setFilters,
    refreshPrompts,
    clearFilters,
  };

  return (
    <PromptsContext.Provider value={value}>{children}</PromptsContext.Provider>
  );
};

/**
 * usePromptsContext Hook
 * Access prompts context in any component
 * @throws Error if used outside of PromptsContextProvider
 */
export const usePromptsContext = (): PromptsContextValue => {
  const context = useContext(PromptsContext);

  if (context === undefined) {
    throw new Error(
      'usePromptsContext must be used within a PromptsContextProvider'
    );
  }

  return context;
};
