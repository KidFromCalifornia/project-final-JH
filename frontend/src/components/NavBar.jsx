import { Link } from "react-router-dom";
import { lazy, Suspense, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Button,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const LoginForm = lazy(() => import("./LoginForm"));
const AddCafeForm = lazy(() => import("./NewCafeForm"));

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
  const [drawerOpen, setDrawerOpen] = useState(false);

  let isAdmin = false;
  if (typeof window !== "undefined" && window.localStorage) {
    isAdmin = localStorage.getItem("admin") === "true";
  }

  return (
    <>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
            sx={{ ml: "auto" }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 320, p: 2 }} role="presentation">
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="versoText">
              <Link
                to="/"
                style={{ textDecoration: "none", color: "inherit" }}
                onClick={() => setDrawerOpen(false)}
              >
                Stockholms Coffee Club
              </Link>
            </Typography>
          </Box>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/"
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary="Map" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/tastings"
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary="Tastings" />
              </ListItemButton>
            </ListItem>
            {isLoggedIn && (
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/userpage"
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary="Userpage" />
                </ListItemButton>
              </ListItem>
            )}
            {searchQuery.trim() !== "" && searchResults.length === 0 && (
              <ListItem>
                <Typography variant="body2" color="error">
                  Not found
                </Typography>
              </ListItem>
            )}
            {isLoggedIn && !showAddCafe && (
              <ListItem>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => setShowAddCafe(true)}
                >
                  Add Cafe
                </Button>
              </ListItem>
            )}
            {isLoggedIn && showAddCafe && (
              <Suspense fallback={<div>Loading...</div>}>
                <AddCafeForm onClose={() => setShowAddCafe(false)} />
              </Suspense>
            )}
            {!isLoggedIn && (
              <ListItem>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => setShowLogin(true)}
                >
                  Login
                </Button>
              </ListItem>
            )}
            {showLogin && (
              <Suspense fallback={<div>Loading...</div>}>
                <LoginForm
                  onClose={() => {
                    setShowLogin(false);
                    setIsLoggedIn(!!localStorage.getItem("userToken"));
                    const userIsAdmin =
                      localStorage.getItem("userRole") === "admin";
                    localStorage.setItem(
                      "admin",
                      userIsAdmin ? "true" : "false"
                    );
                  }}
                  setIsLoggedIn={setIsLoggedIn}
                  setCurrentUser={setCurrentUser}
                />
              </Suspense>
            )}
            {isLoggedIn && (
              <ListItem>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() => {
                    localStorage.removeItem("userToken");
                    localStorage.removeItem("username");
                    localStorage.removeItem("admin");
                    setIsLoggedIn(false);
                    setShowLogin(false);
                  }}
                >
                  Logout
                </Button>
              </ListItem>
            )}
            {isLoggedIn && isAdmin && (
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/admin"
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary="Admin : Your Page" />
                </ListItemButton>
              </ListItem>
            )}
            {isLoggedIn && !isAdmin && (
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/user"
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary="Userpage" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NavBar;
