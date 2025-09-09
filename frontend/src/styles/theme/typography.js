// Stockholm typography guidelines
export const fonts = {
  main: 'Verdana, Arial, sans-serif', // Stockholm's official body text font
  heading: "'Stockholm Type', Verdana, Arial, sans-serif", // Stockholm's official heading font with Verdana fallback
  size: { sm: 16, md: 24, lg: 32, xl: 40 }, // Font sizes in pixels (converted from rem)
};

export const createTypography = (customTheme, colors, themeMode) => {
  const textColor = themeMode === 'dark' ? colors.versoText : colors.versoText;

  return {
    fontFamily: customTheme.fonts.main,
    fontSize: 16, // 1rem converted to pixels
    color: textColor,

    h1: {
      fontFamily: customTheme.fonts.heading,
      fontWeight: 800,
      fontSize: customTheme.fonts.size.xl, // 40px
      lineHeight: 1.2,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      color: textColor,
      '@media (max-width:600px)': {
        fontSize: customTheme.fonts.size.lg, // 32px
      },
    },
    h2: {
      fontFamily: customTheme.fonts.heading,
      fontWeight: 700,
      fontSize: customTheme.fonts.size.lg, // 32px
      lineHeight: 1.25,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      color: textColor,
      '@media (max-width:600px)': {
        fontSize: customTheme.fonts.size.md, // 24px
      },
    },
    h3: {
      fontFamily: customTheme.fonts.heading,
      fontWeight: 700,
      letterSpacing: '0.5px',
      fontSize: customTheme.fonts.size.md, // 24px
      lineHeight: 1.3,
      textTransform: 'uppercase',
      color: textColor,
      '@media (max-width:600px)': {
        fontSize: 22, // 1.375rem converted to pixels
      },
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      fontFamily: customTheme.fonts.heading,
      fontSize: 22, // 1.375rem converted to pixels
      lineHeight: 1.3,
      color: textColor,
      '@media (max-width:600px)': {
        fontSize: 20, // 1.25rem converted to pixels
      },
    },
    h5: {
      fontFamily: customTheme.fonts.heading,
      letterSpacing: '0.5px',
      fontWeight: 600,
      fontSize: 20, // 1.25rem converted to pixels
      lineHeight: 1.35,
      textTransform: 'uppercase',
      color: textColor,
      '@media (max-width:600px)': {
        fontSize: 18, // 1.125rem converted to pixels
      },
    },
    h6: {
      fontFamily: customTheme.fonts.heading,
      fontWeight: 600,
      textTransform: 'uppercase',
      fontSize: 18, // 1.125rem converted to pixels
      lineHeight: 1.4,
      color: textColor,
      '@media (max-width:600px)': {
        fontSize: 16, // 1rem converted to pixels
      },
    },
    subtitle1: {
      fontFamily: customTheme.fonts.main,
      fontSize: 22, // 1.375rem converted to pixels
      fontWeight: 600,
      letterSpacing: '0.3px',
      color: textColor,
      '@media (max-width:600px)': {
        fontSize: 18, // 1.125rem converted to pixels
      },
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: 20, // 1.25rem converted to pixels
      letterSpacing: '0.3px',
      color: textColor,
      '@media (max-width:600px)': {
        fontSize: 16, // 1rem converted to pixels
      },
    },
    body1: {
      fontSize: 18, // 1.125rem converted to pixels
      lineHeight: 1.6,
      color: textColor,
      '@media (max-width:600px)': {
        fontSize: 16, // 1rem converted to pixels
      },
    },
    body2: {
      fontSize: 16, // 1rem converted to pixels
      lineHeight: 1.55,
      color: textColor,
      '@media (max-width:600px)': {
        fontSize: 16, // 1rem converted to pixels
      },
    },
    button: {
      fontSize: 16, // 1rem converted to pixels
      lineHeight: 1.75,
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.2px',
      color: textColor,
      '@media (max-width:600px)': {
        fontSize: 16, // 1rem converted to pixels
      },
    },
    overline: {
      fontSize: 16, // 1rem converted to pixels
      fontWeight: 700,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: textColor,
      '@media (max-width:600px)': {
        fontSize: 16, // 1rem converted to pixels
      },
    },
  };
};
