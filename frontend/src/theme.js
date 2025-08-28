export const theme = {
  colors: {
    primary: "#2570bbff", // Azel (main brand blue)
    secondary: "#184777ff", // Deep Blue
    accent: "#fde113ff", // School Yellow
    light: "#f0f4ffff", // Very light Alice Blue
    navbarBackground: "#184777ff", // Match secondary for unity
    mainText: "#ebf2fa", // Oxford Blue
    versoText: "#0a1f33", // Alice Blue
    error: "#ef6461", // Bittersweet
    success: "#7eb77fff", // Slightly darker Olivine for readability
  },

  colorsDarkmode: {
    primary: "#1c4e7d", // Muted Azel (for subtle contrast in dark mode)
    secondary: "rgba(10, 31, 51, 1)", // Oxford Blue (background support)
    accent: "#fde112ff", // School Yellow (kept vibrant for focus)
    light: "#2570bbff", // Muted Azel reused for consistency
    background: "#184777ff", // Oxford Blue (true dark mode base)
    mainText: "#ebf2fa", // Alice Blue (light readable text)
    versoText: "#0a1f33", // Oxford Blue (reverse text for highlights)
    error: "#ef6461", // Bittersweet
    success: "#7eb77f", // Olivine (kept softer for dark mode)
  },

  fonts: {
    main: "Verdana, Arial, sans-serif",
    heading: "Stockholm Type, sans-serif",
    size: {
      sm: "1rem",
      md: "1.5rem",
      lg: "2rem",
      xl: "2.5rem",
    },
  },
  borderRadius: ".5rem",
  shadow: "0 2px 8px rgba(0,0,0,0.08)",

  spacing: 8,
  containerWidths: {
    sm: "10rem",
    md: "20rem",
    lg: "25rem",
    xl: "50rem",
  },
};
