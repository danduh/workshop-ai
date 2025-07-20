import { Button, Paper, Typography, Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api';

interface HomePageProps {
  title?: string;
}

const HomePage = ({ title = 'Welcome to the Workshop AI App' }: HomePageProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.get('/api/health').then(res => res.data),
    retry: false, // Disable retry for demo since API might not be running
  });

  return (
    <Box sx={{ padding: '1.5rem', maxWidth: '64rem', margin: '0 auto' }}>
      <Paper elevation={3} sx={{ padding: '2rem' }}>
        <Typography variant="h3" component="h1" sx={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          {title}
        </Typography>
        
        <Typography variant="body1" sx={{ marginBottom: '1rem' }}>
          This is a React TypeScript application built with:
        </Typography>
        
        <Box component="ul" sx={{ listStyle: 'disc', listStylePosition: 'inside', marginBottom: '1.5rem', '& li': { marginBottom: '0.5rem' } }}>
          <li><span role="img" aria-label="React">⚛️</span> React 19 with TypeScript</li>
          <li><span role="img" aria-label="Build">🏗️</span> Nx monorepo structure</li>
          <li><span role="img" aria-label="Package">📦</span> RSPack bundler for fast builds</li>
          <li><span role="img" aria-label="Art">🎨</span> Material-UI for components</li>
          <li><span role="img" aria-label="Search">🔍</span> React Query for data fetching</li>
          <li><span role="img" aria-label="Test tube">🧪</span> Jest + React Testing Library</li>
          <li><span role="img" aria-label="Theater masks">🎭</span> Playwright for E2E testing</li>
        </Box>

        <Box sx={{ marginBottom: '1.5rem' }}>
          <Typography variant="h6" sx={{ marginBottom: '0.5rem' }}>API Health Check:</Typography>
          {isLoading && (
            <Typography color="info.main">Checking API status...</Typography>
          )}
          {error && (
            <Typography color="error.main">
              API not available (expected during initial setup)
            </Typography>
          )}
          {data && (
            <Typography color="success.main">API is healthy! <span role="img" aria-label="Checkmark">✅</span></Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Button variant="contained" color="primary">
            Primary Button
          </Button>
          <Button variant="outlined" color="secondary">
            Secondary Button
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default HomePage;
