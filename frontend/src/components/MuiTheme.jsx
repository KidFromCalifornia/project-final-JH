import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme as customTheme } from "../theme.js";
import { createTheme } from "@mui/material/styles";
import { useCafeStore } from "../useCafeStore.js";

const MuiTheme = ({ children }) => {
  const themeMode = useCafeStore((state) => state.themeMode);
  const theme = React.useMemo(() => {
    const colors =
      themeMode === "dark" ? customTheme.colorsDarkmode : customTheme.colors;
    return createTheme({
      palette: {
        primary: { main: colors.primary },
        secondary: { main: colors.secondary },
        light: { main: colors.light },
        accent: { main: colors.accent },
        background: {
          default: colors.background,
          paper: colors.secondary,
        },
        error: { main: colors.error },
        success: { main: colors.success },
        warning: { main: colors.warning || colors.error },
        text: {
          primary: colors.versoText,
          secondary: colors.accent,
        },
        mode: themeMode,
      },
      typography: {
        fontFamily: customTheme.fonts.main,
        h1: {
          fontFamily: customTheme.fonts.heading,
          fontSize: customTheme.fonts.size.xl,
        },
        h2: {
          fontFamily: customTheme.fonts.heading,
          fontSize: customTheme.fonts.size.lg,
        },
        h3: {
          fontFamily: customTheme.fonts.heading,
          fontSize: customTheme.fonts.size.md,
        },
        fontSize: 16,
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
