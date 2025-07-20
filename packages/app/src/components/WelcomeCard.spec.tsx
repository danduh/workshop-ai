import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppProvider } from '../contexts/AppContext';
import { WelcomeCard } from './WelcomeCard';

// Mock the hooks from common components
jest.mock('./common', () => ({
  useLoading: () => ({
    setLoading: jest.fn(),
  }),
  useErrorHandler: () => ({
    showError: jest.fn(),
  }),
}));

describe('WelcomeCard', () => {
  const renderWelcomeCard = () => {
    render(
      <AppProvider>
        <WelcomeCard />
      </AppProvider>
    );
  };

  it('should render welcome message and features list', () => {
    renderWelcomeCard();

    expect(screen.getByText(/Welcome to Workshop AI!/)).toBeInTheDocument();
    expect(screen.getByText(/Your core infrastructure is now set up/)).toBeInTheDocument();
    
    // Check for feature list items
    expect(screen.getByText(/Global state management with React Context/)).toBeInTheDocument();
    expect(screen.getByText(/Responsive layout with Header & Sidebar/)).toBeInTheDocument();
    expect(screen.getByText(/Dark\/Light theme support/)).toBeInTheDocument();
    expect(screen.getByText(/Error boundaries and global error handling/)).toBeInTheDocument();
    expect(screen.getByText(/Loading states and skeleton screens/)).toBeInTheDocument();
    expect(screen.getByText(/React Router integration/)).toBeInTheDocument();
  });

  it('should render test buttons', () => {
    renderWelcomeCard();

    expect(screen.getByText('Test Loading')).toBeInTheDocument();
    expect(screen.getByText('Test Error')).toBeInTheDocument();
  });

  it('should display current theme mode', () => {
    renderWelcomeCard();

    expect(screen.getByText(/Current theme: light mode/)).toBeInTheDocument();
  });

  it('should handle test button clicks', () => {
    renderWelcomeCard();

    const loadingButton = screen.getByText('Test Loading');
    const errorButton = screen.getByText('Test Error');

    // These buttons should be clickable without throwing errors
    fireEvent.click(loadingButton);
    fireEvent.click(errorButton);

    expect(loadingButton).toBeInTheDocument();
    expect(errorButton).toBeInTheDocument();
  });
});
