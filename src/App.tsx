import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/theme/theme';
import { UIProvider } from '@/context/UIContext';
import AppRoutes from '@/routes/AppRoutes';
import AppSnackbar from '@/components/common/AppSnackbar';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UIProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
          <AppSnackbar />
        </BrowserRouter>
      </UIProvider>
    </ThemeProvider>
  );
}
