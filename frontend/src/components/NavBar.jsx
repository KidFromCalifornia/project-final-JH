import * as React from "react";
import { Link } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";

// import components
import FilterDropdown from "./FilterDropdown";
import { useCafeStore } from "../useCafeStore";
import LoginForm from "./LoginForm";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

// Import Icons
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
  ForkRight,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import sccLogoMono from "../assets/scc_logo_mono.svg";
import Switch from "@mui/material/Switch";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const drawerWidth = 320;
const drawerHeight = "100%";

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  color: theme.palette.text.primary,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: theme.palette.background.default,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const NavBar = ({
  searchResults = [],
  setSearchResults = () => {},
  searchQuery = "",
  setSearchQuery = () => {},
  showLogin = false,
  setShowLogin = () => {},
  isLoggedIn = false,
  setIsLoggedIn = () => {},
  setCurrentUser = () => {},
  showAddCafe = false,
  setShowAddCafe = () => {},
}) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const themeMode = useCafeStore((state) => state.themeMode);
  const setThemeMode = useCafeStore((state) => state.setThemeMode);
  const darkMode = themeMode === "dark";
  const handleToggleDarkMode = () => {
    setThemeMode(darkMode ? "light" : "dark");
  };
  const allCafes = useCafeStore ? useCafeStore((state) => state.cafes) : [];
  const cafes = searchResults.length > 0 ? searchResults : allCafes;
  const categories = Array.from(
    new Set(cafes.map((cafe) => cafe.category).filter(Boolean))
  );
  let isAdmin = false;
  if (typeof window !== "undefined" && window.localStorage) {
    isAdmin = localStorage.getItem("admin") === "true";
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: { xs: "none", sm: "flex" } }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        color={darkMode ? "primary" : "secondary"}
      >
        <Toolbar>
          <IconButton
            // color prop removed; use sx for color if needed
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 5, ...(open && { display: "none" }) }}
          >
            <MenuIcon color="light" />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link label="map" to="/" aligncontent="center">
              <img
                src={sccLogoMono}
                alt="SCC Logo"
                style={{ height: 25, marginRight: 12 }}
              />
            </Link>
            <Typography
              variant="h2"
              noWrap
              component="div"
              fontWeight={700}
              sx={{
                color: darkMode
                  ? theme.palette.primary.main
                  : theme.palette.light.main,
                flexGrow: 1,
              }}
              aria-hidden="true"
            >
              Stockholms Coffee Club
            </Typography>
          </Box>

          {/* Dark mode toggle on right side */}
          <Box sx={{ display: "flex", alignItems: "center", float: "right" }}>
            <IconButton sx={{ ml: 2 }}>
              {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
            <Switch
              checked={darkMode}
              onChange={handleToggleDarkMode}
              // color prop removed; use sx for color if needed
              inputProps={{ "aria-label": "toggle dark mode" }}
            />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon color="light" />
            ) : (
              <ChevronLeftIcon color="light" />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton component={Link} to="/">
              <ListItemIcon>
                <MapIcon color="light" />
              </ListItemIcon>
              <ListItemText primary="Map" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton component={Link} to="/tastings">
              <ListItemIcon>
                <RateReviewIcon color="light" />
              </ListItemIcon>
              <ListItemText primary="Tastings" />
            </ListItemButton>
          </ListItem>
          {isLoggedIn && (
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton onClick={() => setShowAddCafe(true)}>
                <ListItemIcon>
                  <AddLocationIcon color="light" />
                </ListItemIcon>
                <ListItemText primary="Add Cafe" />
              </ListItemButton>
            </ListItem>
          )}
          {isLoggedIn && isAdmin && (
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton component={Link} to="/admin">
                <ListItemIcon>
                  <AdminPanelSettingsIcon color="light" />
                </ListItemIcon>
                <ListItemText primary="Admin" />
              </ListItemButton>
            </ListItem>
          )}
          {isLoggedIn && !isAdmin && (
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton component={Link} to="/user">
                <ListItemIcon>
                  <DoorFrontIcon color="light" />
                </ListItemIcon>
                <ListItemText primary="Userpage" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
        <Divider />
        <List>
          {!isLoggedIn && (
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton onClick={() => setShowLogin(true)}>
                <ListItemIcon>
                  <LoginIcon color="light" />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
          )}
          {isLoggedIn && (
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => {
                  localStorage.removeItem("userToken");
                  localStorage.removeItem("username");
                  localStorage.removeItem("admin");
                  setIsLoggedIn(false);
                  setShowLogin(false);
                }}
              >
                <ListItemIcon>
                  <LogoutIcon color="light" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
        <Dialog
          open={showLogin}
          onClose={() => setShowLogin(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogContent sx={{ p: 0 }}>
            <LoginForm
              onClose={() => setShowLogin(false)}
              setCurrentUser={setCurrentUser}
              setIsLoggedIn={setIsLoggedIn}
            />
          </DialogContent>
        </Dialog>
        <Divider />
        <FilterDropdown
          label="Filter by Cafe Type"
          options={categories}
          value={searchQuery}
          onChange={setSearchQuery}
          iconComponent={<StorefrontIcon color="light" />}
        />
        <FilterDropdown
          label="Filter by neighborhood"
          options={Array.from(
            new Set(cafes.map((cafe) => cafe.neighborhood).filter(Boolean))
          )}
          value={searchQuery}
          onChange={setSearchQuery}
          iconComponent={<TravelExploreIcon color="light" />}
        />
        {/* <FilterDropdown
          label="Filter by neighborhood"
          options={location.neighborhood}
          value={searchQuery}
          onChange={setSearchQuery}
        /> */}
      </Drawer>
    </Box>
  );
};

export default NavBar;
