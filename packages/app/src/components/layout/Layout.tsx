import React, { ReactNode } from 'react';
import { Box, Container, Toolbar } from '@mui/material';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAppContext } from '../../contexts/AppContext';

interface LayoutProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disableGutters?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  maxWidth = 'lg',
  disableGutters = false 
}) => {
  const { state } = useAppContext();

  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          backgroundColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? theme.palette.grey[900]
              : theme.palette.grey[50],
          transition: (theme) =>
            theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          marginLeft: {
            xs: 0,
            md: state.ui.sidebarOpen ? 0 : '-240px',
          },
        }}
      >
        <Toolbar /> {/* This creates space for the fixed header */}
        <Container 
          maxWidth={maxWidth}
          disableGutters={disableGutters}
          sx={{ 
            py: 3,
            px: disableGutters ? 0 : undefined,
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};
