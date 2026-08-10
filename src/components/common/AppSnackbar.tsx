import { Snackbar, Alert } from '@mui/material';
import { useUI } from '@/context/UIContext';

export default function AppSnackbar() {
  const { state, closeNotification } = useUI();
  const current = state.snackbars?.[0];

  if (!current) return null;

  return (
    <Snackbar
      open={true}
      autoHideDuration={4000}
      onClose={() => closeNotification(current.id)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={() => closeNotification(current.id)}
        severity={current.severity}
        variant="filled"
        sx={{ width: '100%', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
      >
        {current.message}
      </Alert>
    </Snackbar>
  );
}
