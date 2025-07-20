import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useAppContext } from '../../contexts/AppContext';

export interface GlobalErrorHandlerProps {
  autoHideDuration?: number;
}

export const GlobalErrorHandler: React.FC<GlobalErrorHandlerProps> = ({
  autoHideDuration = 6000,
}) => {
  const { state, dispatch } = useAppContext();

  const handleClose = () => {
    dispatch({ type: 'SET_GLOBAL_ERROR', payload: null });
  };

  return (
    <Snackbar
      open={!!state.errors.global}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleClose} 
        severity="error" 
        sx={{ width: '100%' }}
        variant="filled"
      >
        {state.errors.global}
      </Alert>
    </Snackbar>
  );
};

// Hook for handling errors globally
export const useErrorHandler = () => {
  const { dispatch } = useAppContext();

  const showError = (error: string | Error) => {
    const message = error instanceof Error ? error.message : error;
    dispatch({ type: 'SET_GLOBAL_ERROR', payload: message });
  };

  const clearError = () => {
    dispatch({ type: 'SET_GLOBAL_ERROR', payload: null });
  };

  return { showError, clearError };
};
