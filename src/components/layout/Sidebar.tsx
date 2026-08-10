import { useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
  Box,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useUI } from '@/context/UIContext';
import { useAppSelector } from '@/store/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 240;

export default function Sidebar() {
  const { state, setSidebar } = useUI();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (isMobile) {
      setSidebar(false);
    } else {
      setSidebar(true);
    }
  }, [isMobile, setSidebar]);

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['admin', 'user'] },
    { text: 'Tasks', icon: <PlaylistAddCheckIcon />, path: '/tasks', roles: ['admin', 'user'] },
    { text: 'Admin Panel', icon: <AdminPanelSettingsIcon />, path: '/admin', roles: ['admin'] },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setSidebar(false);
    }
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto', mt: 1 }}>
      <List>
        {navItems
          .filter((item) => user && item.roles.includes(user.role))
          .map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ px: 1.5, py: 0.5 }}>
                <ListItemButton
                  selected={active}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 1.5,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'primary.contrastText',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: active ? 'primary.contrastText' : 'text.secondary',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: active ? 600 : 500 }}>
                        {item.text}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={state.sidebarOpen}
      onClose={() => setSidebar(false)}
      sx={{
        width: isMobile ? 0 : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          boxShadow: isMobile ? '4px 0 24px rgba(0,0,0,0.05)' : 'none',
        },
      }}
    >
      <Toolbar />
      {drawerContent}
    </Drawer>
  );
}
