import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

export default function StatCard({ title, value, icon, color = 'primary' }: StatCardProps) {
  const getColorScheme = () => {
    switch (color) {
      case 'success':
        return { border: '#16a34a', bg: 'rgba(22, 163, 74, 0.04)', text: '#16a34a' };
      case 'warning':
        return { border: '#ea580c', bg: 'rgba(234, 88, 12, 0.04)', text: '#ea580c' };
      case 'error':
        return { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.04)', text: '#ef4444' };
      case 'info':
        return { border: '#0284c7', bg: 'rgba(2, 132, 199, 0.04)', text: '#0284c7' };
      default:
        return { border: '#aa3bff', bg: 'rgba(170, 59, 255, 0.04)', text: '#aa3bff' };
    }
  };

  const scheme = getColorScheme();

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        borderTop: `4px solid ${scheme.border}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '0.75rem',
              }}
            >
              {title}
            </Typography>
            <Typography variant="h3" sx={{ mt: 1, fontWeight: 800, color: 'text.primary' }}>
              {value}
            </Typography>
          </Box>
          {icon && (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                bgcolor: scheme.bg,
                color: scheme.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
