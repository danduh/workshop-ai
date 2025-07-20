import React from 'react';
import { Box } from '@mui/material';
import { WelcomeCard } from '../components/WelcomeCard';

const HomePage: React.FC = () => {
  return (
    <Box sx={{ py: 2 }}>
      <WelcomeCard />
    </Box>
  );
};

export default HomePage;
