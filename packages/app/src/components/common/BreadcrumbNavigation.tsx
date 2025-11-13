import React from 'react';
import { Breadcrumbs, Typography, Link, Box } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { routeMetadata } from '../../router';

interface BreadcrumbItem {
  label: string;
  path?: string;
  current?: boolean;
}

export interface BreadcrumbNavigationProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
}

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  items,
  showHome = true,
}) => {
  const location = useLocation();

  // Generate breadcrumbs from route path if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    if (showHome) {
      breadcrumbs.push({
        label: 'Home',
        path: '/',
        current: location.pathname === '/',
      });
    }

    pathSegments.forEach((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const route = routeMetadata.find(r => r.path === path);
      
      breadcrumbs.push({
        label: route?.title || segment.charAt(0).toUpperCase() + segment.slice(1),
        path: path,
        current: index === pathSegments.length - 1,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs for single items
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-ol': {
            flexWrap: 'wrap',
          },
        }}
      >
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          if (isLast || !item.path) {
            return (
              <Typography
                key={index}
                color="textPrimary"
                sx={{ 
                  fontWeight: isLast ? 600 : 400,
                  fontSize: '0.875rem',
                }}
              >
                {item.label}
              </Typography>
            );
          }

          return (
            <Link
              key={index}
              component={RouterLink}
              to={item.path}
              underline="hover"
              color="inherit"
              sx={{
                fontSize: '0.875rem',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};
