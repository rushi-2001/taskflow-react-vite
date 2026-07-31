import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button, Typography, Container } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <ReportIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
            Something went wrong
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, textAlign: 'center', maxWidth: 480 }}
          >
            An unexpected visual component rendering error has occurred:{' '}
            {this.state.error?.message || 'Unknown render error'}
          </Typography>
          <Button
            variant="contained"
            onClick={this.handleReset}
            sx={{ py: 1.2, px: 3, borderRadius: 2 }}
          >
            Reload Dashboard
          </Button>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
