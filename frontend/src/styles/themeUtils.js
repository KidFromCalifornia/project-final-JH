// Theme utility functions and common styles for Stockholm Coffee Club

// Animation keyframes for micro-interactions
export const animations = {
  fadeIn: {
    '@keyframes fadeIn': {
      '0%': { opacity: 0, transform: 'translateY(10px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
  },
  slideIn: {
    '@keyframes slideIn': {
      '0%': { opacity: 0, transform: 'translateX(-20px)' },
      '100%': { opacity: 1, transform: 'translateX(0)' },
    },
  },
  pulse: {
    '@keyframes pulse': {
      '0%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.05)' },
      '100%': { transform: 'scale(1)' },
    },
  },
  bounce: {
    '@keyframes bounce': {
      '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
      '40%, 43%': { transform: 'translate3d(0,-8px,0)' },
      '70%': { transform: 'translate3d(0,-4px,0)' },
      '90%': { transform: 'translate3d(0,-2px,0)' },
    },
  },
};

// Common component styles using theme
export const commonStyles = {
  // Glass morphism effect for modern UI
  glassMorphism: (theme) => ({
    background: `${theme.palette.background.paper}cc`,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  }),

  // Card hover effect
  cardHover: (theme) => ({
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[8],
    },
  }),

  // Loading skeleton styles
  skeleton: (theme) => ({
    borderRadius: theme.shape.borderRadius,
    animation: 'pulse 1.5s ease-in-out infinite',
  }),

  // Focus styles for accessibility
  focusVisible: (theme) => ({
    '&.Mui-focusVisible': {
      outline: `2px solid ${theme.palette.accent.main}`,
      outlineOffset: '2px',
    },
  }),

  // Gradient backgrounds
  gradients: {
    primary: (theme) => ({
      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    }),
    accent: (theme) => ({
      background: `linear-gradient(135deg, ${theme.palette.accent.main} 0%, ${theme.palette.accentStrong.main} 100%)`,
    }),
    coffee: (theme) => ({
      background: `linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #F4A460 100%)`,
    }),
  },

  // Text styles
  textTruncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  textClamp: (lines = 2) => ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }),

  // Layout utilities
  centerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Mobile-specific styles
  mobileOnly: {
    '@media (min-width: 900px)': {
      display: 'none !important',
    },
  },

  desktopOnly: {
    '@media (max-width: 899px)': {
      display: 'none !important',
    },
  },

  // Coffee-themed decorative elements
  coffeeAccent: (theme) => ({
    position: 'relative',
    '&::before': {
      content: '"☕"',
      position: 'absolute',
      left: '-24px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '1.2rem',
      color: theme.palette.accent.main,
    },
  }),

  // Loading states
  shimmer: {
    '@keyframes shimmer': {
      '0%': { backgroundPosition: '-200px 0' },
      '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
    },
    background: 'linear-gradient(90deg, #f0f0f0 0px, #e0e0e0 40px, #f0f0f0 80px)',
    backgroundSize: '200px 100%',
    animation: 'shimmer 1.2s ease-in-out infinite',
  },
};

// Breakpoint helpers
export const breakpoints = {
  up: (breakpoint) => `@media (min-width: ${breakpoint}px)`,
  down: (breakpoint) => `@media (max-width: ${breakpoint - 1}px)`,
  between: (min, max) => `@media (min-width: ${min}px) and (max-width: ${max - 1}px)`,
};

// Color utilities
export const colorUtils = {
  // Add alpha to any color
  alpha: (color, alpha) => `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`,
  
  // Common alpha values
  alphas: {
    hover: '0a', // 4%
    selected: '14', // 8%
    focus: '1f', // 12%
    disabled: '3d', // 24%
    backdrop: '80', // 50%
    overlay: 'cc', // 80%
  },
};

// Typography helpers
export const typography = {
  // Responsive font sizes
  responsiveText: (baseSize, mobileSize) => ({
    fontSize: baseSize,
    '@media (max-width: 600px)': {
      fontSize: mobileSize,
    },
  }),

  // Text shadows for better readability
  textShadow: {
    light: '0 1px 2px rgba(0,0,0,0.1)',
    medium: '0 2px 4px rgba(0,0,0,0.2)',
    strong: '0 3px 6px rgba(0,0,0,0.3)',
  },
};

// Z-index scale for consistent layering
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  drawer: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
  notification: 1600,
};

export default {
  animations,
  commonStyles,
  breakpoints,
  colorUtils,
  typography,
  zIndex,
};
