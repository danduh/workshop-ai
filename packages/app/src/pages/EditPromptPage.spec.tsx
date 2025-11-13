import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EditPromptPage from './EditPromptPage';
import { usePromptVersion, useUpdatePrompt } from '../hooks/usePrompts';

// Mock the hooks
jest.mock('../hooks/usePrompts');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ promptKey: 'TEST_PROMPT', version: '1.0.0' }),
  useNavigate: () => jest.fn(),
}));

const mockUsePromptVersion = usePromptVersion as jest.MockedFunction<typeof usePromptVersion>;
const mockUseUpdatePrompt = useUpdatePrompt as jest.MockedFunction<typeof useUpdatePrompt>;

const mockPromptData = {
  data: {
    data: {
      id: '1',
      promptKey: 'TEST_PROMPT',
      version: '1.0.0',
      isActive: true,
      dateCreation: '2024-01-01T00:00:00Z',
      modelName: 'GPT-4o',
      content: 'Test prompt content',
      description: 'Test description',
      tags: ['test', 'sample'],
      createdBy: 'test@example.com',
    }
  }
};

const renderComponent = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <EditPromptPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('EditPromptPage', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    mockUsePromptVersion.mockReturnValue({
      data: mockPromptData,
      isLoading: false,
      error: null,
    } as any);

    mockUseUpdatePrompt.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    } as any);
  });

  it('renders the edit prompt form', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue('TEST_PROMPT')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1.0.0')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test prompt content')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    });
  });

  it('shows loading state', () => {
    mockUsePromptVersion.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    } as any);

    renderComponent();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state when prompt fails to load', () => {
    mockUsePromptVersion.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to load'),
    } as any);

    renderComponent();

    expect(screen.getByText('Failed to load prompt. Please try again.')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderComponent();

    // Clear content field
    await waitFor(() => {
      const contentField = screen.getByLabelText('Prompt Content');
      fireEvent.change(contentField, { target: { value: '' } });
    });

    // Try to submit
    const submitButton = screen.getByText('Save Changes');
    fireEvent.click(submitButton);

    // Should not call the mutation since form is invalid
    expect(mockUseUpdatePrompt().mutateAsync).not.toHaveBeenCalled();
  });

  it('shows unsaved changes warning', async () => {
    renderComponent();

    // Make a change
    await waitFor(() => {
      const contentField = screen.getByLabelText('Prompt Content');
      fireEvent.change(contentField, { target: { value: 'Updated content' } });
    });

    // Wait for the changes indicator
    await waitFor(() => {
      expect(screen.getByText('You have unsaved changes. They will be automatically saved as a draft.')).toBeInTheDocument();
    });
  });

  it('disables prompt key and version fields', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue('TEST_PROMPT')).toBeDisabled();
      expect(screen.getByDisplayValue('1.0.0')).toBeDisabled();
    });
  });

  it('toggles preview mode', async () => {
    renderComponent();

    await waitFor(() => {
      const previewSwitch = screen.getByRole('checkbox', { name: /preview mode/i });
      fireEvent.click(previewSwitch);
    });

    // Should show preview instead of textarea
    expect(screen.queryByLabelText('Prompt Content')).not.toBeInTheDocument();
    expect(screen.getByText('Test prompt content')).toBeInTheDocument();
  });

  it('updates content and shows character count', async () => {
    renderComponent();

    const newContent = 'Updated prompt content with more words';
    
    await waitFor(() => {
      const contentField = screen.getByLabelText('Prompt Content');
      fireEvent.change(contentField, { target: { value: newContent } });
    });

    // Check character and word count
    const expectedCharCount = newContent.length;
    const expectedWordCount = newContent.split(/\s+/).length;
    
    await waitFor(() => {
      expect(screen.getByText(`${expectedCharCount} characters, ${expectedWordCount} words`)).toBeInTheDocument();
    });
  });

  it('submits form with updated data', async () => {
    const mockMutateAsync = jest.fn().mockResolvedValue({});
    mockUseUpdatePrompt.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as any);

    renderComponent();

    // Wait for form to load and make changes
    await waitFor(() => {
      const contentField = screen.getByLabelText('Prompt Content');
      fireEvent.change(contentField, { target: { value: 'Updated content' } });
    });

    // Submit the form
    const submitButton = screen.getByText('Save Changes');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        promptKey: 'TEST_PROMPT',
        version: '1.0.0',
        data: expect.objectContaining({
          content: 'Updated content',
        }),
      });
    });
  });

  it('handles tag changes', async () => {
    renderComponent();

    await waitFor(() => {
      const tagsInput = screen.getByLabelText('Tags');
      
      // Focus and type new tag
      fireEvent.focus(tagsInput);
      fireEvent.change(tagsInput, { target: { value: 'new-tag' } });
      fireEvent.keyDown(tagsInput, { key: 'Enter' });
    });

    // Should add the new tag (implementation depends on Autocomplete behavior)
  });

  it('handles active status toggle', async () => {
    renderComponent();

    await waitFor(() => {
      const activeSwitch = screen.getByRole('checkbox', { name: /set as active version/i });
      fireEvent.click(activeSwitch);
    });

    // Switch should be checked
    await waitFor(() => {
      const activeSwitch = screen.getByRole('checkbox', { name: /set as active version/i });
      expect(activeSwitch).toBeChecked();
    });
  });
});
