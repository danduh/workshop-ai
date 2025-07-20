import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { useAppContext } from '../contexts/AppContext';
import { useLoading, useErrorHandler } from './common';

export const WelcomeCard: React.FC = () => {
  const { state } = useAppContext();
  const { setLoading } = useLoading();
  const { showError } = useErrorHandler();

  const handleTestLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const handleTestError = () => {
    showError('This is a test error message!');
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Workshop AI! <span role="img" aria-label="rocket">🚀</span>
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Your core infrastructure is now set up with the following features:
        </Typography>
        
        <Box component="ul" sx={{ pl: 2 }}>
          <li><span role="img" aria-label="checkmark">✅</span> Global state management with React Context</li>
          <li><span role="img" aria-label="checkmark">✅</span> Responsive layout with Header & Sidebar</li>
          <li><span role="img" aria-label="checkmark">✅</span> Dark/Light theme support (toggle in header)</li>
          <li><span role="img" aria-label="checkmark">✅</span> Error boundaries and global error handling</li>
          <li><span role="img" aria-label="checkmark">✅</span> Loading states and skeleton screens</li>
          <li><span role="img" aria-label="checkmark">✅</span> React Router integration</li>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            onClick={handleTestLoading}
          >
            Test Loading
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleTestError}
          >
            Test Error
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
          Current theme: {state.ui.theme} mode
        </Typography>
      </CardContent>
    </Card>
  );
};
