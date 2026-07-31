import { Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
      <SecurityIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
        Access Denied
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center', maxWidth: 480 }}>
        You do not have the required permissions or role rights to access this page. Please contact your system administrator.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ py: 1.2, px: 3, borderRadius: 2 }}>
        Go to Dashboard
      </Button>
    </Container>
  );
}
