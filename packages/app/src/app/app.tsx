import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { QueryProvider } from '../contexts/QueryProvider';
import { AppProvider, useAppContext } from '../contexts/AppContext';
import { getTheme } from '../theme';
import { Layout } from '../components/layout';
import { ErrorBoundary, GlobalErrorHandler, GlobalLoadingOverlay } from '../components/common';
import HomePage from '../pages/HomePage';

// Inner App component that uses context
const AppContent = () => {
  const { state } = useAppContext();
  
  return (
    <ThemeProvider theme={getTheme(state.ui.theme)}>
      <CssBaseline />
      <GlobalErrorHandler />
      <GlobalLoadingOverlay />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<div>Dashboard Page (Coming Soon)</div>} />
          <Route path="/settings" element={<div>Settings Page (Coming Soon)</div>} />
          <Route
            path="/page-2"
            element={<div>Page 2 (Legacy route - will be removed)</div>}
          />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
