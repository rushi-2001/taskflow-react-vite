import { Box, Typography } from '@mui/material';

export default function TasksPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        Tasks
      </Typography>
      <Typography variant="body1">
        Manage your tasks here.
      </Typography>
    </Box>
  );
}
