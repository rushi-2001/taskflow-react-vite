import { Box, Typography, LinearProgress } from '@mui/material';

interface StackPriorityRowProps {
  label: string;
  count: number;
  value: number;
  color: string;
}

export default function StackPriorityRow({ label, count, value, color }: StackPriorityRowProps) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color }}>
          {count} {count === 1 ? 'task' : 'tasks'}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: 'rgba(0,0,0,0.05)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            bgcolor: color,
          },
        }}
      />
    </Box>
  );
}
