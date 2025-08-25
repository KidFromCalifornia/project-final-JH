import React from "react";
import { useNavigate } from "react-router-dom";
import { useCafeStore } from "../useCafeStore";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import MapIcon from "@mui/icons-material/Map";
import RateReviewIcon from "@mui/icons-material/RateReview";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DoorFrontIcon from "@mui/icons-material/DoorFront";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
const MobileBottomNav = () => {
  const navigate = useNavigate();
  const isLoggedIn = useCafeStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useCafeStore((state) => state.setIsLoggedIn);
  let isAdmin = false;
  if (typeof window !== "undefined" && window.localStorage) {
    isAdmin = localStorage.getItem("admin") === "true";
  }
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{
        top: "auto",
        bottom: 0,
        display: { xs: "flex", sm: "none" },
        zIndex: 1200,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor="bottom"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{ zIndex: 1300 }}
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNav("/")}>
                <ListItemIcon>
                  <MapIcon />
                </ListItemIcon>
                <ListItemText primary="Map" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNav("/tastings")}>
                <ListItemIcon>
                  <RateReviewIcon />
                </ListItemIcon>
                <ListItemText primary="Tastings" />
              </ListItemButton>
            </ListItem>
            {isLoggedIn &&
              (isAdmin ? (
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleNav("/admin")}>
                    <ListItemIcon>
                      <AdminPanelSettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Admin" />
                  </ListItemButton>
                </ListItem>
              ) : (
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleNav("/user")}>
                    <ListItemIcon>
                      <DoorFrontIcon />
                    </ListItemIcon>
                    <ListItemText primary="User" />
                  </ListItemButton>
                </ListItem>
              ))}
            {isLoggedIn && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    localStorage.removeItem("userToken");
                    localStorage.removeItem("username");
                    localStorage.removeItem("admin");
                    setIsLoggedIn(false);
                    handleNav("/");
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            )}
            {!isLoggedIn && (
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleNav("/login")}>
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default MobileBottomNav;
