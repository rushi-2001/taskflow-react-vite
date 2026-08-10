import { useState, useId } from 'react';
import {
  IconButton,
  Tooltip,
  Popover,
  Box,
  Typography,
  Chip,
  Button,
  Divider,
  Stack,
  Alert,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { ADMIN_CREDENTIALS, USER_CREDENTIALS } from '@/utils/config';

interface DevCredentialsInfoProps {
  onFillCredentials?: (email: string, password: string) => void;
}

const DEV_CREDENTIALS_LIST = [
  {
    key: 'admin',
    label: 'Admin Role',
    chipColor: 'primary' as const,
    email: ADMIN_CREDENTIALS.email,
    password: ADMIN_CREDENTIALS.password,
    fillLabel: 'Fill Admin Credentials',
  },
  {
    key: 'user',
    label: 'User Role',
    chipColor: 'default' as const,
    email: USER_CREDENTIALS.email,
    password: USER_CREDENTIALS.password,
    fillLabel: 'Fill User Credentials',
  },
];

export default function DevCredentialsInfo({ onFillCredentials }: DevCredentialsInfoProps) {
  const isDev = Boolean(import.meta.env.DEV || import.meta.env.MODE === 'development');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [copiedRole, setCopiedRole] = useState<string | null>(null);
  const popoverId = useId();

  if (!isDev) {
    return null;
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleCopy = (roleKey: string, email: string, password: string) => {
    const text = `Email: ${email}\nPassword: ${password}`;
    navigator.clipboard.writeText(text);
    setCopiedRole(roleKey);
    setTimeout(() => {
      setCopiedRole(null);
    }, 2000);
  };

  const handleFill = (email: string, password: string) => {
    if (onFillCredentials) {
      onFillCredentials(email, password);
      handleClose();
    }
  };

  return (
    <>
      <Tooltip title="Local Dev Credentials">
        <IconButton
          onClick={handleClick}
          color="info"
          size="medium"
          aria-describedby={open ? popoverId : undefined}
          sx={{
            bgcolor: 'action.hover',
            '&:hover': {
              bgcolor: 'action.selected',
            },
          }}
        >
          <InfoOutlinedIcon />
        </IconButton>
      </Tooltip>

      <Popover
        id={open ? popoverId : undefined}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              p: 2.5,
              width: 320,
              borderRadius: 2,
              boxShadow: 6,
            },
          },
        }}
      >
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Demo Credentials
          </Typography>
          <Chip
            label="DEV ONLY"
            color="warning"
            size="small"
            sx={{ fontWeight: 700, height: 20, fontSize: '0.65rem' }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Use these pre-configured credentials to test different user roles locally.
        </Typography>

        <Stack spacing={2} divider={<Divider flexItem />}>
          {DEV_CREDENTIALS_LIST.map((item) => (
            <Box key={item.key}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 0.5,
                }}
              >
                <Chip
                  label={item.label}
                  color={item.chipColor}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleCopy(item.key, item.email, item.password)}
                  title={`Copy ${item.label}`}
                >
                  {copiedRole === item.key ? (
                    <CheckIcon fontSize="small" color="success" />
                  ) : (
                    <ContentCopyIcon fontSize="small" />
                  )}
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 0.5 }}>
                <strong>Email:</strong> {item.email}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                <strong>Password:</strong> {item.password}
              </Typography>
              {onFillCredentials && (
                <Button
                  size="small"
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 1, textTransform: 'none' }}
                  onClick={() => handleFill(item.email, item.password)}
                >
                  {item.fillLabel}
                </Button>
              )}
            </Box>
          ))}
        </Stack>

        {copiedRole && (
          <Alert
            severity="success"
            sx={{ mt: 2, py: 0, px: 1, '& .MuiAlert-message': { py: 0.5 } }}
          >
            Credentials copied to clipboard!
          </Alert>
        )}
      </Popover>
    </>
  );
}
