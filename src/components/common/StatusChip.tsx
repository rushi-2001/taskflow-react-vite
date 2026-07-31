import { Chip } from '@mui/material';

interface StatusChipProps {
  type: 'status' | 'priority';
  value: string;
}

export default function StatusChip({ type, value }: StatusChipProps) {
  const getStyles = () => {
    if (type === 'priority') {
      switch (value) {
        case 'high':
          return { bgcolor: '#fee2e2', color: '#ef4444', label: 'High' };
        case 'medium':
          return { bgcolor: '#fef3c7', color: '#d97706', label: 'Medium' };
        case 'low':
          return { bgcolor: '#e0f2fe', color: '#0284c7', label: 'Low' };
        default:
          return { bgcolor: '#f1f5f9', color: '#64748b', label: value };
      }
    } else {
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
