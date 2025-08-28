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
      width: 56,
      height: 56,
      boxShadow: 3,
      bottom: { xs: 80, sm: "auto" },
      left: { xs: "50%", sm: "auto" },
      transform: { xs: "translateX(-50%)", sm: "none" },
      top: { xs: "auto", sm: 75 },
      right: { xs: "auto", sm: 30 },
      display: "flex",
      ...sx,
    }}
    {...props}
  >
    {icon}
  </Fab>
);

export default GeotagFab;
