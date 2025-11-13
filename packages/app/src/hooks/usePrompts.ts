import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PromptService } from '../services/promptService';
import { 
  PromptsQueryParams, 
  VersionsQueryParams, 
  CreatePromptDto, 
  CreateVersionDto 
} from '../types/api';
import { useErrorHandler } from '../components/common';

// Query Keys
export const QUERY_KEYS = {
  prompts: 'prompts',
  prompt: 'prompt',
  versions: 'versions',
} as const;

/**
 * Hook for fetching prompts with filtering and pagination
 */
export const usePrompts = (params?: PromptsQueryParams) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.prompts, params],
    queryFn: () => PromptService.getPrompts(params),
    staleTime: 5 * 60 * 1000,
  });

  const { showError } = useErrorHandler();

  useEffect(() => {
    if (query.error) {
      const message = (query.error as Error & { response?: { data?: { message?: string } } })
        .response?.data?.message || 'Failed to fetch prompts';
      showError(message);
    }
  }, [query.error, showError]);

  return query;
};

/**
 * Hook for fetching a single prompt by key
 */
export const usePrompt = (promptKey: string, enabled = true) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.prompt, promptKey],
    queryFn: () => PromptService.getActivePromptByKey(promptKey),
    enabled: enabled && !!promptKey,
    staleTime: 2 * 60 * 1000,
  });

  const { showError } = useErrorHandler();

  useEffect(() => {
    if (query.error) {
      const message = (query.error as Error & { response?: { data?: { message?: string } } })
        .response?.data?.message || 'Failed to fetch prompt';
      showError(message);
    }
  }, [query.error, showError]);

  return query;
};

/**
 * Hook for fetching a specific version of a prompt
 */
export const usePromptVersion = (promptKey: string, version: string, enabled = true) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.prompt, promptKey, version],
    queryFn: () => PromptService.getPromptVersion(promptKey, version),
    enabled: enabled && !!promptKey && !!version,
    staleTime: 2 * 60 * 1000,
  });

  const { showError } = useErrorHandler();

  useEffect(() => {
    if (query.error) {
      const message = (query.error as Error & { response?: { data?: { message?: string } } })
        .response?.data?.message || 'Failed to fetch prompt version';
      showError(message);
    }
  }, [query.error, showError]);

  return query;
};

/**
 * Hook for fetching versions of a prompt
 */
export const useVersions = (promptKey: string, params?: VersionsQueryParams) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.versions, promptKey, params],
    queryFn: () => PromptService.getVersionsByKey(promptKey, params),
    enabled: !!promptKey,
    staleTime: 2 * 60 * 1000,
  });

  const { showError } = useErrorHandler();

  useEffect(() => {
    if (query.error) {
      const message = (query.error as Error & { response?: { data?: { message?: string } } })
        .response?.data?.message || 'Failed to fetch versions';
      showError(message);
    }
  }, [query.error, showError]);

  return query;
};

/**
 * Hook for creating a new prompt
 */
export const useCreatePrompt = () => {
  const queryClient = useQueryClient();
  const { showError } = useErrorHandler();
  
  return useMutation({
    mutationFn: (data: CreatePromptDto) => PromptService.createPrompt(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.prompts] });
    },
    onError: (error: Error) => {
      const message = (error as Error & { response?: { data?: { message?: string } } })
        .response?.data?.message || 'Failed to create prompt. Please try again.';
      showError(message);
    },
  });
};

/**
 * Hook for updating an existing prompt
 */
export const useUpdatePrompt = () => {
  const queryClient = useQueryClient();
  const { showError } = useErrorHandler();
  
  return useMutation({
    mutationFn: ({ promptKey, version, data }: { 
      promptKey: string; 
      version: string; 
      data: Partial<CreatePromptDto> 
    }) => PromptService.updatePrompt(promptKey, version, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.prompts] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.prompt, variables.promptKey] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.versions, variables.promptKey] });
    },
    onError: (error: Error) => {
      const message = (error as Error & { response?: { data?: { message?: string } } })
        .response?.data?.message || 'Failed to update prompt. Please try again.';
      showError(message);
    },
  });
};

/**
 * Hook for creating a new version of a prompt
 */
export const useCreateVersion = () => {
  const queryClient = useQueryClient();
  const { showError } = useErrorHandler();
  
  return useMutation({
    mutationFn: ({ promptKey, data }: { promptKey: string; data: CreateVersionDto }) =>
      PromptService.createVersion(promptKey, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.prompts] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.prompt, variables.promptKey] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.versions, variables.promptKey] });
    },
    onError: (error: Error) => {
      const message = (error as Error & { response?: { data?: { message?: string } } })
        .response?.data?.message || 'Failed to create version. Please try again.';
      showError(message);
    },
  });
};

/**
 * Hook for activating a version
 */
export const useActivateVersion = () => {
  const queryClient = useQueryClient();
  const { showError } = useErrorHandler();
  
  return useMutation({
    mutationFn: ({ promptKey, version }: { promptKey: string; version: string }) =>
      PromptService.activateVersion(promptKey, version),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.prompts] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.prompt, variables.promptKey] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.versions, variables.promptKey] });
    },
    onError: (error: Error) => {
      const message = (error as Error & { response?: { data?: { message?: string } } })
        .response?.data?.message || 'Failed to activate version. Please try again.';
      showError(message);
    },
  });
};

/**
 * Hook for managing filter and pagination state
 */
export const usePromptFilters = () => {
  const [filters, setFilters] = useState<PromptsQueryParams>({
    page: 1,
    limit: 20,
    sortBy: 'dateCreation',
    sortOrder: 'desc',
  });

  const updateFilter = <K extends keyof PromptsQueryParams>(
    key: K,
    value: PromptsQueryParams[K]
  ) => {
    setFilters((prev: PromptsQueryParams) => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' && { page: 1 }),
    }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      sortBy: 'dateCreation',
      sortOrder: 'desc',
    });
  };

  return {
    filters,
    updateFilter,
    resetFilters,
    setFilters,
  };
};
