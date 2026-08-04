import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Card, Typography, Container } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { login, clearError } from '@/features/auth/authSlice';
import LoginForm from './LoginForm';
import type { AuthCredentials } from '@/types/user.types';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((state) => state.auth);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleLoginSubmit = (credentials: AuthCredentials) => {
    dispatch(login(credentials));
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Card
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
              TF
            </Typography>
          </Box>
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}
          >
            Welcome to TaskFlow
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Manage your project tasks efficiently with roles and status metrics.
          </Typography>
          <LoginForm onSubmit={handleLoginSubmit} isLoading={status === 'loading'} error={error} />
        </Card>
      </Box>
    </Container>
  );
}
