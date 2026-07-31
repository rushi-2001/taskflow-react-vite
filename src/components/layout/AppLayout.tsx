import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useUI } from '@/context/UIContext';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 240;

export default function AppLayout() {
  const { state } = useUI();
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: {
            md: state.sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
            xs: '100%',
          },
          ml: {
            md: state.sidebarOpen ? 0 : `-${drawerWidth}px`,
            xs: 0,
          },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
