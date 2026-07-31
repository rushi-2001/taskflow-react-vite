import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#aa3bff', // vibrant violet
      light: '#c084fc',
      dark: '#8b2ddb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#06b6d4', // cyan accent
      light: '#22d3ee',
      dark: '#0891b2',
    },
    background: {
      default: '#f8fafc', // soft slate blue-grey
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a', // deep slate
      secondary: '#475569',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px 0 rgba(15, 23, 42, 0.04)',
          border: '1px solid #f1f5f9',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#ffffff',
            transition: 'border-color 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#f8fafc',
            },
          },
        },
      },
    },
  },
});
