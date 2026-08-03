import { Chip } from '@mui/material';
import type { TaskStatus } from '@/types/task.types';

interface StatusChipProps {
  value: TaskStatus;
}

export default function StatusChip({ value }: StatusChipProps) {
  const getStyles = () => {
    switch (value) {
      case 'completed':
        return { bgcolor: '#dcfce7', color: '#16a34a', label: 'Completed' };
      case 'in-progress':
        return { bgcolor: '#ffedd5', color: '#ea580c', label: 'In Progress' };
      case 'pending':
        return { bgcolor: '#e2e8f0', color: '#475569', label: 'Pending' };
      default:
        return { bgcolor: '#f1f5f9', color: '#64748b', label: value };
    }
  };

  const styles = getStyles();

  return (
    <Chip
      label={styles.label}
      size="small"
      sx={{
        bgcolor: styles.bgcolor,
        color: styles.color,
        fontWeight: 600,
        fontSize: '0.75rem',
        borderRadius: '6px',
        '& .MuiChip-label': { px: 1.2 },
        border: 'none',
        height: 24,
      }}
    />
  );
}
