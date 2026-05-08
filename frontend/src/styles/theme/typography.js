// Stockholm typography guidelines
export const fonts = {
  main: 'Verdana, Arial, sans-serif',
  heading: "'Stockholm Type', Verdana, Arial, sans-serif",
  size: { sm: 16, md: 24, lg: 32, xl: 40 },
};

export const createTypography = (customTheme, colors, themeMode) => {
  // No hardcoded color on variants — let palette.text.primary and
  // container-level color (Paper, Dialog) handle inheritance correctly.
  // This prevents dark text bleeding into dark-background dialogs/cards.

  return {
    fontFamily: customTheme.fonts.main,
    fontSize: 16,

    h1: {
      fontFamily: customTheme.fonts.heading,
      fontWeight: 800,
      fontSize: 36,
      lineHeight: 1.2,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      '@media (max-width:600px)': { fontSize: 28 },
    },
    h2: {
      fontFamily: customTheme.fonts.heading,
      fontWeight: 700,
      fontSize: 28,
      lineHeight: 1.25,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      '@media (max-width:600px)': { fontSize: 22 },
    },
    h3: {
      fontFamily: customTheme.fonts.heading,
      fontWeight: 700,
      fontSize: 22,
      lineHeight: 1.3,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      '@media (max-width:600px)': { fontSize: 20 },
    },
    h4: {
      fontFamily: customTheme.fonts.heading,
      fontWeight: 700,
      fontSize: 20,
      lineHeight: 1.3,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      '@media (max-width:600px)': { fontSize: 18 },
    },
    h5: {
      fontFamily: customTheme.fonts.heading,
      fontWeight: 600,
      fontSize: 18,
      lineHeight: 1.35,
      letterSpacing: '0.3px',
      textTransform: 'uppercase',
      '@media (max-width:600px)': { fontSize: 16 },
    },
    h6: {
      fontFamily: customTheme.fonts.heading,
      fontWeight: 600,
      fontSize: 16,
      lineHeight: 1.4,
      letterSpacing: '0.3px',
      textTransform: 'uppercase',
      '@media (max-width:600px)': { fontSize: 15 },
    },
    subtitle1: {
      fontFamily: customTheme.fonts.main,
      fontSize: 16,
      fontWeight: 600,
      letterSpacing: '0.2px',
      lineHeight: 1.5,
      '@media (max-width:600px)': { fontSize: 15 },
    },
    subtitle2: {
      fontFamily: customTheme.fonts.main,
      fontWeight: 600,
      fontSize: 14,
      letterSpacing: '0.2px',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: 16,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: 14,
      lineHeight: 1.55,
    },
    button: {
      fontSize: 14,
      lineHeight: 1.75,
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.2px',
    },
    caption: {
      fontSize: 12,
      lineHeight: 1.5,
      letterSpacing: '0.3px',
    },
    overline: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },
  };
};
