import { Box, Typography } from '@mui/material';

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        Dashboard
      </Typography>
      <Typography variant="body1">
        Welcome to your dashboard overview.
      </Typography>
    </Box>
  );
}
