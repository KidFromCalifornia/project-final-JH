import React from "react";
import Fab from "@mui/material/Fab";

const GeotagFab = ({
  onClick,
  icon,
  ariaLabel = "geotag",
  sx = {},
  ...props
}) => (
  <Fab
    color="primary"
    aria-label={ariaLabel}
    onClick={onClick}
    sx={{
      position: "fixed",
      zIndex: 1301,
      bottom: 80,
      left: "50%",
      transform: "translateX(-50%)",
      width: 56,
      height: 56,
      boxShadow: 3,
      display: { xs: "flex", sm: "none" },
      ...sx,
    }}
    {...props}
  >
    {icon}
  </Fab>
);

export default GeotagFab;
