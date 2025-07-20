import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppProvider, useAppContext } from './AppContext';

// Test component that uses the context
const TestComponent = () => {
  const { state, dispatch } = useAppContext();
  
  return (
    <div>
      <span data-testid="sidebar-open">{state.ui.sidebarOpen.toString()}</span>
      <span data-testid="loading">{state.ui.loading.toString()}</span>
      <span data-testid="theme">{state.ui.theme}</span>
      <span data-testid="user-id">{state.user.id || 'null'}</span>
      <span data-testid="global-error">{state.errors.global || 'null'}</span>
      
      <button onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}>
        Toggle Sidebar
      </button>
      <button onClick={() => dispatch({ type: 'SET_LOADING', payload: true })}>
        Set Loading
      </button>
      <button onClick={() => dispatch({ type: 'SET_THEME', payload: 'dark' })}>
        Set Dark Theme
      </button>
      <button onClick={() => dispatch({ 
        type: 'SET_USER', 
        payload: { id: '123', name: 'Test User', email: 'test@test.com' }
      })}>
        Set User
      </button>
      <button onClick={() => dispatch({ type: 'SET_GLOBAL_ERROR', payload: 'Test error' })}>
        Set Error
      </button>
    </div>
  );
};

describe('AppContext', () => {
  beforeEach(() => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );
  });

  it('should provide initial state', () => {
    expect(screen.getByTestId('sidebar-open')).toHaveTextContent('false');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(screen.getByTestId('user-id')).toHaveTextContent('null');
    expect(screen.getByTestId('global-error')).toHaveTextContent('null');
  });

  it('should handle TOGGLE_SIDEBAR action', () => {
    const toggleButton = screen.getByText('Toggle Sidebar');
    fireEvent.click(toggleButton);
    
    expect(screen.getByTestId('sidebar-open')).toHaveTextContent('true');
  });

  it('should handle SET_LOADING action', () => {
    const loadingButton = screen.getByText('Set Loading');
    fireEvent.click(loadingButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('should handle SET_THEME action', () => {
    const themeButton = screen.getByText('Set Dark Theme');
    fireEvent.click(themeButton);
    
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('should handle SET_USER action', () => {
    const userButton = screen.getByText('Set User');
    fireEvent.click(userButton);
    
    expect(screen.getByTestId('user-id')).toHaveTextContent('123');
  });

  it('should handle SET_GLOBAL_ERROR action', () => {
    const errorButton = screen.getByText('Set Error');
    fireEvent.click(errorButton);
    
    expect(screen.getByTestId('global-error')).toHaveTextContent('Test error');
  });
});

describe('useAppContext hook', () => {
  it('should throw error when used outside of AppProvider', () => {
    // Mock console.error to avoid noise in test output
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    
    const TestComponentWithoutProvider = () => {
      try {
        useAppContext();
        return <div>Should not render</div>;
      } catch {
        return <div data-testid="error">Error caught</div>;
      }
    };

    expect(() => render(<TestComponentWithoutProvider />)).toThrow(
      'useAppContext must be used within an AppProvider'
    );
    
    consoleErrorSpy.mockRestore();
  });
});
