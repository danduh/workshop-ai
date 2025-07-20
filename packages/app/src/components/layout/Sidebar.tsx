import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
} from '@mui/material';
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const drawerWidth = 240;

interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { text: 'Home', path: '/', icon: <HomeIcon /> },
  { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { text: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

export const Sidebar: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (path: string) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      dispatch({ type: 'SET_SIDEBAR_OPEN', payload: false });
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          transform: state.ui.sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: (theme) =>
            theme.transitions.create('transform', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          '@media (min-width: 960px)': {
            transform: 'translateX(0)', // Always visible on desktop
          },
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleItemClick(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark' 
                        ? theme.palette.grey[800]
                        : theme.palette.grey[200],
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path 
                      ? 'primary.main' 
                      : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
};
