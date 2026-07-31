import { Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorIcon from '@mui/icons-material/Error';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
      }}
    >
      <ErrorIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
        404 - Page Not Found
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, textAlign: 'center', maxWidth: 480 }}
      >
        The page you are looking for does not exist or has been moved to another URL.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/dashboard')}
        sx={{ py: 1.2, px: 3, borderRadius: 2 }}
      >
        Go to Dashboard
      </Button>
    </Container>
  );
}
