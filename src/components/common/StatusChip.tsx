import { Chip } from '@mui/material';
import type { TaskStatus } from '@/types/task.types';

interface StatusChipProps {
  value: TaskStatus;
}

export default function StatusChip({ value }: StatusChipProps) {
  const getChipProps = () => {
    switch (value) {
      case 'completed':
        return { color: 'success' as const, label: 'Completed' };
      case 'in-progress':
        return { color: 'warning' as const, label: 'In Progress' };
      case 'pending':
        return { color: 'default' as const, label: 'Pending' };
      default:
        return { color: 'default' as const, label: value };
    }
  };

  const props = getChipProps();

  return (
    <Chip
      {...props}
      size="small"
      variant="outlined"
      sx={{
        fontWeight: 600,
        fontSize: '0.75rem',
      }}
    />
  );
}
