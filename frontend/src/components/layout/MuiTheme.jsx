import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useCafeStore } from "../../stores/useCafeStore.js";

const MuiTheme = ({ children }) => {
  const themeMode = useCafeStore((state) => state.themeMode);

  const theme = React.useMemo(() => {
    const customTheme = {
      colors: {
        // Light Mode Colors
        primary: "#2570bb",          // Azel Blue
        secondary: "#0a1f33",        // Oxford Blue
        accent: "#fde113",           // Schoolbus Yellow
        accentStrong: "#e0b404",     // Strong Yellow
        background: "#ebf2fa",       // Alice Blue
        paper: "#2570bb",            // Azel Blue for cards/panels
        light: "#b0d7ff",            // Light Sky Blue
        mainText: "#0a1f33",         // Oxford Blue (text)
        versoText: "#ebf2fa",         // Alice Bluee (on dark)
        textMuted: "#7a8ca3",        // Muted Blue Gray
        error: "#ef6461",             // Bittersweet Red
        success: "#7eb77f",           // Olivine Green
        info: "#5bc0de",              // Soft Cyan
        warning: "#f5a623",           // Warm Orange
      },

      colorsDarkmode: {
        primary: "#1a3350",           // Dark Azure
        secondary: "#0c3054",         // Deep Oxford Blue
        accent: "#fde112",            // Vivid Yellow
        accentStrong: "#ffdf00",      // High-Contrast Yellow
        background: "#121c2b",        // Dark Navy
        paper: "#184777",             // Medium-dark blue for cards/panels
        light: "#b8cafb",             // Light Periwinkle
        mainText: "#ebf2fa",          // Alice Blue (text)
        versoText: "#b0d7ff",         // Light Sky Blue (accent text)
        textMuted: "#a0b0c0",         // Muted Blue Gray
        error: "#ff7b76",             // Bright Bittersweet
        success: "#90c68f",           // Soft Olivine
        info: "#5bc0de",              // Soft Cyan
        warning: "#f5a623",           // Warm Orange
      },

      button: {
        background: "#2570bb",
        borderRadius: ".5rem",
        shadow: "0 2px 8px rgba(0,0,0,0.08)",
        spacing: 8,
        hover: "#1c5ea8",
        active: "#0f3f70",
        containerWidths: { sm: "10rem", md: "20rem", lg: "25rem", xl: "50rem" },
      },

      fonts: {
        main: "Verdana, Arial, sans-serif",
        heading: "Stockholm Type, sans-serif",
        size: { sm: "1rem", md: "1.5rem", lg: "2rem", xl: "2.5rem" },
      },

      borderRadius: ".5rem",
      shadow: "0 2px 8px rgba(0,0,0,0.08)",

      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
      },

      containerWidths: { sm: "10rem", md: "20rem", lg: "25rem", xl: "50rem" },
    };

    const isDark = themeMode === "dark";
    const colors = isDark ? customTheme.colorsDarkmode : customTheme.colors;
    const textSecondaryColor = isDark ? colors.light : colors.versoText;
    const backgroundDefault = colors.background;
    const paperBackground = colors.paper || backgroundDefault;

    return createTheme({
      palette: {
        mode: themeMode,
        common: { black: "#000000", white: "#ffffff" },

        primary: { main: colors.primary, contrastText: isDark ? "#ebf2fa" : "#ebf2fa" },       // Alice Blue on dark/primary
        secondary: { main: colors.secondary, contrastText: isDark ? "#ebf2fa" : "#ebf2fa" },   // Alice Blue on dark/secondary
        light: { main: colors.light },
        accent: { main: colors.accent, contrastText: "#0a1f33" },                               // Oxford Blue on yellow
        accentStrong: { main: colors.accentStrong, contrastText: "#0a1f33" },
        textMuted: { main: colors.textMuted },
        success: { main: colors.success, contrastText: "#0a1f33" },
        error: { main: colors.error, contrastText: "#ffffff" },
        warning: { main: colors.warning, contrastText: "#0a1f33" },
        info: { main: colors.info, contrastText: "#0a1f33" },

        background: {
          default: backgroundDefault,
          paper: paperBackground,
        },

        text: {
          primary: colors.mainText,
          secondary: textSecondaryColor,
          disabled:
            themeMode === "dark"
              ? "rgba(95, 155, 223, 0.5)"
              : "rgba(3, 33, 62, 0.5)",
          muted: colors.textMuted,
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

        tonalOffset: { light: 0.2, main: 0, dark: 0.15 },
      },

      typography: {
        fontFamily: customTheme.fonts.main,
        fontSize: 16,
        color: colors.mainText,
        h1: {
          fontFamily: customTheme.fonts.heading,
          fontWeight: 800,
          fontSize: customTheme.fonts.size.xl,
          lineHeight: 1.2,
          letterSpacing: "-0.5px",
          "@media (max-width:600px)": {
            fontSize: customTheme.fonts.size.lg,
          },
        },
        h2: {
          fontFamily: customTheme.fonts.heading,
          fontWeight: 700,
          fontSize: customTheme.fonts.size.lg,
          lineHeight: 1.25,
          "@media (max-width:600px)": {
            fontSize: customTheme.fonts.size.md,
          },
        },
        h3: {
          fontFamily: customTheme.fonts.heading,
          fontWeight: 700,
          fontSize: customTheme.fonts.size.md,
          lineHeight: 1.3,
          "@media (max-width:600px)": {
            fontSize: "1.25rem",
          },
        },
        h4: { 
          fontWeight: 700, 
          fontSize: "1.25rem", 
          lineHeight: 1.3,
          "@media (max-width:600px)": {
            fontSize: "1.125rem",
          },
        },
        h5: { 
          fontWeight: 600, 
          fontSize: "1.125rem", 
          lineHeight: 1.35,
          "@media (max-width:600px)": {
            fontSize: "1rem",
          },
        },
        h6: { 
          fontWeight: 600, 
          fontSize: "1rem", 
          lineHeight: 1.4,
          "@media (max-width:600px)": {
            fontSize: "0.9rem",
          },
        },
        subtitle1: {
          fontFamily: customTheme.fonts.heading,
          fontSize: "1.2rem",
          fontWeight: 600,
          letterSpacing: "0.2px",
          "@media (max-width:600px)": {
            fontSize: "1.1rem",
          },
        },
        subtitle2: { 
          fontWeight: 600, 
          letterSpacing: "0.2px",
          "@media (max-width:600px)": {
            fontSize: "0.875rem",
          },
        },
        body1: { 
          fontSize: "1rem", 
          lineHeight: 1.6,
          "@media (max-width:600px)": {
            fontSize: "0.9rem",
          },
        },
        body2: { 
          fontSize: "0.9rem", 
          lineHeight: 1.55,
          "@media (max-width:600px)": {
            fontSize: "0.8rem",
          },
        },
        button: { 
          textTransform: "none", 
          fontWeight: 600, 
          letterSpacing: "0.2px",
          "@media (max-width:600px)": {
            fontSize: "0.875rem",
          },
        },
        overline: { 
          fontWeight: 700, 
          letterSpacing: "1px", 
          textTransform: "uppercase",
          "@media (max-width:600px)": {
            fontSize: "0.75rem",
          },
        },
      },

      icons: { fontSize: 20 },
      shape: { 
        borderRadius: parseInt(customTheme.borderRadius.replace('rem', '')) * 16, // Convert rem to px for MUI
      },
      shadows: [
        "none", // elevation 0
        customTheme.shadow, // elevation 1
        "0 4px 16px rgba(0,0,0,0.1)", // elevation 2
        "0 8px 24px rgba(0,0,0,0.12)", // elevation 3
        "0 12px 32px rgba(0,0,0,0.14)", // elevation 4
        ...Array(20).fill("0 16px 40px rgba(0,0,0,0.16)"), // elevation 5-24
      ],
      spacing: 8,
      breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 } },
      zIndex: { appBar: 1100, drawer: 1200, modal: 1300, snackbar: 1400, tooltip: 1500 },
      transitions: { duration: { shortest: 150, shorter: 200, standard: 300, complex: 375 }, easing: { easeInOut: "cubic-bezier(0.4,0,0.2,1)" } },
      mixins: { toolbar: { minHeight: 56 } },
      
      components: {
        MuiCssBaseline: {
          styleOverrides: (theme) => ({
            body: {
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              scrollBehavior: "smooth",
            },
            a: {
              color: theme.palette.accentStrong?.main || theme.palette.accent.main,
              textDecorationColor: theme.palette.accentStrong?.main || theme.palette.accent.main,
              transition: "color 0.2s ease-in-out",
              "&:hover": {
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
            "*::-webkit-scrollbar": {
              width: "8px",
            },
            "*::-webkit-scrollbar-track": {
              backgroundColor: theme.palette.background.paper,
            },
            "*::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.primary.main,
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: theme.palette.secondary.main,
              },
            },
          }),
        },
        
        MuiButton: {
          styleOverrides: {
            root: ({ theme, ownerState }) => ({
              borderRadius: customTheme.button.borderRadius,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: customTheme.shadow,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
              ...(ownerState.variant === "contained" && {
                "&:hover": {
                  backgroundColor: customTheme.button.hover,
                  transform: "translateY(-1px)",
                },
              }),
            }),
          },
        },

        MuiCard: {
          styleOverrides: {
            root: ({ theme }) => ({
              borderRadius: customTheme.borderRadius,
              boxShadow: customTheme.shadow,
              transition: "all 0.3s ease-in-out",
              border: `1px solid ${theme.palette.divider}`,
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              },
            }),
          },
        },

        MuiPaper: {
          styleOverrides: {
            root: ({ theme }) => ({
              borderRadius: customTheme.borderRadius,
              border: `1px solid ${theme.palette.divider}`,
            }),
            elevation1: {
              boxShadow: customTheme.shadow,
            },
            elevation2: {
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            },
            elevation3: {
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            },
          },
        },

        MuiTextField: {
          styleOverrides: {
            root: ({ theme }) => ({
              "& .MuiOutlinedInput-root": {
                borderRadius: customTheme.borderRadius,
                transition: "all 0.2s ease-in-out",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.accent.main,
                  borderWidth: "2px",
                },
              },
            }),
          },
        },

        MuiChip: {
          styleOverrides: {
            root: ({ theme }) => ({
              borderRadius: customTheme.borderRadius,
              fontWeight: 500,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }),
          },
        },

        MuiAppBar: {
          styleOverrides: {
            root: ({ theme }) => ({
              backdropFilter: "blur(10px)",
              backgroundColor: `${theme.palette.background.paper}cc`,
              borderBottom: `1px solid ${theme.palette.divider}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }),
          },
        },

        MuiDrawer: {
          styleOverrides: {
            paper: ({ theme }) => ({
              borderRight: `1px solid ${theme.palette.divider}`,
              backdropFilter: "blur(10px)",
              backgroundColor: `${theme.palette.background.paper}f5`,
            }),
          },
        },

        MuiFab: {
          styleOverrides: {
            root: ({ theme }) => ({
              boxShadow: customTheme.shadow,
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.1)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              },
            }),
          },
        },

        MuiDialog: {
          styleOverrides: {
            paper: ({ theme }) => ({
              borderRadius: customTheme.borderRadius,
              backdropFilter: "blur(10px)",
              border: `1px solid ${theme.palette.divider}`,
            }),
          },
        },

        MuiListItemButton: {
          styleOverrides: {
            root: ({ theme }) => ({
              borderRadius: customTheme.borderRadius,
              margin: "2px 4px",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
                transform: "translateX(4px)",
              },
              "&.Mui-selected": {
                backgroundColor: theme.palette.accent.main + "20",
                "&:hover": {
                  backgroundColor: theme.palette.accent.main + "30",
                },
              },
            }),
          },
        },

        MuiIconButton: {
          styleOverrides: {
            root: ({ theme }) => ({
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.1)",
                backgroundColor: theme.palette.action.hover,
              },
            }),
          },
        },

        MuiTooltip: {
          styleOverrides: {
            tooltip: ({ theme }) => ({
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
              borderRadius: customTheme.borderRadius,
              fontSize: "0.875rem",
              fontWeight: 500,
            }),
          },
        },

        MuiAlert: {
          styleOverrides: {
            root: ({ theme }) => ({
              borderRadius: customTheme.borderRadius,
              fontWeight: 500,
              border: `1px solid`,
            }),
            standardSuccess: ({ theme }) => ({
              borderColor: theme.palette.success.main,
            }),
            standardError: ({ theme }) => ({
              borderColor: theme.palette.error.main,
            }),
            standardWarning: ({ theme }) => ({
              borderColor: theme.palette.warning.main,
            }),
            standardInfo: ({ theme }) => ({
              borderColor: theme.palette.info.main,
            }),
          },
        },

        MuiLinearProgress: {
          styleOverrides: {
            root: ({ theme }) => ({
              borderRadius: customTheme.borderRadius,
              overflow: "hidden",
            }),
            bar: ({ theme }) => ({
              borderRadius: customTheme.borderRadius,
            }),
          },
        },

        MuiSkeleton: {
          styleOverrides: {
            root: ({ theme }) => ({
              borderRadius: customTheme.borderRadius,
            }),
          },
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
