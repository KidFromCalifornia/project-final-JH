// CardStyledWrapper.jsx
import { Box } from "@mui/material";

export const CardStyledWrapper = ({ children, ...props }) => (
  <Box
    sx={{ width: "100%", display: "flex", flexWrap: "wrap", gap: 2 }}
    {...props}
  >
    {children}
  </Box>
);

export default CardStyledWrapper;
