import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Route, Routes, Link } from 'react-router-dom';
import { QueryProvider } from '../contexts/QueryProvider';
import { theme } from '../theme';
import HomePage from '../pages/HomePage';

export function App() {
  return (
    <QueryProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/page-2"
              element={
                <div className="container-padding">
                  <Link to="/" style={{ color: '#1976d2', textDecoration: 'none' }}>
                    ← Back to Home
                  </Link>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '1rem' }}>
                    Page 2
                  </h1>
                  <p style={{ marginTop: '0.5rem' }}>This is a sample second page.</p>
                </div>
              }
            />
          </Routes>
        </div>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
