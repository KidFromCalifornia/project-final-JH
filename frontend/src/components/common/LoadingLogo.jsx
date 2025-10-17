import { Box, Typography, useTheme } from '@mui/material';
import logoText from '../../assets/images/scc_logo_text.svg';
import logoShield from '../../assets/images/scc_shield.svg';

const spinKeyframes = {
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '25%': { transform: 'rotate(90deg)' },
    '50%': { transform: 'rotate(180deg)' },
    '75%': { transform: 'rotate(270deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};
const LoadingLogo = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Box
        sx={{
          position: 'relative',
          width: 300,
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...spinKeyframes,
        }}
      >
        <Box
          component="img"
          src={logoText}
          alt="Logo Text"
          sx={{
            position: 'absolute',
            top: -10,
            left: 0,
            width: 300,
            height: 300,
            animation: 'spin 8s ease-in-out infinite',
            filter: isDarkMode ? 'brightness(0) invert(1)' : undefined,
            transform: 'translateZ(0)', // Force hardware acceleration
            backfaceVisibility: 'hidden', // Reduce motion blur
            '&:hover': {
              animationPlayState: 'paused',
            },
          }}
        />
        <Box
          component="img"
          src={logoShield}
          alt="Logo Shield"
          sx={{
            position: 'absolute',
            width: 150,
            height: 150,
          }}
        />
      </Box>
      <Typography variant="subtitle1" mt={2} sx={{ color: theme.palette.text.primary }}>
        Currently Brewing...
      </Typography>
    </Box>
  );
};

export default LoadingLogo;
