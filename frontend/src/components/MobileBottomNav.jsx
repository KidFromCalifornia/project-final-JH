import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCafeStore } from "../useCafeStore";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import {
  Login as LoginIcon,
  Logout as LogoutIcon,
  DoorFront as DoorFrontIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  RateReview as RateReviewIcon,
  Map as MapIcon,
  AddLocation as AddLocationIcon,
  Storefront as StorefrontIcon,
  TravelExplore as TravelExploreIcon,
  AccountCircle as AccountCircleIcon,
  MyLocation as MyLocationIcon,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import FilterDropdown from "./FilterDropdown";

const MobileBottomNav = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useCafeStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useCafeStore((state) => state.setIsLoggedIn);
  const cafes = useCafeStore((state) => state.cafes);
  const categories = Array.from(
    new Set(cafes.map((cafe) => cafe.category).filter(Boolean))
  );
  let isAdmin = false;
  // Search dialog state
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  if (typeof window !== "undefined" && window.localStorage) {
    isAdmin = localStorage.getItem("admin") === "true";
  }

  // Navigation handler
  const handleNav = (path) => {
    navigate(path);
  };

  // Geotag handler for MapPage
  const handleGeotag = () => {
    // Dispatch a custom event for MapPage to listen for geotag
    window.dispatchEvent(new Event("triggerGeotag"));
  };

  return (
    <React.Fragment>
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          top: "auto",
          bottom: 0,
          width: "100vw",
          height: 56,
          display: { xs: "flex", sm: "none" },
          zIndex: 1200,
          borderRadius: 0,
        }}
      >
        <Toolbar
          sx={{
            minHeight: 56,
            px: 1,
            justifyContent: "center",
            overflowX: "auto",
            gap: 0.5,
          }}
        >
          <IconButton
            color="inherit"
            size="large"
            sx={{ p: 1 }}
            onClick={() => handleNav("/tastings")}
          >
            <RateReviewIcon
              fontSize="medium"
              sx={{ color: theme.palette.light.main }}
            />
          </IconButton>
          <FilterDropdown
            aria-label="Filter by Cafe Type"
            options={categories}
            value={searchQuery}
            onChange={setSearchQuery}
            iconComponent={
              <StorefrontIcon
                fontSize="medium"
                sx={{ color: theme.palette.light.main }}
              />
            }
            sx={{ minWidth: 40 }}
          />
          <FilterDropdown
            aria-label="Filter by neighborhood"
            options={Array.from(
              new Set(cafes.map((cafe) => cafe.neighborhood).filter(Boolean))
            )}
            value={searchQuery}
            onChange={setSearchQuery}
            iconComponent={
              <TravelExploreIcon
                fontSize="medium"
                sx={{ color: theme.palette.light.main }}
              />
            }
            sx={{ minWidth: 40 }}
          />
          <IconButton
            color="inherit"
            size="large"
            sx={{ p: 1 }}
            onClick={() => setSearchOpen(true)}
          >
            <SearchIcon
              fontSize="medium"
              sx={{ color: theme.palette.light.main }}
            />
          </IconButton>
          {isLoggedIn && isAdmin && (
            <IconButton
              color="inherit"
              size="large"
              sx={{ p: 1 }}
              onClick={() => handleNav("/admin")}
            >
              <AdminPanelSettingsIcon
                fontSize="medium"
                sx={{ color: theme.palette.light.main }}
              />
            </IconButton>
          )}
          {isLoggedIn && !isAdmin && (
            <IconButton
              color="inherit"
              size="large"
              sx={{ p: 1 }}
              onClick={() => handleNav("/user")}
            >
              <DoorFrontIcon
                fontSize="medium"
                sx={{ color: theme.palette.light.main }}
              />
            </IconButton>
          )}
          {isLoggedIn ? (
            <IconButton
              color="inherit"
              size="large"
              sx={{ p: 1 }}
              onClick={() => {
                localStorage.removeItem("userToken");
                localStorage.removeItem("username");
                localStorage.removeItem("admin");
                setIsLoggedIn(false);
                handleNav("/");
              }}
            >
              <LogoutIcon
                fontSize="medium"
                sx={{ color: theme.palette.light.main }}
              />
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              size="large"
              sx={{ p: 1 }}
              onClick={() => handleNav("/login")}
            >
              <LoginIcon
                fontSize="medium"
                sx={{ color: theme.palette.light.main }}
              />
            </IconButton>
          )}

          <Dialog
            open={searchOpen}
            onClose={() => setSearchOpen(false)}
            maxWidth="xs"
            fullWidth
          >
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Search Cafes"
                type="text"
                fullWidth
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </DialogContent>
          </Dialog>
        </Toolbar>
      </AppBar>
      {isLoggedIn &&
        (location.pathname === "/" ? (
          <Fab
            color="primary"
            aria-label="geotag"
            onClick={handleGeotag}
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
            }}
          >
            <MyLocationIcon
              fontSize="large"
              sx={{ color: theme.palette.light.main }}
            />
          </Fab>
        ) : (
          <Fab
            color="primary"
            aria-label="back to map"
            onClick={() => handleNav("/")}
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
            }}
          >
            <MapIcon
              fontSize="large"
              sx={{ color: theme.palette.light.main }}
            />
          </Fab>
        ))}
    </React.Fragment>
  );
};

export default MobileBottomNav;
