import { Suspense } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { QueryProvider } from '../contexts/QueryProvider';
import { AppProvider, useUI } from '../contexts/AppContext';
import { getTheme } from '../theme';
import { Layout } from '../components/layout';
import { ErrorBoundary, GlobalErrorHandler, GlobalLoadingOverlay, LoadingSpinner } from '../components/common';
import { routes } from '../router';

// Inner App component that uses context
const AppContent = () => {
  const { theme } = useUI();
  
  return (
    <ThemeProvider theme={getTheme(theme)}>
      <CssBaseline />
      <GlobalErrorHandler />
      <GlobalLoadingOverlay />
      <Layout>
        <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
                index={route.index}
              />
            ))}
          </Routes>
        </Suspense>
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
