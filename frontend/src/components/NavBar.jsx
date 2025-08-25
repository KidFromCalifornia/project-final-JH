import * as React from "react";
import { Link } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FilterDropdown from "./FilterDropdown";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { ListItemButton } from "@mui/material";
import { useCafeStore } from "../useCafeStore";

// import components
import FilterDropdown from "./FilterDropdown";

// Import Icons
import LoginIcon from "@mui/icons-material/Login";
import DoorFrontIcon from "@mui/icons-material/DoorFront";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import RateReviewIcon from "@mui/icons-material/RateReview";
import MapIcon from "@mui/icons-material/Map";
import AddLocationIcon from "@mui/icons-material/AddLocation";

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
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
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
  // Get unique categories from cafes data
  // Use all cafes if searchResults is empty, so categories always show
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
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} color="secondary">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 5, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div">
            Stockholms Coffee Club
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} color="secondary">
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton component={Link} to="/">
              <ListItemIcon>
                <MapIcon />
              </ListItemIcon>
              <ListItemText primary="Map" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton component={Link} to="/tastings">
              <ListItemIcon>
                <RateReviewIcon />
              </ListItemIcon>
              <ListItemText primary="Tastings" />
            </ListItemButton>
          </ListItem>
          {isLoggedIn && (
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton onClick={() => setShowAddCafe(true)}>
                <ListItemIcon>
                  <AddLocationIcon />{" "}
                </ListItemIcon>
                <ListItemText primary="Add Cafe" />
              </ListItemButton>
            </ListItem>
          )}
          {isLoggedIn && isAdmin && (
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton component={Link} to="/admin">
                <ListItemIcon>
                  <AdminPanelSettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Admin" />
              </ListItemButton>
            </ListItem>
          )}
          {isLoggedIn && !isAdmin && (
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton component={Link} to="/user">
                <ListItemIcon>
                  <DoorFrontIcon />
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
                  <LoginIcon />
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
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
        <Divider />
        <FilterDropdown
          label="Filter by location type"
          options={categories}
          value={searchQuery}
          onChange={setSearchQuery}
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
