import { Button } from "@mui/material";

export const ButtonDark = (props) => (
  <Button variant="contained" color="secondary" {...props} />
);

export const ButtonLight = (props) => (
  <Button variant="contained" color="primary" {...props} />
);

export const NavButton = (props) => (
  <Button variant="text" color="inherit" {...props} />
);
