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
import NewCafeForm from "./NewCafeForm";
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
  AccountCircle as AccountCircleIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import sccLogoMono from "../assets/whiteCup_logo.svg";
import Switch from "@mui/material/Switch";

const drawerWidth = 320;

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
  showLogin = false,
  setShowLogin = () => {},
  isLoggedIn = false,
  setIsLoggedIn = () => {},
  setCurrentUser = () => {},
  showAddCafe = false,
  setShowAddCafe = () => {},
  onFilteredCafes = () => {},
}) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const themeMode = useCafeStore((state) => state.themeMode);
  const setThemeMode = useCafeStore((state) => state.setThemeMode);
  const setSearchResultsStore = useCafeStore((state) => state.setSearchResults);
  const darkMode = themeMode === "dark";
  const navIconColor = theme.palette.light.main;
  const handleToggleDarkMode = () => {
    setThemeMode(darkMode ? "light" : "dark");
  };
  const allCafes = useCafeStore ? useCafeStore((state) => state.cafes) : [];
  const cafes = searchResults.length > 0 ? searchResults : allCafes;
  const categories = Array.from(
    new Set(cafes.map((cafe) => cafe.category).filter(Boolean))
  );
  // Debug: log full cafes array for troubleshooting

  const neighborhoods = Array.from(
    new Set(
      cafes.map((cafe) => cafe.locations?.[0]?.neighborhood).filter(Boolean)
    )
  );
  let isAdmin = false;
  if (typeof window !== "undefined" && window.localStorage) {
    isAdmin = localStorage.getItem("admin") === "true";
  }

  // Independent filter state
  const [cafeTypeQuery, setCafeTypeQuery] = React.useState("");
  const [neighborhoodQuery, setNeighborhoodQuery] = React.useState("");

  // Filter function
  const filteredCafes = cafes.filter((cafe) => {
    const typeMatch = cafeTypeQuery === "" || cafe.category === cafeTypeQuery;
    const neighborhoodMatch =
      neighborhoodQuery === "" ||
      cafe.locations?.[0]?.neighborhood === neighborhoodQuery;
    return typeMatch && neighborhoodMatch;
  });

  // Expose filtered cafes to parent
  React.useEffect(() => {
    onFilteredCafes(filteredCafes);
    // Also update global store so MapPage reacts to filters
    setSearchResultsStore(filteredCafes);
  }, [filteredCafes, onFilteredCafes, setSearchResultsStore]);

  // If you want to pass filteredCafes to children, do so here

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: { xs: "none", sm: "flex" } }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} color="transparent">
        <Toolbar
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: theme.palette.background.paper,
            borderBottom: darkMode
              ? `1px solid ${theme.palette.divider}`
              : `1px solid ${theme.palette.divider}`,
            color: theme.palette.light.main,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              flexDirection: "row",
              flexGrow: 1,
            }}
          >
            <IconButton
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon
                sx={{
                  color: theme.palette.accent.main,
                }}
              />
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Link
                to="/"
                aria-label="map"
                style={{ display: "inline-flex", lineHeight: 0 }}
              >
                <img
                  src={sccLogoMono}
                  alt="SCC Logo"
                  style={{ height: "2rem", width: "auto", display: "block" }}
                />
              </Link>
              <Typography
                component="div"
                fontWeight={500}
                noWrap
                sx={(t) => ({
                  color: t.palette.light.main,
                  lineHeight: 1,
                  fontFamily: t.typography.header,
                  fontSize: {
                    xs: t.typography.h5.fontSize,
                    sm: t.typography.h4.fontSize,
                    md: t.typography.h2.fontSize,
                  },
                  textTransform: "uppercase",
                })}
                aria-hidden="true"
              >
                Stockholms Coffee Club
              </Typography>
            </Box>
          </Box>
          {/* Dark mode toggle on right side */}
          <Box sx={{ display: "flex", alignItems: "center", float: "right" }}>
            <IconButton sx={{ ml: 2 }}>
              {darkMode ? (
                <DarkModeIcon sx={{ color: navIconColor }} />
              ) : (
                <LightModeIcon sx={{ color: theme.palette.accent.main }} />
              )}
            </IconButton>
            <Switch
              checked={darkMode}
              onChange={handleToggleDarkMode}
              inputProps={{ "aria-label": "toggle dark mode" }}
            />
            {isLoggedIn && (
              <IconButton
                component={Link}
                to="/user"
                sx={{ ml: 2 }}
                aria-label="User Page"
              >
                <AccountCircleIcon
                  sx={{
                    filter: "drop-shadow(1px 2px 4px rgba(0, 0, 0, 0.5))",
                    fill: theme.palette.accent.main,
                  }}
                />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon sx={{ color: theme.palette.accent.main }} />
            ) : (
              <ChevronLeftIcon sx={{ color: theme.palette.accent.main }} />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton component={Link} to="/">
              <ListItemIcon>
                <MapIcon sx={{ color: navIconColor }} />
              </ListItemIcon>
              <ListItemText primary="Map" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton component={Link} to="/tastings">
              <ListItemIcon>
                <RateReviewIcon sx={{ color: navIconColor }} />
              </ListItemIcon>
              <ListItemText primary="Tastings" />
            </ListItemButton>
          </ListItem>
          {isLoggedIn && (
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton onClick={() => setShowAddCafe(true)}>
                <ListItemIcon>
                  <AddLocationIcon sx={{ color: navIconColor }} />
                </ListItemIcon>
                <ListItemText primary="Add Cafe" />
              </ListItemButton>
            </ListItem>
          )}
          {isLoggedIn && isAdmin && (
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton component={Link} to="/admin">
                <ListItemIcon>
                  <AdminPanelSettingsIcon sx={{ color: navIconColor }} />
                </ListItemIcon>
                <ListItemText primary="Admin" />
              </ListItemButton>
            </ListItem>
          )}
          {isLoggedIn && !isAdmin && (
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton component={Link} to="/user">
                <ListItemIcon>
                  <DoorFrontIcon sx={{ color: navIconColor }} />
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
                  <LoginIcon sx={{ color: navIconColor }} />
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
                  <LogoutIcon sx={{ color: navIconColor }} />
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
        <Dialog
          open={showAddCafe}
          onClose={() => setShowAddCafe(false)}
          maxWidth="sm"
          fullWidth
          sx={{
            "& .MuiDialog-container": {
              alignItems: "flex-start",
              justifyContent: "flex-start",
            },
          }}
          PaperProps={{
            sx: {
              position: "absolute",
              top: 88,
              left: open ? drawerWidth + 24 : 88,
            },
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            <NewCafeForm onClose={() => setShowAddCafe(false)} />
          </DialogContent>
        </Dialog>
        <Divider />
        <FilterDropdown
          label="Filter by Cafe Type"
          options={categories}
          value={cafeTypeQuery}
          onChange={setCafeTypeQuery}
          iconComponent={<StorefrontIcon sx={{ color: navIconColor }} />}
        />
        <FilterDropdown
          label="Filter by neighborhood"
          options={neighborhoods}
          value={neighborhoodQuery}
          onChange={setNeighborhoodQuery}
          iconComponent={<TravelExploreIcon sx={{ color: navIconColor }} />}
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
