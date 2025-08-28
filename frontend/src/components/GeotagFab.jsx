import React, { useState, useEffect } from "react";
import Fab from "@mui/material/Fab";

const GeotagFab = ({
  onClick,
  icon,
  ariaLabel = "geotag",
  sx = {},
  ...props
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Listen for drawer state changes from MobileBottomNav
  useEffect(() => {
    const handleDrawerStateChange = (event) => {
      setIsDrawerOpen(event.detail.isOpen);
    };

    window.addEventListener('drawerStateChange', handleDrawerStateChange);
    
    return () => {
      window.removeEventListener('drawerStateChange', handleDrawerStateChange);
    };
  }, []);

  return (
    <Fab
      color="primary"
      aria-label={ariaLabel}
      onClick={onClick}
      sx={{
        backgroundColor: "secondary.main",
        position: "fixed",
        zIndex: 1301,
        width: 56,
        height: 56,
        boxShadow: 3,
        bottom: { xs: 80, sm: "auto" },
        left: { xs: "50%", sm: "auto" },
        transform: { xs: "translateX(-50%)", sm: "none" },
        top: { xs: "auto", sm: 75 },
        right: { xs: "auto", sm: 30 },
        display: isDrawerOpen ? "none" : "flex", // Hide when drawer is open
        ...sx,
      }}
      {...props}
    >
      {icon}
    </Fab>
  );
};

export default GeotagFab;
