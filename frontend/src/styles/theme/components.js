
const createComponents = (customTheme, themeMode) => {
  const isDark = themeMode === 'dark';
  const c = isDark ? customTheme.colorsDarkmode : customTheme.colors;

  return {
    MuiCssBaseline: {
      styleOverrides: () => ({
        '*': {
          boxSizing: 'border-box',
        },
        body: {
          color: c.mainText,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          scrollBehavior: 'smooth',
          overflow: 'hidden',
          height: '100vh',
          margin: 0,
          padding: 0,
        },
        html: {
          overflow: 'hidden',
          height: '100vh',
          margin: 0,
          padding: 0,
        },
        '#root': {
          height: '100vh',
          overflow: 'auto',
        },
        a: {
          color: c.accentStrong || c.light,
          textDecorationColor: c.accentStrong || c.accent,
          transition: 'color 0.2s ease-in-out',
          '&:hover': {
            color: c.primary,
          },
        },
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
        '#root::-webkit-scrollbar': {
          width: '0.75rem',
        },
        '#root::-webkit-scrollbar-track': {
          backgroundColor: c.textMuted,
          borderRadius: '0.375rem',
        },
        '#root::-webkit-scrollbar-thumb': {
          backgroundColor: c.secondary,
          borderRadius: '0.375rem',
          '&:hover': {
            backgroundColor: c.primary,
          },
        },
        '[style*="position: fixed"]::-webkit-scrollbar, [style*="position: absolute"]::-webkit-scrollbar':
          { display: 'none' },
        '.MuiDialog-root::-webkit-scrollbar, .MuiDrawer-root::-webkit-scrollbar, .MuiPopover-root::-webkit-scrollbar, .MuiMenu-root::-webkit-scrollbar':
          { display: 'none' },
        '.MuiDialog-root body, .MuiDrawer-root body': {
          color: c.light,
          overflow: 'hidden !important',
        },
      }),
    },

    MuiTooltip: {
      defaultProps: {
        disableTouchListener: true,
      },
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
          color: c.light,
          maxHeight: '90vh',
          overflow: 'auto',
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          borderRadius: customTheme.button.borderRadius,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          outline: 'none',
          minHeight: 40,
          transition: 'all 0.2s ease-in-out',
          padding: '8px 20px',

          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 3px 6px rgba(0,0,0,0.18)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: 'none',
          },
          '&:focus-visible': {
            outline: `2px solid ${c.accent}`,
            outlineOffset: 2,
          },
          '&.Mui-disabled': {
            backgroundColor: `${c.textMuted}40`,
            color: c.textMuted,
          },

          // Contained: explicit colours — always readable regardless of container
          ...(ownerState.variant === 'contained' && {
            backgroundColor: c.primary,
            color: c.light,
            border: `1px solid ${c.secondary}`,
            '&:hover': {
              backgroundColor: c.secondary,
              transform: 'translateY(-1px)',
              boxShadow: '0 3px 6px rgba(0,0,0,0.18)',
            },
          }),

          // Outlined / text: inherit colour from container so they work on
          // both the light page background AND inside dark Paper/Dialog
          ...(ownerState.variant === 'outlined' && {
            color: 'inherit',
            border: '1.5px solid currentColor',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
              transform: 'translateY(-1px)',
            },
          }),

          ...(ownerState.variant === 'text' && {
            color: 'inherit',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
              transform: 'none',
              boxShadow: 'none',
            },
          }),

          '&.tasting-toggle': {
            minWidth: '8rem',
            whiteSpace: 'nowrap',
          },
        }),
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: customTheme.borderRadius,
          boxShadow: customTheme.shadow,
          transition: 'all 0.3s ease-in-out',
          border: 'none',
          '&:hover': {
            transform: 'translateY(-0.125rem)',
            boxShadow: 'none',
          },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          border: 'none',
          outline: 'none',
          borderRadius: 0,
          boxShadow: '0 0.125rem 0.5rem rgba(0,0,0,0.08)',
          backdropFilter: 'blur(0.625rem)',
          backgroundColor: `${c.primary}cc`,
          borderBottom: `0.0625rem solid ${c.secondary}`,
          color: c.light,
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `0.0625rem solid ${c.secondary}`,
          borderRadius: 0,
          backdropFilter: 'blur(0.625rem)',
          backgroundColor: `${c.primary}f5`,
          color: c.light,
          overflow: 'hidden',
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            color: c.accent,
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: 'filled',
      },
      styleOverrides: {
        root: {
          // ── Filled input container ──────────────────────────────────────
          '& .MuiFilledInput-root': {
            borderRadius: `${customTheme.borderRadius}px ${customTheme.borderRadius}px 0 0`,
            backgroundColor: isDark ? `${c.light}22` : `${c.light}55`,
            transition: 'background-color 0.2s ease, border-color 0.2s ease',
            '&:hover': {
              backgroundColor: isDark ? `${c.light}33` : `${c.light}77`,
            },
            '&.Mui-focused': {
              backgroundColor: isDark ? `${c.light}33` : `${c.light}77`,
            },
            // Bottom bar (replaces the outlined border)
            '&:before': {
              borderBottomColor: isDark ? `${c.light}50` : `${c.secondary}80`,
            },
            '&:hover:not(.Mui-disabled):before': {
              borderBottomColor: c.light,
              borderBottomWidth: 2,
            },
            '&:after': {
              borderBottomColor: c.light,
              borderBottomWidth: 2,
            },
            // Input text always contrasts with the filled background
            '& input, & textarea': {
              color: c.mainText,
              padding: '22px 14px 8px',
            },
            // ── Error state ─────────────────────────────────────────────
            '&.Mui-error': {
              backgroundColor: isDark ? `${c.error}18` : `${c.error}12`,
              '&:before': { borderBottomColor: c.error },
              '&:hover:not(.Mui-disabled):before': { borderBottomColor: c.error, borderBottomWidth: 2 },
              '&:after': { borderBottomColor: c.error, borderBottomWidth: 2 },
            },
          },

          // ── Label ──────────────────────────────────────────────────────
          '& .MuiInputLabel-root': {
            color: c.light,
            fontWeight: 400,
            '&.MuiInputLabel-shrunk': {
              color: c.light,
              fontWeight: 700,
            },
            '&.Mui-focused': {
              color: c.light,
              fontWeight: 700,
            },
            '&.Mui-error': {
              color: c.error,
              '&.MuiInputLabel-shrunk': { color: c.error },
            },
          },

          // ── Helper / error text ────────────────────────────────────────
          '& .MuiFormHelperText-root': {
            marginLeft: 0,
            marginTop: 4,
            '&.Mui-error': {
              color: c.error,
              fontWeight: 500,
            },
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          // light = Alice Blue — readable on the dark Paper/card backgrounds
          // used in both modes (light mode paper bg is dark Azel Blue #194f84)
          color: c.light,
          boxShadow: customTheme.shadow,
          transition: 'box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: `0 4px 16px rgba(0,0,0,0.15)`,
          },
        },
        elevation1: { boxShadow: `0 2px 8px rgba(0,0,0,0.08)` },
        elevation2: { boxShadow: `0 4px 12px rgba(0,0,0,0.12)` },
        elevation3: { boxShadow: `0 6px 16px rgba(0,0,0,0.15)` },
      },
    },

    MuiSelect: {
      defaultProps: {
        variant: 'filled',
      },
      styleOverrides: {
        root: {
          borderRadius: `${customTheme.borderRadius}px ${customTheme.borderRadius}px 0 0`,
        },
      },
    },

    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiFormLabel-root': {
            color: 'inherit',
            fontWeight: 500,
            '&.Mui-focused': {
              color: c.light,
            },
          },
        },
      },
    },

    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: 'inherit',
          marginLeft: 0,
          marginTop: 4,
        },
      },
    },

    MuiInputAdornment: {
      styleOverrides: {
        root: {
          // Matches the input text colour, not the Paper colour
          color: c.mainText,
        },
      },
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'inherit',
          borderRadius: 4,
          '&.Mui-checked': {
            color: c.accent,
          },
          '&:hover': {
            backgroundColor: `${c.accent}14`,
          },
          '&.Mui-focusVisible': {
            outline: `2px solid ${c.accent}`,
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
          color: c.accent,
          '&.MuiRating-readOnly': {
            opacity: 0.7,
          },
        },
      },
    },

    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          // Inherit: dark text on page, light text inside Paper
          color: 'inherit',
          '& .MuiFormControlLabel-label': {
            color: 'inherit',
            fontSize: '0.875rem',
          },
          '&:hover': {
            backgroundColor: `${c.accent}14`,
          },
        },
        label: {
          color: 'inherit',
        },
      },
    },

    MuiTabScrollButton: {
      styleOverrides: {
        root: {
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: c.secondary,
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: c.primary,
          },
        },
      },
    },
  };
};

export { createComponents };
