// Stockholm typography guidelines
export const fonts = {
  main: 'Verdana, Arial, sans-serif', // Stockholm's official body text font
  heading: "'Stockholm Type', Verdana, Arial, sans-serif", // Stockholm's official heading font with Verdana fallback
  size: { sm: 16, md: 24, lg: 32, xl: 40 }, // Convert to pixels for MUI
};

export const createTypography = (customTheme, colors, themeMode) => {
  const textColor = themeMode === 'dark' ? colors.mainText : colors.mainText;

  return {
    fontFamily: customTheme.fonts.main,
    fontSize: 16,
    color: textColor,

    h1: {
      fontFamily: customTheme.fonts.heading,
      fontWeight: 800,
      fontSize: customTheme.fonts.size.xl,
      lineHeight: 1.2,
      letterSpacing: '-0.5px',
      '@media (max-width:600px)': {
        fontSize: customTheme.fonts.size.lg,
      },
    },
    h2: {
      fontFamily: customTheme.fonts.heading,
      fontWeight: 700,
      fontSize: customTheme.fonts.size.lg,
      lineHeight: 1.25,
      '@media (max-width:600px)': {
        fontSize: customTheme.fonts.size.md,
      },
    },
    h3: {
      fontFamily: customTheme.fonts.heading,
      fontWeight: 700,
      fontSize: customTheme.fonts.size.md,
      lineHeight: 1.3,
      '@media (max-width:600px)': {
        fontSize: 22,
      },
    },
    h4: {
      fontWeight: 700,
      fontSize: 22,
      lineHeight: 1.3,
      '@media (max-width:600px)': {
        fontSize: 20,
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: 20,
      lineHeight: 1.35,
      '@media (max-width:600px)': {
        fontSize: 18,
      },
    },
    h6: {
      fontWeight: 600,
      fontSize: 18,
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: 16,
      },
    },
    subtitle1: {
      fontFamily: customTheme.fonts.heading,
      fontSize: 22,
      fontWeight: 600,
      letterSpacing: '0.2px',
      '@media (max-width:600px)': {
        fontSize: 18,
      },
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: 20,
      letterSpacing: '0.2px',
      '@media (max-width:600px)': {
        fontSize: 16,
      },
    },
    body1: {
      fontSize: 18,
      lineHeight: 1.6,
      '@media (max-width:600px)': {
        fontSize: 16,
      },
    },
    body2: {
      fontSize: 14,
      lineHeight: 1.55,
      '@media (max-width:600px)': {
        fontSize: 13,
      },
    },
    button: {
      fontSize: 14,
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.2px',
      '@media (max-width:600px)': {
        fontSize: 14,
      },
    },
    overline: {
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      '@media (max-width:600px)': {
        fontSize: 12,
      },
    },
  };
};
