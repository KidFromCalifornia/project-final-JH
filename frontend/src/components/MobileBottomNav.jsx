import React from "react";
import { useNavigate } from "react-router-dom";
import { useCafeStore } from "../useCafeStore";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
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
  const [value, setValue] = React.useState(0);

  const handleNav = (path) => {
    navigate(path);
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        display: { xs: "block", sm: "none" },
      }}
      elevation={6}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
      >
        <BottomNavigationAction
          label="Map"
          icon={<MapIcon />}
          onClick={() => handleNav("/")}
        />
        <BottomNavigationAction
          label="Tastings"
          icon={<RateReviewIcon />}
          onClick={() => handleNav("/tastings")}
        />
        {isLoggedIn &&
          (isAdmin ? (
            <BottomNavigationAction
              label="Admin"
              icon={<AdminPanelSettingsIcon />}
              onClick={() => handleNav("/admin")}
            />
          ) : (
            <BottomNavigationAction
              label="User"
              icon={<DoorFrontIcon />}
              onClick={() => handleNav("/user")}
            />
          ))}
        {isLoggedIn && (
          <BottomNavigationAction
            label="Logout"
            icon={<LogoutIcon />}
            onClick={() => {
              localStorage.removeItem("userToken");
              localStorage.removeItem("username");
              localStorage.removeItem("admin");
              setIsLoggedIn(false);
              handleNav("/");
            }}
          />
        )}
        {!isLoggedIn && (
          <BottomNavigationAction
            label="Login"
            icon={<LoginIcon />}
            onClick={() => handleNav("/login")}
          />
        )}
      </BottomNavigation>
    </Paper>
  );
};

export default MobileBottomNav;
