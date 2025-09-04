// Material-UI component overrides
export const createComponents = (customTheme) => ({
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
      body: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        scrollBehavior: 'smooth',
      },
      a: {
        color: theme.palette.accentStrong?.main || theme.palette.accent.main,
        textDecorationColor: theme.palette.accentStrong?.main || theme.palette.accent.main,
        transition: 'color 0.2s ease-in-out',
        '&:hover': {
          color: theme.palette.primary.main,
        },
      },
      // Stockholm Type font fallbacks
      '.wf-stockholmtype-n7-inactive h1, .wf-stockholmtype-n4-inactive h1': {
        fontFamily: 'Verdana, Arial, sans-serif !important',
      },
      '.wf-stockholmtype-n7-inactive h2, .wf-stockholmtype-n4-inactive h2': {
        fontFamily: 'Verdana, Arial, sans-serif !important',
      },
      '.wf-stockholmtype-n7-inactive h3, .wf-stockholmtype-n4-inactive h3': {
        fontFamily: 'Verdana, Arial, sans-serif !important',
      },
      '.wf-stockholmtype-loading h1, .wf-stockholmtype-loading h2, .wf-stockholmtype-loading h3': {
        fontFamily: 'Verdana, Arial, sans-serif !important',
      },
      // Custom scrollbar styling
      '*::-webkit-scrollbar': {
        width: '0.5rem',
      },
      '*::-webkit-scrollbar-track': {
        backgroundColor: theme.palette.background.paper,
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.primary.main,
        borderRadius: 4, // Convert to pixels
        '&:hover': {
          backgroundColor: theme.palette.secondary.main,
        },
      },
    }),
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        fontSize: 'rem',
        borderRadius: customTheme.borderRadius / 2,
      },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: customTheme.borderRadius / 2,
        fontWeight: 500,
      },
    },
  },

  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: customTheme.borderRadius,
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: ({ theme, ownerState }) => ({
        borderRadius: customTheme.button.borderRadius,
        fontWeight: 600,
        textTransform: 'none',
        boxShadow: 'none',
        border: 'none',
        outline: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-0.0625rem)',
          boxShadow: 'none',
          border: 'none',
        },
        '&:active': {
          transform: 'translateY(0)',
          outline: 'none',
        },
        '&:focus': {
          outline: 'none',
          boxShadow: 'none',
        },
        ...(ownerState.variant === 'contained' && {
          '&:hover': {
            backgroundColor: customTheme.button.hover,
            transform: 'translateY(-0.0625rem)',
          },
        }),
      }),
    },
  },

  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: customTheme.borderRadius,
        boxShadow: 'none',
        transition: 'all 0.3s ease-in-out',
        border: 'none',
        '&:hover': {
          transform: 'translateY(-0.125rem)',
          boxShadow: 'none',
        },
      }),
    },
  },

  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: customTheme.borderRadius,
        border: 'none',
        boxShadow: 'none',
      }),
      elevation1: {
        boxShadow: 'none',
      },
      elevation2: {
        boxShadow: 'none',
      },
      elevation3: {
        boxShadow: 'none',
      },
    },
  },

  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }) => ({
        border: 'none',
        outline: 'none',
        borderRadius: 0,
        boxShadow: '0 0.125rem 0.5rem rgba(0,0,0,0.08)',
        backdropFilter: 'blur(0.625rem)',
        backgroundColor: `${theme.palette.primary.main}cc`,
        borderBottom: `0.0625rem solid ${theme.palette.divider}`,
        color: theme.palette.light?.main || '#fff',
      }),
    },
  },

  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRight: `0.0625rem solid ${theme.palette.divider}`,
        borderRadius: 0,
        backdropFilter: 'blur(0.625rem)',
        backgroundColor: `${theme.palette.primary.main}f5`,
        color: theme.palette.light?.main || '#fff',
      }),
    },
  },
});
