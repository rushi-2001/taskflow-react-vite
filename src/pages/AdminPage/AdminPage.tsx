import { Box, Typography } from '@mui/material';

export default function AdminPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        Admin Panel
      </Typography>
      <Typography variant="body1">
        Admin dashboard metrics and details.
      </Typography>
    </Box>
  );
}
