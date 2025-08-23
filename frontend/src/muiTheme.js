import { createTheme } from "@mui/material/styles";
import { theme as customTheme } from "./theme";

export const muiTheme = createTheme({
  palette: {
    primary: { main: customTheme.colors.primary },
    secondary: { main: customTheme.colors.secondary },
    accent: { main: customTheme.colors.accent },
    background: {
      default: customTheme.colors.background,
      paper: customTheme.colors.secondary,
    },
    error: { main: customTheme.colors.error },
    success: { main: customTheme.colors.success },
    warning: { main: customTheme.colors.warning || customTheme.colors.error },
    text: {
      primary: customTheme.colors.versoText,
      secondary: customTheme.colors.accent,
    },
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
  shape: {
    borderRadius: 8,
  },
  shadows: [customTheme.shadow, ...Array(24).fill(customTheme.shadow)],
  spacing: 8,
});
