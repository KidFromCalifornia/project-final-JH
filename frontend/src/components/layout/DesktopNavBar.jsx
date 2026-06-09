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
import { useCafeStore } from '../../stores/useCafeStore';

import LoginForm from '../forms/LoginForm';
import NewCafeForm from '../forms/NewCafeForm';
import SuggestionForm from '../forms/SuggestionForm';

const DesktopNavBar = ({
  searchResults = [],
  isLoggedIn = false,
  setIsLoggedIn = () => {},
  setCurrentUser = () => {},
  showAddCafe = false,
  setShowAddCafe = () => {},
  onFilteredCafes = () => {},
}) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [showSuggestion, setShowSuggestion] = React.useState(false);
  const themeMode = useCafeStore((state) => state.themeMode);
  const setThemeMode = useCafeStore((state) => state.setThemeMode);
  const darkMode = themeMode === 'dark';
  const navIconColor = theme.palette.light.main;

  // Store state
  const allCafes = useCafeStore((state) => state.cafes);
  const cafeTypeQuery = useCafeStore((state) => state.cafeTypeFilter);
  const neighborhoodQuery = useCafeStore((state) => state.neighborhoodFilter);
  const featureQuery = useCafeStore((state) => state.featureFilter);
  const setCafeTypeQuery = useCafeStore((state) => state.setCafeTypeFilter);
  const setNeighborhoodQuery = useCafeStore((state) => state.setNeighborhoodFilter);
  const setFeatureQuery = useCafeStore((state) => state.setFeatureFilter);
  const filteredCafes = useCafeStore((state) => state.filteredCafes);
  const clearFilters = useCafeStore((state) => state.clearFilters);

  // Computed values
  const cafes = searchResults && searchResults.length > 0 ? searchResults : allCafes || [];
  const categories = Array.from(
    new Set((cafes || []).map((cafe) => cafe.category).filter(Boolean))
  );
  const neighborhoods = Array.from(
    new Set((cafes || []).map((cafe) => cafe.locations?.[0]?.neighborhood).filter(Boolean))
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
            color: theme.palette.light.main,
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
          setShowAddCafe={setShowAddCafe}
          setShowSuggestion={setShowSuggestion}
          setIsLoggedIn={setIsLoggedIn}
          categories={categories}
          neighborhoods={neighborhoods}
          cafeTypeQuery={cafeTypeQuery}
          neighborhoodQuery={neighborhoodQuery}
          setCafeTypeQuery={setCafeTypeQuery}
          setNeighborhoodQuery={setNeighborhoodQuery}
          setFeatureQuery={setFeatureQuery}
          featureQuery={featureQuery}
          clearFilters={clearFilters}
        />

        <Box sx={{ flexGrow: 1 }} />

        <Divider />
        {isAdmin && (
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

          <ListItem sx={{ display: 'block', padding: 0 }}>
            <Tooltip title="Instagram" disableHoverListener={open} arrow placement="right">
              <ListItemButton
                component="a"
                href="https://www.instagram.com/stockholmscoffeeclub/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ListItemIcon>
                  <Box
                    component="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    sx={{ width: 24, height: 24, fill: navIconColor }}
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </Box>
                </ListItemIcon>
                <ListItemText primary="Instagram" />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Drawer>

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

      {/* Suggest a Cafe Dialog */}
      <Dialog
        open={showSuggestion}
        onClose={() => setShowSuggestion(false)}
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
          <SuggestionForm onClose={() => setShowSuggestion(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DesktopNavBar;
