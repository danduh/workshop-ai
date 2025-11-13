import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CreatePromptPage from './CreatePromptPage';
import { getTheme } from '../theme';

// Mock the navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the useCreatePrompt hook
const mockMutateAsync = jest.fn();
jest.mock('../hooks/usePrompts', () => ({
  useCreatePrompt: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
    error: null,
  }),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Set up localStorage mock
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={getTheme('light')}>
          {component}
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('CreatePromptPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders the create prompt form', () => {
    renderWithProviders(<CreatePromptPage />);
    
    expect(screen.getByText('Create New Prompt')).toBeDefined();
    expect(screen.getByLabelText(/prompt key/i)).toBeDefined();
    expect(screen.getByLabelText(/version/i)).toBeDefined();
    expect(screen.getByLabelText(/model/i)).toBeDefined();
    expect(screen.getByLabelText(/created by/i)).toBeDefined();
    expect(screen.getByLabelText(/prompt content/i)).toBeDefined();
  });

  it('handles form field changes', () => {
    renderWithProviders(<CreatePromptPage />);
    
    const promptKeyInput = screen.getByLabelText(/prompt key/i);
    fireEvent.change(promptKeyInput, { target: { value: 'TEST_PROMPT' } });
    
    expect((promptKeyInput as HTMLInputElement).value).toBe('TEST_PROMPT');
  });

  it('toggles preview mode', () => {
    renderWithProviders(<CreatePromptPage />);
    
    const contentTextArea = screen.getByLabelText(/prompt content/i);
    fireEvent.change(contentTextArea, { target: { value: 'Test prompt content' } });
    
    const previewButton = screen.getByRole('button', { name: /preview/i });
    fireEvent.click(previewButton);
    
    expect(screen.getByText('Test prompt content')).toBeDefined();
    expect(screen.getByRole('button', { name: /edit/i })).toBeDefined();
  });

  it('shows word and character count', () => {
    renderWithProviders(<CreatePromptPage />);
    
    const contentTextArea = screen.getByLabelText(/prompt content/i);
    fireEvent.change(contentTextArea, { target: { value: 'Hello world test' } });
    
    expect(screen.getByText(/Words: 3 \| Characters: 16/)).toBeDefined();
  });

  it('cancels and navigates back', () => {
    renderWithProviders(<CreatePromptPage />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('prompt-draft');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('loads draft from localStorage on mount', () => {
    const draftData = {
      promptKey: 'DRAFT_PROMPT',
      content: 'Draft content',
      createdBy: 'draft@example.com',
    };
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(draftData));
    
    renderWithProviders(<CreatePromptPage />);
    
    expect(screen.getByDisplayValue('DRAFT_PROMPT')).toBeDefined();
    expect(screen.getByDisplayValue('Draft content')).toBeDefined();
    expect(screen.getByDisplayValue('draft@example.com')).toBeDefined();
  });

  it('sets active version toggle', () => {
    renderWithProviders(<CreatePromptPage />);
    
    const activeSwitch = screen.getByLabelText(/set as active version/i);
    fireEvent.click(activeSwitch);
    
    expect((activeSwitch as HTMLInputElement).checked).toBe(true);
  });
});
