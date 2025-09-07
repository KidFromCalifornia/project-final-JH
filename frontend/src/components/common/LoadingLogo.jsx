import { Box, Typography, useTheme } from '@mui/material';

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
          src="/src/assets/images/scc_logo_text.svg"
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
          src="/src/assets/images/scc_shield.svg"
          alt="Logo Shield"
          sx={{
            position: 'absolute',
            width: 150,
            height: 150,
          }}
        />
      </Box>
      <Typography color="common.black" variant="subtitle1" mt={2}>
        Currently Brewing...
      </Typography>
    </Box>
  );
};

export default LoadingLogo;
