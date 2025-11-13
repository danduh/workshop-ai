import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { usePromptVersion } from './usePrompts';
import { PromptService } from '../services/promptService';

// Mock the PromptService
jest.mock('../services/promptService', () => ({
  PromptService: {
    getPromptVersion: jest.fn(),
  },
}));

// Mock the error handler
jest.mock('../components/common', () => ({
  useErrorHandler: () => ({
    showError: jest.fn(),
  }),
}));

const mockedPromptService = PromptService as jest.Mocked<typeof PromptService>;

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('usePromptVersion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch prompt version successfully', async () => {
    const mockPromptData = {
      data: {
        id: '1',
        promptKey: 'TEST_PROMPT',
        version: '1.0.0',
        content: 'Test content',
        isActive: false,
        modelName: 'GPT-4',
        dateCreation: '2024-01-01',
        tags: ['test'],
        createdBy: 'test-user',
      },
    };

    mockedPromptService.getPromptVersion.mockResolvedValueOnce(mockPromptData);

    const { result } = renderHook(
      () => usePromptVersion('TEST_PROMPT', '1.0.0'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPromptData);
    expect(mockedPromptService.getPromptVersion).toHaveBeenCalledWith('TEST_PROMPT', '1.0.0');
  });

  it('should be disabled when promptKey or version is empty', () => {
    const { result } = renderHook(
      () => usePromptVersion('', '1.0.0'),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(mockedPromptService.getPromptVersion).not.toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    const mockError = new Error('Version not found');
    mockedPromptService.getPromptVersion.mockRejectedValueOnce(mockError);

    const { result } = renderHook(
      () => usePromptVersion('TEST_PROMPT', '1.0.0'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
  });

  it('should respect the enabled parameter', () => {
    const { result } = renderHook(
      () => usePromptVersion('TEST_PROMPT', '1.0.0', false),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockedPromptService.getPromptVersion).not.toHaveBeenCalled();
  });
});
