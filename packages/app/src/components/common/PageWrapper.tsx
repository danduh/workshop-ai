import React, { ReactNode } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { BreadcrumbNavigation, BreadcrumbNavigationProps } from './BreadcrumbNavigation';

interface PageWrapperProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbNavigationProps['items'];
  showBreadcrumbs?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  elevation?: number;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  title,
  subtitle,
  breadcrumbs,
  showBreadcrumbs = true,
  maxWidth = 'lg',
  elevation = 0,
}) => {
  const content = (
    <>
      {showBreadcrumbs && (
        <BreadcrumbNavigation items={breadcrumbs} />
      )}
      
      {(title || subtitle) && (
        <Box sx={{ mb: 3 }}>
          {title && (
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              {title}
            </Typography>
          )}
          
          {subtitle && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      
      {children}
    </>
  );

  if (elevation > 0) {
    return (
      <Paper elevation={elevation} sx={{ p: 3 }}>
        {content}
      </Paper>
    );
  }

  return <Box>{content}</Box>;
};
