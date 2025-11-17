/**
 * usePromptDetail Hook
 * Fetches single prompt details and all its versions
 */

import { useState, useEffect, useCallback } from 'react';
import { promptService } from '../services';
import type { Prompt } from '../types';

/**
 * usePromptDetail Hook
 * @param promptKey - The prompt key identifier
 * @returns Prompt data, versions, loading state, error, and refetch function
 */
export function usePromptDetail(promptKey: string | undefined) {
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [versions, setVersions] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch prompt details and versions
   */
  const fetchPromptDetail = useCallback(async () => {
    if (!promptKey) {
      setLoading(false);
      setError('No prompt key provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch both prompt and versions in parallel
      const [promptData, versionsData] = await Promise.all([
        promptService.getPromptByKey(promptKey),
        promptService.getPromptVersions(promptKey),
      ]);

      setPrompt(promptData);
      setVersions(versionsData);
    } catch (err: unknown) {
      console.error('Error fetching prompt detail:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load prompt details.';
      setError(errorMessage);
      setPrompt(null);
      setVersions([]);
    } finally {
      setLoading(false);
    }
  }, [promptKey]);

  // Fetch on mount and when promptKey changes
  useEffect(() => {
    fetchPromptDetail();
  }, [fetchPromptDetail]);

  return {
    prompt,
    versions,
    loading,
    error,
    refetch: fetchPromptDetail,
  };
}
