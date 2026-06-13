import { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const CONSENT_KEY = 'trackingConsent';

export const hasConsent = () => localStorage.getItem(CONSENT_KEY) === 'accepted';

const ConsentBanner = () => {
  const theme = useTheme();
  const [visible, setVisible] = useState(() => localStorage.getItem(CONSENT_KEY) === null);

  if (!visible) return null;

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: { xs: 64, sm: 16 },
        left: '50%',
        transform: 'translateX(-50%)',
        width: { xs: 'calc(100% - 32px)', sm: 520 },
        zIndex: 2000,
        borderRadius: 3,
        p: 2.5,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        bgcolor: theme.palette.mode === 'dark' ? '#1a2744' : '#fff',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography sx={{ fontSize: '0.85rem', flex: 1, color: 'text.primary' }}>
        We use anonymous analytics to understand how visitors use this site. No personal data is shared with third parties.
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
        <Button size="small" variant="outlined" onClick={decline} sx={{ fontSize: '0.78rem' }}>
          Decline
        </Button>
        <Button size="small" variant="contained" onClick={accept} sx={{ fontSize: '0.78rem' }}>
          Accept
        </Button>
      </Box>
    </Paper>
  );
};

export default ConsentBanner;
