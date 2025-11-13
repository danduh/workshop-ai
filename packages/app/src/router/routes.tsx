import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load pages for better performance
const PromptLibraryPage = lazy(() => import('../pages/PromptLibraryPage'));
const PromptDetailPage = lazy(() => import('../pages/PromptDetailPage'));
const PromptFamilyPage = lazy(() => import('../pages/PromptFamilyPage'));
const CreatePromptPage = lazy(() => import('../pages/CreatePromptPage'));
const EditPromptPage = lazy(() => import('../pages/EditPromptPage'));
const CreateVersionPage = lazy(() => import('../pages/CreateVersionPage'));
const DashboardPage = lazy(() => 
  Promise.resolve({ default: () => <div>Dashboard Page (Coming Soon)</div> })
);
const SettingsPage = lazy(() => 
  Promise.resolve({ default: () => <div>Settings Page (Coming Soon)</div> })
);
const NotFoundPage = lazy(() => 
  Promise.resolve({ default: () => <div>404 - Page Not Found</div> })
);

// Route configuration
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <PromptLibraryPage />,
    index: true,
  },
  {
    path: '/prompts/create',
    element: <CreatePromptPage />,
  },
  {
    path: '/prompts/:promptKey',
    element: <PromptFamilyPage />,
  },
  {
    path: '/prompts/:promptKey/create-version',
    element: <CreateVersionPage />,
  },
  {
    path: '/prompts/:promptKey/version/:version',
    element: <PromptDetailPage />,
  },
  {
    path: '/prompts/:promptKey/version/:version/edit',
    element: <EditPromptPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
  // Legacy route for backward compatibility
  {
    path: '/page-2',
    element: <div>Page 2 (Legacy route - will be removed)</div>,
  },
  // Catch-all route for 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

// Route metadata for navigation
export interface RouteMetadata {
  path: string;
  title: string;
  icon?: React.ReactNode;
  public?: boolean;
  hideInNavigation?: boolean;
}

export const routeMetadata: RouteMetadata[] = [
  {
    path: '/',
    title: 'Prompt Library',
    public: true,
  },
  {
    path: '/prompts/create',
    title: 'Create Prompt',
    public: true,
  },
  {
    path: '/prompts/:promptKey/create-version',
    title: 'Create Version',
    public: true,
    hideInNavigation: true,
  },
  {
    path: '/prompts/:promptKey/version/:version/edit',
    title: 'Edit Prompt',
    public: true,
    hideInNavigation: true,
  },
  {
    path: '/dashboard',
    title: 'Dashboard',
    public: true,
  },
  {
    path: '/settings',
    title: 'Settings',
    public: true,
  },
  {
    path: '/page-2',
    title: 'Page 2 (Legacy)',
    public: true,
    hideInNavigation: true,
  },
];
