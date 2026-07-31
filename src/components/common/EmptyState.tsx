import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = 'No Data Found',
  description = 'There is no data to display right now.',
  icon = <InboxIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />,
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        textAlign: 'center',
        bgcolor: 'background.paper',
        borderRadius: 4,
        border: '1px dashed',
        borderColor: 'divider',
      }}
    >
      {icon}
      <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3, maxWidth: 350 }}>
        {description}
      </Typography>
      {actionText && onAction && (
        <Button
          variant="outlined"
          onClick={onAction}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
}
