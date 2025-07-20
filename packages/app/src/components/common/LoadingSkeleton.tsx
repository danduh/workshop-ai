import React from 'react';
import { 
  Box, 
  Skeleton, 
  Card, 
  CardContent, 
  Stack 
} from '@mui/material';

export interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'table' | 'form' | 'custom';
  count?: number;
  height?: number | string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  variant = 'card', 
  count = 1, 
  height = 200 
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="rounded" height={height} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        );

      case 'list':
        return (
          <Box sx={{ mb: 2 }}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Box>
            ))}
          </Box>
        );

      case 'table':
        return (
          <Box sx={{ mb: 2 }}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <Skeleton variant="text" width="20%" />
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="text" width="25%" />
                <Skeleton variant="text" width="25%" />
              </Box>
            ))}
          </Box>
        );

      case 'form':
        return (
          <Stack spacing={3} sx={{ mb: 2 }}>
            <Box>
              <Skeleton variant="text" width="30%" height={20} />
              <Skeleton variant="rounded" height={40} />
            </Box>
            <Box>
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="rounded" height={40} />
            </Box>
            <Box>
              <Skeleton variant="text" width="35%" height={20} />
              <Skeleton variant="rounded" height={100} />
            </Box>
            <Skeleton variant="rounded" width="30%" height={40} />
          </Stack>
        );

      default:
        return <Skeleton variant="rounded" height={height} sx={{ mb: 2 }} />;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index}>
          {renderSkeleton()}
        </Box>
      ))}
    </>
  );
};

// Specialized loading components
export const CardLoadingSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <LoadingSkeleton variant="card" count={count} />
);

export const ListLoadingSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <LoadingSkeleton variant="list" count={count} />
);

export const TableLoadingSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => (
  <LoadingSkeleton variant="table" count={count} />
);

export const FormLoadingSkeleton: React.FC = () => (
  <LoadingSkeleton variant="form" count={1} />
);
