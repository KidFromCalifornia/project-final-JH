import { Typography } from '@mui/material';
import { colors, colorsDarkmode } from './colors';
import { light } from '@mui/material/styles/createPalette';
import { fontGrid } from '@mui/material/styles/cssUtils';

const createComponents = (customTheme) => ({
  MuiCssBaseline: {
    styleOverrides: () => ({
      // Apply border-box to all elements for consistent sizing
      '*': {
        boxSizing: 'border-box',
      },
      body: {
        color: customTheme.colors.mainText,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        scrollBehavior: 'smooth',
        // Prevent duplicate scrollbars
        overflow: 'hidden',
        height: '100vh',
        margin: 0,
        padding: 0,
      },
      html: {
        // Prevent duplicate scrollbars
        overflow: 'hidden',
        height: '100vh',
        margin: 0,
        padding: 0,
      },
      // Main content wrapper should handle scrolling
      '#root': {
        height: '100vh',
        overflow: 'auto',
      },
      a: {
        color: customTheme.colors.accentStrong || customTheme.colors.light,
        textDecorationColor: customTheme.colors.accentStrong || customTheme.colors.accent,
        transition: 'color 0.2s ease-in-out',
        '&:hover': {
          color: customTheme.colors.primary,
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
      // Custom scrollbar styling - only for main content
      '#root::-webkit-scrollbar': {
        width: '0.75rem',
      },
      '#root::-webkit-scrollbar-track': {
        backgroundColor: customTheme.colors.textMuted,
        borderRadius: '0.375rem',
      },
      '#root::-webkit-scrollbar-thumb': {
        backgroundColor: customTheme.colors.secondary,
        borderRadius: '0.375rem',
        '&:hover': {
          backgroundColor: customTheme.colors.primary,
        },
      },
      // Hide scrollbars on fixed/absolute elements
      '[style*="position: fixed"]::-webkit-scrollbar, [style*="position: absolute"]::-webkit-scrollbar':
        {
          display: 'none',
        },
      // Hide scrollbars on dialogs and modals
      '.MuiDialog-root::-webkit-scrollbar, .MuiDrawer-root::-webkit-scrollbar, .MuiPopover-root::-webkit-scrollbar, .MuiMenu-root::-webkit-scrollbar':
        {
          display: 'none',
        },
      // Prevent body scrolling when modals are open
      '.MuiDialog-root body, .MuiDrawer-root body': {
        color: customTheme.colors.light,
        overflow: 'hidden !important',
      },
    }),
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: 'hsla(222, 95%, 8%, 0.90)',
        fontSize: '0.875rem',
        borderRadius: customTheme.borderRadius / 2,
      },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: {
        backgroundColor: 'transparent',
        borderRadius: customTheme.borderRadius / 2,
        fontWeight: 500,
      },
    },
  },

  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: customTheme.borderRadius,
        color: customTheme.colors.light,
        // Prevent dialog scrollbars
        maxHeight: '90vh',
        overflow: 'auto',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: ({ theme, ownerState }) => ({
        borderRadius: customTheme.button.borderRadius,
        fontWeight: 500,
        textTransform: 'none',
        boxShadow: 'none',
        outline: 'none',
        minHeight: { xs: 48, sm: 42 },
        transition: 'all 0.2s ease-in-out',
        padding: '8px 24px',

        // Consistent hover effects
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        },

        // Active state
        '&:active': {
          transform: 'translateY(0)',
          boxShadow: 'none',
        },

        // Focus state
        '&:focus': {
          outline: 'none',
          boxShadow: `0 0 0 2px ${customTheme.colors.primary}33`,
        },

        // Disabled state
        '&.Mui-disabled': {
          backgroundColor: `${customTheme.colors.textMuted}40`,
          color: customTheme.colors.textMuted,
        },

        // Contained variant (default)
        ...(ownerState.variant === 'contained' && {
          backgroundColor: customTheme.colors.primary,
          color: customTheme.colors.light,
          border: 'none',
          '&:hover': {
            backgroundColor: customTheme.colors.primary,
            transform: 'translateY(-1px)',
          },
        }),

        // Outlined variant
        ...(ownerState.variant === 'outlined' && {
          backgroundColor: 'transparent',
          color: customTheme.colors.primary,
          border: `2px solid ${customTheme.colors.primary}`,
          '&:hover': {
            backgroundColor: `${customTheme.colors.primary}10`,
            borderColor: customTheme.colors.primary,
            color: customTheme.colors.primary,
          },
        }),

        // Text variant
        ...(ownerState.variant === 'text' && {
          backgroundColor: 'transparent',
          color: customTheme.colors.primary,
          '&:hover': {
            backgroundColor: `${customTheme.colors.primary}10`,
            transform: 'none',
            boxShadow: 'none',
          },
        }),

        // Custom class modifiers
        '&.tasting-toggle': {
          minWidth: '8.75rem',
          whiteSpace: 'nowrap',
        },
        '&.load-more': {
          minWidth: '200px',
          fontWeight: 600,
        },
      }),
    },
  },

  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: customTheme.borderRadius,
        boxShadow: customTheme.shadow,
        transition: 'all 0.3s ease-in-out',
        border: 'none',
        '&:hover': {
          transform: 'translateY(-0.125rem)',
          boxShadow: 'none',
        },
      }),
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
        backgroundColor: `${customTheme.colors.primary}cc`,
        borderBottom: `0.0625rem solid ${customTheme.colors.secondary}`,
        color: customTheme.colors.light || '#fff',
      }),
    },
  },

  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRight: `0.0625rem solid ${customTheme.colors.secondary}`,
        borderRadius: 0,
        backdropFilter: 'blur(0.625rem)',
        backgroundColor: `${customTheme.colors.primary}f5`,
        color: customTheme.colors.light || '#fff',
        // Prevent drawer scrollbars
        overflow: 'hidden',
      }),
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        fontColor: customTheme.colors.light || customTheme.colors.versoText,
        '&:hover': {
          color: customTheme.colors.accent,
        },
      },
    },
  },

  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: customTheme.borderRadius,
          backgroundColor: customTheme.colors.background,
          transition: 'all 0.4s ease-in-out',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: customTheme.colors.secondary,
            borderWidth: 2,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: customTheme.colors.secondary,
            fontWeight: 600,
            borderWidth: 2,
          },
        },
        '& .MuiInputLabel-root': {
          color: customTheme.colors.secondary,
          fontWeight: 600,
          '&.Mui-focused': {
            color: customTheme.colors.versoText || customTheme.colors.secondary,
            fontWeight: 600,
            backgroundColor: customTheme.colors.secondary,
            borderRadius: customTheme.borderRadius / 2,
            padding: '1px 12px',
          },
        },
        '& .MuiOutlinedInput-input': {
          color: customTheme.colors.mainText,
          padding: '16px 14px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: customTheme.colors.secondary,
        },
      },
    },
  },

  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 12,

        color: customTheme.colors.light,
        boxShadow: customTheme.shadow,
        transition: 'box-shadow 0.2s ease-in-out',
        '&:hover': {
          boxShadow: `0 4px 16px rgba(0,0,0,0.15)`,
        },
      },
      elevation1: {
        boxShadow: `0 2px 8px rgba(0,0,0,0.08)`,
      },
      elevation2: {
        boxShadow: `0 4px 12px rgba(0,0,0,0.12)`,
      },
      elevation3: {
        boxShadow: `0 6px 16px rgba(0,0,0,0.15)`,
      },
    },
  },

  MuiSelect: {
    styleOverrides: {
      root: {
        borderRadius: customTheme.borderRadius,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: customTheme.colors.textMuted,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: customTheme.colors.primary,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: customTheme.colors.primary,
        },
      },
    },
  },

  MuiFormControl: {
    styleOverrides: {
      root: {
        '& .MuiFormLabel-root': {
          color: customTheme.colors.primary,
          fontWeight: 500,
          '&.Mui-focused': {
            color: customTheme.colors.secondary,
          },
        },
      },
    },
  },

  MuiFormHelperText: {
    styleOverrides: {
      root: {
        color: customTheme.colors.secondary,
        marginLeft: 0,
        marginTop: 4,
      },
    },
  },

  MuiInputAdornment: {
    styleOverrides: {
      root: {
        color: customTheme.colors.secondary,
      },
    },
  },

  MuiCheckbox: {
    styleOverrides: {
      root: {
        color: customTheme.colors.secondary,
        borderRadius: 4,
        '&.Mui-checked': {
          color: customTheme.colors.primary,
        },
        '&:hover': {
          backgroundColor: `${customTheme.colors.primary}0a`,
        },
        '&.Mui-focusVisible': {
          outline: `2px solid ${customTheme.colors.primary}`,
          outlineOffset: 2,
        },
        '& .MuiSvgIcon-root': {
          fontSize: '1.25rem',
        },
      },
    },
  },

  MuiRating: {
    styleOverrides: {
      root: {
        color: customTheme.colors.accent || 'white',
        '&.MuiRating-readOnly': {
          opacity: 0.7,
        },
      },
    },
  },

  MuiFormControlLabel: {
    styleOverrides: {
      root: {
        color: customTheme.colors.primary,
        '& .MuiFormControlLabel-label': {
          color: customTheme.colors.primary,
          fontSize: '0.875rem',
        },
        '&:hover': {
          backgroundColor: `${customTheme.colors.primary}0a`,
        },
      },
      label: {
        color: customTheme.colors.primary,
      },
    },
  },

  MuiTabScrollButton: {
    styleOverrides: {
      root: {
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: customTheme.colors.secondary,
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: customTheme.colors.primary,
        },
      },
    },
  },
});

export { createComponents };
