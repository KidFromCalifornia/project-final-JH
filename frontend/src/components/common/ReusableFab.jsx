import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { useCafeStore } from '../../stores/useCafeStore';

const ReusableFab = ({
  icon,
  tooltipTitle,
  onClick,
  ariaLabel,
  placement = 'left',
  size = { xs: '3rem', sm: '3.5rem' },
  showCondition = true, // Allow conditional rendering
  ...props
}) => {
  const theme = useTheme();
  const themeMode = useCafeStore((state) => state.themeMode);
  const isDarkMode = themeMode === 'dark';

  // Don't render if condition is false
  if (!showCondition) return null;

  return (
    <Tooltip title={tooltipTitle} arrow placement={placement}>
      <Fab
        onClick={onClick}
        color={isDarkMode ? 'primary' : 'primary'}
        aria-label={ariaLabel}
        sx={{
          color: theme.palette.light.main,
          width: size,
          height: size,
          border: `1px solid ${isDarkMode ? alpha(theme.palette.light.main, 0.3) : theme.palette.secondary.main}`,
          boxShadow: `0.25rem 0.25rem 0.5rem ${theme.palette.primary.main}40`,
          '&:hover': {
            color: theme.palette.accentStrong.main,
          },
        }}
        {...props}
      >
        {icon}
      </Fab>
    </Tooltip>
  );
};

export default ReusableFab;
