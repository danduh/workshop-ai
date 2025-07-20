import React from 'react';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';
import { useAppContext } from '../../contexts/AppContext';

export interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  overlay?: boolean;
  color?: 'primary' | 'secondary' | 'inherit';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  message = 'Loading...',
  overlay = false,
  color = 'primary',
}) => {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 3,
      }}
    >
      <CircularProgress size={size} color={color} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (overlay) {
    return (
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
        open
      >
        {content}
      </Backdrop>
    );
  }

  return content;
};

// Hook for managing global loading state
export const useLoading = () => {
  const { state, dispatch } = useAppContext();

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  return {
    isLoading: state.ui.loading,
    setLoading,
  };
};

// Global loading overlay component
export const GlobalLoadingOverlay: React.FC = () => {
  const { state } = useAppContext();

  if (!state.ui.loading) {
    return null;
  }

  return <LoadingSpinner overlay message="Please wait..." />;
};
