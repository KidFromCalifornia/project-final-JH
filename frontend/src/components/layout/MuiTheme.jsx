import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useCafeStore } from "../../stores/useCafeStore.js";

// Theme modules
import { colors, colorsDarkmode } from "../../styles/theme/colors.js";
import { fonts, createTypography } from "../../styles/theme/typography.js";
import { createComponents } from "../../styles/theme/components.js";
import { themeConfig, createPalette } from "../../styles/theme/palette.js";

const MuiTheme = ({ children }) => {
  const themeMode = useCafeStore((state) => state.themeMode);

  const theme = React.useMemo(() => {
    const customTheme = {
      colors,
      colorsDarkmode,
      fonts,
      ...themeConfig,
    };

    const palette = createPalette(themeMode, colors, colorsDarkmode);
    const typography = createTypography(customTheme, palette.text);
    const components = createComponents(customTheme);

    return createTheme({
      palette,
      typography,
      components,
      
      // Additional theme properties
      icons: { fontSize: "1.25rem" },
      shape: { 
        borderRadius: 8, // 8px (equivalent to 0.5rem)
      },
      shadows: [
        "none",
        customTheme.shadow,
        "0 0.25rem 1rem rgba(0,0,0,0.1)",
        "0 0.5rem 1.5rem rgba(0,0,0,0.12)",
        "0 0.75rem 2rem rgba(0,0,0,0.14)",
        ...Array(20).fill("0 1rem 2.5rem rgba(0,0,0,0.16)"),
      ],
      spacing: (factor) => `${0.5 * factor}rem`, // 0.5rem base unit
      breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 } },
      zIndex: { appBar: 1100, drawer: 1200, modal: 1300, snackbar: 1400, tooltip: 1500 },
      transitions: { 
        duration: { shortest: 150, shorter: 200, standard: 300, complex: 375 }, 
        easing: { easeInOut: "cubic-bezier(0.4,0,0.2,1)" } 
      },
      mixins: { toolbar: { minHeight: "3.5rem" } },
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


