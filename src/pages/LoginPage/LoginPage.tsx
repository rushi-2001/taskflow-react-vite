import { Box, Card, Typography, Container } from '@mui/material';
import { useLoginPage } from './hooks/useLoginPage';
import LoginForm from './LoginForm';
import DevCredentialsInfo from './DevCredentialsInfo';

export default function LoginPage() {
  const { status, error, credentialsToFill, handleLoginSubmit, handleFillCredentials } =
    useLoginPage();

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
            position: 'relative',
          }}
        >
          <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
            <DevCredentialsInfo onFillCredentials={handleFillCredentials} />
          </Box>

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
          <LoginForm
            onSubmit={handleLoginSubmit}
            isLoading={status === 'loading'}
            error={error}
            credentialsToFill={credentialsToFill}
          />
        </Card>
      </Box>
    </Container>
  );
}
