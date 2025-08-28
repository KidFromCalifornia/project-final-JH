import { Box, Typography } from "@mui/material";

const spinKeyframes = {
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
};

const defaultColor = "#222";

const LoadingLogo = (theme, themeMode) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="100vh"
  >
    <Box
      sx={{
        position: "relative",
        width: 300,
        height: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...spinKeyframes,
      }}
    >
      <Box
        component="img"
        src="/src/assets/scc_logo_text.svg"
        alt="Logo Text"
        sx={{
          position: "absolute",
          top: -10,
          left: 0,
          width: 300,
          height: 300,
          animation: "spin 4.5s linear infinite",
          filter: themeMode === "dark" ? "brightness(0.8)" : undefined,
          color:
            themeMode === "dark" ? theme?.palette?.common?.light : defaultColor,
          "&:hover": {
            animationPlayState: "paused",
          },
        }}
      />
      <Box
        component="img"
        src="/src/assets/scc_shield.svg"
        alt="Logo Shield"
        sx={{
          position: "absolute",
          width: 150,
          height: 150,
        }}
      />
    </Box>
    <Typography color="text.primary" variant="h2" mt={2}>
      Currently Brewing...
    </Typography>
  </Box>
);

export default LoadingLogo;
