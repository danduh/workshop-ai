import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { PromptLibraryPage } from './PromptLibraryPage';
import * as usePromptsModule from '../hooks/usePrompts';

// Mock the hooks
jest.mock('../hooks/usePrompts', () => ({
  usePrompts: jest.fn(),
  usePromptFilters: jest.fn(),
  useActivateVersion: jest.fn(),
}));

// Mock the components
jest.mock('../components/common', () => ({
  PageWrapper: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div data-testid="page-wrapper">
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

jest.mock('../components/prompts/PromptCard', () => ({
  PromptCard: ({ prompt, onActivate }: { prompt: any; onActivate?: (prompt: any) => void }) => (
    <div data-testid={`prompt-card-${prompt.id}`}>
      <span>{prompt.promptKey}</span>
      <span>{prompt.isActive ? 'Active' : 'Inactive'}</span>
      {onActivate && !prompt.isActive && (
        <button 
          data-testid={`activate-${prompt.id}`}
          onClick={() => onActivate(prompt)}
        >
          Activate
        </button>
      )}
    </div>
  ),
}));

jest.mock('../components/prompts/FilterPanel', () => ({
  FilterPanel: () => <div data-testid="filter-panel">Filter Panel</div>,
}));

jest.mock('../components/prompts/PaginationControls', () => ({
  PaginationControls: () => <div data-testid="pagination">Pagination</div>,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('PromptLibraryPage - Activate Functionality', () => {
  const mockUsePrompts = usePromptsModule.usePrompts as jest.Mock;
  const mockUsePromptFilters = usePromptsModule.usePromptFilters as jest.Mock;
  const mockUseActivateVersion = usePromptsModule.useActivateVersion as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the filters hook
    mockUsePromptFilters.mockReturnValue({
      filters: {},
      updateFilter: jest.fn(),
      resetFilters: jest.fn(),
    });

    // Mock successful data response
    const mockData = {
      data: [
        {
          id: '1',
          promptKey: 'TEST_ACTIVE',
          version: '1.0.0',
          isActive: true,
          modelName: 'GPT-4',
          dateCreation: '2024-01-01',
          createdBy: 'test-user',
          content: 'Test content',
          tags: ['test'],
        },
        {
          id: '2',
          promptKey: 'TEST_INACTIVE',
          version: '1.1.0',
          isActive: false,
          modelName: 'GPT-4',
          dateCreation: '2024-01-02',
          createdBy: 'test-user',
          content: 'Test content 2',
          tags: ['test'],
        },
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 2,
        totalPages: 1,
      },
    };

    mockUsePrompts.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
      isFetching: false,
    });
  });

  it('should provide activate functionality for inactive prompts', async () => {
    const mockMutateAsync = jest.fn().mockResolvedValue({});
    mockUseActivateVersion.mockReturnValue({
      mutateAsync: mockMutateAsync,
    });

    render(<PromptLibraryPage />, { wrapper: createWrapper() });

    // Check that both prompts are rendered
    expect(screen.getByTestId('prompt-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('prompt-card-2')).toBeInTheDocument();

    // Check that only inactive prompt has activate button
    expect(screen.queryByTestId('activate-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('activate-2')).toBeInTheDocument();

    // Click activate button
    fireEvent.click(screen.getByTestId('activate-2'));

    // Check that the mutation was called with correct parameters
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        promptKey: 'TEST_INACTIVE',
        version: '1.1.0',
      });
    });
  });

  it('should handle activation errors gracefully', async () => {
    const mockMutateAsync = jest.fn().mockRejectedValue(new Error('Activation failed'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    mockUseActivateVersion.mockReturnValue({
      mutateAsync: mockMutateAsync,
    });

    render(<PromptLibraryPage />, { wrapper: createWrapper() });

    // Click activate button
    fireEvent.click(screen.getByTestId('activate-2'));

    // Check that error was logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to activate prompt version:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('should not show activate button for already active prompts', () => {
    const mockMutateAsync = jest.fn();
    mockUseActivateVersion.mockReturnValue({
      mutateAsync: mockMutateAsync,
    });

    render(<PromptLibraryPage />, { wrapper: createWrapper() });

    // Active prompt should not have activate button
    expect(screen.queryByTestId('activate-1')).not.toBeInTheDocument();
    
    // Inactive prompt should have activate button
    expect(screen.getByTestId('activate-2')).toBeInTheDocument();
  });
});
