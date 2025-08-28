import { useTheme } from '@mui/material/styles';
import { commonStyles, colorUtils } from '../styles/themeUtils';

/**
 * Custom hook for accessing theme utilities and common styles
 * Provides easy access to theme-aware styling functions
 */
export const useThemeUtils = () => {
  const theme = useTheme();

  return {
    // Theme object
    theme,
    
    // Common styles with theme applied
    styles: {
      glassMorphism: commonStyles.glassMorphism(theme),
      cardHover: commonStyles.cardHover(theme),
      skeleton: commonStyles.skeleton(theme),
      focusVisible: commonStyles.focusVisible(theme),
      gradients: {
        primary: commonStyles.gradients.primary(theme),
        accent: commonStyles.gradients.accent(theme),
        coffee: commonStyles.gradients.coffee(theme),
      },
      coffeeAccent: commonStyles.coffeeAccent(theme),
      ...commonStyles,
    },

    // Color utilities with theme colors
    colors: {
      alpha: (color, alpha) => colorUtils.alpha(color, alpha),
      primary: {
        main: theme.palette.primary.main,
        light: colorUtils.alpha(theme.palette.primary.main, 0.1),
        medium: colorUtils.alpha(theme.palette.primary.main, 0.2),
        strong: colorUtils.alpha(theme.palette.primary.main, 0.8),
      },
      accent: {
        main: theme.palette.accent.main,
        light: colorUtils.alpha(theme.palette.accent.main, 0.1),
        medium: colorUtils.alpha(theme.palette.accent.main, 0.2),
        strong: colorUtils.alpha(theme.palette.accent.main, 0.8),
      },
    },

    // Responsive breakpoints
    breakpoints: theme.breakpoints,
    
    // Spacing helpers
    spacing: theme.spacing,
    
    // Typography helpers
    typography: theme.typography,

    // Shadow helpers
    shadows: theme.shadows,

    // Helper functions
    helpers: {
      // Get contrast text color for any background
      getContrastText: (backgroundColor) => {
        // Simple contrast calculation - you might want to use a library like 'polished' for more accuracy
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? theme.palette.text.primary : theme.palette.common.white;
      },

      // Create responsive styles
      responsive: (styles) => ({
        [theme.breakpoints.down('sm')]: styles.mobile || {},
        [theme.breakpoints.between('sm', 'md')]: styles.tablet || {},
        [theme.breakpoints.up('md')]: styles.desktop || {},
      }),

      // Create hover states
      hover: (baseStyles, hoverStyles) => ({
        ...baseStyles,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          ...hoverStyles,
        },
      }),

      // Create focus states for accessibility
      focus: (baseStyles, focusStyles) => ({
        ...baseStyles,
        '&:focus-visible': {
          outline: `2px solid ${theme.palette.accent.main}`,
          outlineOffset: '2px',
          ...focusStyles,
        },
      }),
    },
  };
};

export default useThemeUtils;
