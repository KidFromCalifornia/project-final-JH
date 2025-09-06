// Theme configuration constants
export const themeConfig = {
  button: {
    background: '#2570bb',
    borderRadius: 8, // 0.5rem converted to pixels
    shadow: '0 0.125rem 0.5rem rgba(0,0,0,0.08)',
    spacing: '0.5rem',
    hover: '#1c5ea8',
    active: '#0f3f70',
    containerWidths: { sm: '10rem', md: '20rem', lg: '25rem', xl: '50rem' },
  },

  borderRadius: 8, // 0.5rem converted to pixels
  shadow: '0 0.125rem 0.5rem rgba(0,0,0,0.08)',

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },

  containerWidths: { sm: '10rem', md: '20rem', lg: '25rem', xl: '50rem' },
};

export const createPalette = (themeMode, colors, colorsDarkmode) => {
  const isDark = themeMode === 'dark';
  const colorPalette = isDark ? colorsDarkmode : colors;
  const textSecondaryColor = isDark ? colorPalette.main : colorPalette.versoText;
  const backgroundDefault = colorPalette.background;
  const paperBackground = colorPalette.paper || backgroundDefault;

  return {
    mode: themeMode,
    common: { black: '#000000', white: '#ffffff' },

    primary: { main: colorPalette.primary, contrastText: isDark ? '#ebf2fa' : '#ffffff' },
    secondary: { main: colorPalette.secondary, contrastText: isDark ? '#ebf2fa' : '#ffffff' },
    light: { main: colorPalette.light },
    accent: { main: colorPalette.accent, contrastText: isDark ? '#0a1f33' : '#0a1f33' },
    accentStrong: { main: colorPalette.accentStrong, contrastText: isDark ? '#0a1f33' : '#0a1f33' },
    textMuted: { main: colorPalette.textMuted },
    success: { main: colorPalette.success, contrastText: '#0a1f33' },
    error: { main: colorPalette.error, contrastText: '#ffffff' },
    warning: { main: colorPalette.warning, contrastText: '#0a1f33' },
    info: { main: colorPalette.info, contrastText: '#0a1f33' },

    background: {
      default: backgroundDefault,
      paper: paperBackground,
    },

    text: {
      primary: colorPalette.mainText,
      secondary: textSecondaryColor,
      disabled: themeMode === 'dark' ? 'rgba(95, 155, 223, 0.5)' : 'rgba(3, 33, 62, 0.5)',
    },
    muted: { main: colorPalette.textMuted },

    divider: themeMode === 'dark' ? 'rgba(235,242,250,0.06)' : 'rgba(10,31,51,0.08)',

    action: {
      hover: themeMode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      selected: themeMode === 'dark' ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.08)',
      disabled: themeMode === 'dark' ? '#3b434f4c' : 'rgba(0,0,0,0.26)',
      focus: themeMode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)',
      active: themeMode === 'dark' ? 'rgba(255,255,255,0.54)' : 'rgba(0,0,0,0.54)',
    },

    tonalOffset: { light: 0.2, main: 0, dark: 0.15 },
  };
};
