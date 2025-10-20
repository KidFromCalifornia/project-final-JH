import React, { Suspense } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Toolbar,
  CssBaseline,
  Tooltip,
  IconButton,
  Dialog,
  DialogContent,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Link,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
  Info as InfoIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  DoorFront as DoorFrontIcon,
} from '@mui/icons-material';

import NavigationHeader from './navigation/NavigationHeader';
import NavigationItems from './navigation/NavigationItems';
import { AppBar, Drawer, DrawerHeader, drawerWidth } from './navigation/NavigationStyles';
import LoadingLogo from '../common/LoadingLogo';
import { useCafeStore } from '../../stores/useCafeStore';

import LoginForm from '../forms/LoginForm';
import NewCafeForm from '../forms/NewCafeForm';

const DesktopNavBar = ({
  searchResults = [],
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
  const darkMode = themeMode === 'dark';
  const navIconColor = theme.palette.light?.main || '#fff';

  // Store state
  const allCafes = useCafeStore((state) => state.cafes);
  const cafeTypeQuery = useCafeStore((state) => state.cafeTypeFilter);
  const neighborhoodQuery = useCafeStore((state) => state.neighborhoodFilter);
  const setCafeTypeQuery = useCafeStore((state) => state.setCafeTypeFilter);
  const setNeighborhoodQuery = useCafeStore((state) => state.setNeighborhoodFilter);
  const filteredCafes = useCafeStore((state) => state.filteredCafes);
  const clearFilters = useCafeStore((state) => state.clearFilters);

  // Computed values
  const cafes = searchResults.length > 0 ? searchResults : allCafes;
  const categories = Array.from(new Set(cafes.map((cafe) => cafe.category).filter(Boolean)));
  const neighborhoods = Array.from(
    new Set(cafes.map((cafe) => cafe.locations?.[0]?.neighborhood).filter(Boolean))
  );

  let isAdmin = false;
  if (typeof window !== 'undefined' && window.localStorage) {
    isAdmin = localStorage.getItem('admin') === 'true';
  }

  // Handlers
  const handleToggleDarkMode = () => {
    setThemeMode(darkMode ? 'light' : 'dark');
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Expose filtered cafes to parent
  React.useEffect(() => {
    onFilteredCafes(filteredCafes);
  }, [filteredCafes, onFilteredCafes]);

  return (
    <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        open={open}
        color="transparent"
        component="header"
        role="banner"
        aria-label="Main site navigation"
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.palette.primary.main,
            boxShadow: `0 0.125rem 0.5rem ${theme.palette.secondary.main}40`,
            color: theme.palette.light?.main || '#fff',
          }}
        >
          <NavigationHeader
            theme={theme}
            open={open}
            darkMode={darkMode}
            isLoggedIn={isLoggedIn}
            navIconColor={navIconColor}
            handleToggleDarkMode={handleToggleDarkMode}
          />
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open} role="navigation" aria-label="Site navigation menu">
        <DrawerHeader>
          <Tooltip title="Menu" arrow>
            <IconButton
              onClick={handleDrawerOpen}
              aria-label="Open menu"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleDrawerOpen();
                }
              }}
              sx={{
                alignItems: 'center',
                justifyContent: 'center',
                p: 1,
                visibility: open ? 'hidden' : 'visible',
              }}
            >
              <MenuIcon sx={{ color: theme.palette.accent.main }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Close Menu" arrow>
            <IconButton
              onClick={handleDrawerClose}
              aria-label="Close menu"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleDrawerClose();
                }
              }}
              sx={{
                alignItems: 'center',
                justifyContent: 'center',
                p: 1,
                visibility: open ? 'visible' : 'hidden',
              }}
            >
              {theme.direction === 'rtl' ? (
                <ChevronRightIcon sx={{ color: theme.palette.accent.main }} />
              ) : (
                <ChevronLeftIcon sx={{ color: theme.palette.accent.main }} />
              )}
            </IconButton>
          </Tooltip>
        </DrawerHeader>

        <NavigationItems
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          navIconColor={navIconColor}
          open={open}
          setShowLogin={setShowLogin}
          setShowAddCafe={setShowAddCafe}
          setIsLoggedIn={setIsLoggedIn}
          categories={categories}
          neighborhoods={neighborhoods}
          cafeTypeQuery={cafeTypeQuery}
          neighborhoodQuery={neighborhoodQuery}
          setCafeTypeQuery={setCafeTypeQuery}
          setNeighborhoodQuery={setNeighborhoodQuery}
          clearFilters={clearFilters}
        />

        <Box sx={{ flexGrow: 1 }} />

        <Divider />
        {isLoggedIn && isAdmin && (
          <ListItem sx={{ display: 'block', padding: 0 }}>
            <Tooltip title="Admin" arrow placement="right" disableHoverListener={open}>
              <ListItemButton component={Link} to="/admin">
                <ListItemIcon>
                  <AdminPanelSettingsIcon sx={{ color: navIconColor }} />
                </ListItemIcon>
                <ListItemText primary="Admin" />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        )}

        {isLoggedIn && !isAdmin && (
          <ListItem sx={{ display: 'block', padding: 0 }}>
            <Tooltip title="UserPage" arrow placement="right" disableHoverListener={open}>
              <ListItemButton component={Link} to="/user">
                <ListItemIcon>
                  <DoorFrontIcon sx={{ color: navIconColor }} />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        )}
        <List>
          <ListItem sx={{ display: 'block', padding: 0 }}>
            <Tooltip title="About Me" disableHoverListener={open}>
              <ListItemButton component={Link} to="/about">
                <ListItemIcon>
                  <InfoIcon sx={{ color: navIconColor }} />
                </ListItemIcon>
                <ListItemText primary="About Page" />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Drawer>

      {/* Login Dialog */}
      <Dialog
        open={showLogin}
        onClose={() => setShowLogin(false)}
        maxWidth="xs"
        fullWidth
        disableRestoreFocus
        keepMounted={false}
        sx={{
          '& .MuiDialog-container': {
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2,
          },
          '& .MuiDialog-paper': {
            margin: { xs: 1, sm: 2 },
            width: { xs: 'calc(100vw - 2rem)', sm: 'auto' },
            maxWidth: { xs: 'none', sm: '25rem' },
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <LoginForm
            onClose={() => setShowLogin(false)}
            setCurrentUser={setCurrentUser}
            setIsLoggedIn={setIsLoggedIn}
          />
        </DialogContent>
      </Dialog>

      {/* Add Cafe Dialog */}
      <Dialog
        open={showAddCafe}
        onClose={() => setShowAddCafe(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-container': {
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          },
        }}
        PaperProps={{
          sx: {
            position: 'absolute',
            top: '5.5rem',
            left: open ? `calc(${drawerWidth} + 1.5rem)` : '5.5rem',
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <NewCafeForm onClose={() => setShowAddCafe(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DesktopNavBar;
