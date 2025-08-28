import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useCafeStore } from "../../stores/useCafeStore.js";

const MuiTheme = ({ children }) => {
  const themeMode = useCafeStore((state) => state.themeMode);
  const theme = React.useMemo(() => {
    const customTheme = {
      colors: {
        primary: "#2570bbff",
        184777ff: "#184777ff",
        accent: "#fde113ff", // schoolbus  yellow
        accentStrong: "#e0b404", // stronger yellow for light backgrounds
        light: "#2570bbff",
        navbarBackground: "#184777ff",
        mainText: "#b8cafb",
        versoText: "#0a1f33",
        error: "#ef6461",
        success: "#7eb77fff",
      },
      colorsDarkmode: {
        primary: "#1c4e7d",
        secondary: "#0a1f33",
        accent: "#fde112ff", // vivid yellow for dark backgrounds
        accentStrong: "#ffdf00", // keep high pop in dark mode
        navbarBackground: "#0a1f33",
        light: "#b8cafb",
        background: "#184777ff",
        mainText: "#b8cafb",
        versoText: "#0a1f33",
        error: "#ef6461",
        success: "#7eb77fff",
      },
      button: {
        background: "#2570bbff",
        borderRadius: ".5rem",
        shadow: "0 2px 8px rgba(0,0,0,0.08)",
        spacing: 8,
        containerWidths: { sm: "10rem", md: "20rem", lg: "25rem", xl: "50rem" },
      },
      fonts: {
        main: "Verdana, Arial, sans-serif",
        heading: "Stockholm Type, sans-serif",
        size: { sm: "1rem", md: "1.5rem", lg: "2rem", xl: "2.5rem" },
      },
      borderRadius: ".5rem",
      shadow: "0 2px 8px rgba(0,0,0,0.08)",
      spacing: 8,
      containerWidths: { sm: "10rem", md: "20rem", lg: "25rem", xl: "50rem" },
    };

    const isDark = themeMode === "dark";
    const colors = isDark ? customTheme.colorsDarkmode : customTheme.colors;
    const textSecondaryColor = isDark ? colors.light : colors.versoText;
    const backgroundDefault =
      colors.background ||
      (isDark
        ? customTheme.colorsDarkmode.background
        : customTheme.colors.background);
    const paperBackground = isDark
      ? customTheme.colorsDarkmode.secondary
      : customTheme.colors.secondary;
    return createTheme({
      palette: {
        mode: themeMode,
        common: { black: "#000000", white: "#ffffff" },
        primary: { main: colors.primary },
        secondary: { main: colors.secondary, contrastText: "#ffffff" },
        light: { main: colors.light },
        accent: { main: colors.accent },
        accentStrong: { main: colors.accentStrong },
        success: { main: colors.success, contrastText: "#0a1f33" },
        error: { main: colors.error, contrastText: "#ffffff" },
        warning: { main: colors.warning || "#f59e0b", contrastText: "#0a1f33" },
        info: { main: "#0288d1", contrastText: "#ffffff" },
        background: {
          default: backgroundDefault,
          paper: paperBackground,
        },
        text: {
          primary: colors.versoText,
          secondary: textSecondaryColor,
          disabled:
            themeMode === "dark"
              ? "rgba(235,242,250,0.5)"
              : "rgba(10,31,51,0.5)",
        },
        divider:
          themeMode === "dark"
            ? "rgba(235,242,250,0.06)"
            : "rgba(10,31,51,0.08)",
        action: {
          hover:
            themeMode === "dark"
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.04)",
          selected:
            themeMode === "dark"
              ? "rgba(255,255,255,0.16)"
              : "rgba(0,0,0,0.08)",
          disabled:
            themeMode === "dark" ? "#3b434f4c" : "rgba(0,0,0,0.26)",
          focus:
            themeMode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)",
          active:
            themeMode === "dark"
              ? "rgba(255,255,255,0.54)"
              : "rgba(0,0,0,0.54)",
        },
        tonalOffset: {
          light: 0.2,
          main: 0,
          dark: 0.15,
        },
      },
      typography: {
        fontFamily: customTheme.fonts.main,
        fontSize: 16,
        h1: {
          fontFamily: customTheme.fonts.heading,
          fontWeight: 800,
          fontSize: customTheme.fonts.size.xl,
          lineHeight: 1.2,
          letterSpacing: "-0.5px",
        },
        h2: {
          fontFamily: customTheme.fonts.heading,
          fontWeight: 700,
          fontSize: customTheme.fonts.size.lg,
          lineHeight: 1.25,
        },
        h3: {
          fontFamily: customTheme.fonts.heading,
          fontWeight: 700,
          fontSize: customTheme.fonts.size.md,
          lineHeight: 1.3,
        },
        h4: { fontWeight: 700, fontSize: "1.25rem", lineHeight: 1.3 },
        h5: { fontWeight: 600, fontSize: "1.125rem", lineHeight: 1.35 },
        h6: { fontWeight: 600, fontSize: "1rem", lineHeight: 1.4 },
        subtitle1: {
          fontFamily: customTheme.fonts.heading,
          fontSize: "1.2",
          fontWeight: 600,
          letterSpacing: "0.2px",
        },
        subtitle2: { fontWeight: 600, letterSpacing: "0.2px" },
        body1: { fontSize: "1rem", lineHeight: 1.6 },
        body2: { fontSize: "0.9rem", lineHeight: 1.55 },
        button: {
          textTransform: "none",
          fontWeight: 600,
          letterSpacing: "0.2px",
        },
        overline: {
          fontWeight: 700,
          letterSpacing: "1px",
          textTransform: "uppercase",
        },
      },
      icons: { fontSize: 20 },
      shape: { borderRadius: 5 },
      shadows: [customTheme.shadow, ...Array(24).fill(customTheme.shadow)],
      spacing: 8,
      breakpoints: {
        values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
      },
      zIndex: {
        appBar: 1100,
        drawer: 1200,
        modal: 1300,
        snackbar: 1400,
        tooltip: 1500,
      },
      transitions: {
        duration: {
          shortest: 150,
          shorter: 200,
          standard: 300,
          complex: 375,
        },
        easing: { easeInOut: "cubic-bezier(0.4,0,0.2,1)" },
      },
      mixins: { toolbar: { minHeight: 56 } },
      components: {
        MuiCssBaseline: {
          styleOverrides: (theme) => ({
            body: {
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
            },
            a: {
              color:
                theme.palette.accentStrong?.main || theme.palette.accent.main,
              textDecorationColor:
                theme.palette.accentStrong?.main || theme.palette.accent.main,
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
          }),
        },
        MuiButton: {
          styleOverrides: { root: { borderRadius: 20 } },
        },
      },
      direction: "ltr",
    });
  }, [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MuiTheme;
