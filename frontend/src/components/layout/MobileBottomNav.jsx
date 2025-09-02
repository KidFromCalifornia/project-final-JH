import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCafeStore } from '../../stores/useCafeStore';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import FilterDropdown from '../common/FilterDropdown';
import LoginForm from '../forms/LoginForm';
import NewCafeForm from '../forms/NewCafeForm';

import {
  Login as LoginIcon,
  Logout as LogoutIcon,
  DoorFront as DoorFrontIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  RateReview as RateReviewIcon,
  Map as MapIcon,
  AddLocation as AddLocationIcon,
  Storefront as StorefrontIcon,
  TravelExplore as TravelExploreIcon,
  AccountCircle as AccountCircleIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  FilterList as FilterListIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';

const drawerWidth = 300;
const appBarHeight = 56; // match this to your AppBar height

const MobileBottomNav = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = useCafeStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useCafeStore((state) => state.setIsLoggedIn);
  const cafes = useCafeStore((state) => state.cafes);
  const themeMode = useCafeStore((state) => state.themeMode);
  const setThemeMode = useCafeStore((state) => state.setThemeMode);
  const darkMode = themeMode === 'dark';
  const navIconColor = theme.palette.light?.main || '#fff';

  // Use store filters instead of local state
  const cafeTypeQuery = useCafeStore((state) => state.cafeTypeFilter);
  const neighborhoodQuery = useCafeStore((state) => state.neighborhoodFilter);
  const setCafeTypeQuery = useCafeStore((state) => state.setCafeTypeFilter);
  const setNeighborhoodQuery = useCafeStore((state) => state.setNeighborhoodFilter);
  const clearFilters = useCafeStore((state) => state.clearFilters);

  const categories = Array.from(new Set(cafes.map((cafe) => cafe.category).filter(Boolean)));

  const neighborhoods = Array.from(
    new Set(cafes.map((cafe) => cafe.locations?.[0]?.neighborhood).filter(Boolean))
  );

  let isAdmin = false;
  if (typeof window !== 'undefined' && window.localStorage) {
    isAdmin = localStorage.getItem('admin') === 'true';
  }

  // Local UI state (remove filter state as it's now in store)
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showLogin, setShowLogin] = React.useState(false);
  const [showAddCafe, setShowAddCafe] = React.useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = React.useState(false);

  // Ensure only one drawer can be open at a time
  const openDrawer = (drawerType) => {
    if (drawerType === 'main') {
      setFilterDrawerOpen(false);
      setDrawerOpen(true);
    } else if (drawerType === 'filter') {
      setDrawerOpen(false);
      setFilterDrawerOpen(true);
    }

    // Dispatch event to notify other components about drawer state
    window.dispatchEvent(
      new CustomEvent('drawerStateChange', {
        detail: { isOpen: true },
      })
    );
  };

  const closeDrawers = () => {
    setDrawerOpen(false);
    setFilterDrawerOpen(false);

    // Dispatch event to notify other components about drawer state
    window.dispatchEvent(
      new CustomEvent('drawerStateChange', {
        detail: { isOpen: false },
      })
    );
  };

  const handleNav = (path) => {
    navigate(path);
    closeDrawers();
  };

  const toggleDarkMode = () => {
    setThemeMode(darkMode ? 'light' : 'dark');
  };

  // Common drawer props to ensure consistent styling
  const drawerPaperProps = {
    sx: {
      width: '100%',
      maxHeight: 'calc(50vh)',
      height: 'auto',
      overflowY: 'auto',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      bottom: appBarHeight,
      position: 'fixed',
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.light?.main || '#fff',
      boxShadow: '0px -4px 8px rgba(0,0,0,0.1)',
    },
  };

  return (
    <React.Fragment>
      <AppBar
        position="fixed"
        sx={{
          top: 'auto',
          bottom: 0,
          width: '100vw',
          height: appBarHeight,
          display: { xs: 'flex', sm: 'none' },
          zIndex: 1200,
          borderRadius: 0,
        }}
      >
        <Toolbar
          sx={{
            minHeight: appBarHeight,
            px: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            overflowX: 'auto',
            gap: 0.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Main Menu" arrow>
              <IconButton
                color="inherit"
                size="large"
                sx={{ p: 1 }}
                onClick={() => openDrawer('main')}
              >
                <MenuIcon fontSize="medium" sx={{ color: navIconColor }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Coffee Tastings" arrow>
              <IconButton
                color="inherit"
                size="large"
                sx={{ p: 1 }}
                onClick={() => handleNav('/tastings')}
              >
                <RateReviewIcon fontSize="medium" sx={{ color: navIconColor }} />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Search Cafes" arrow>
              <IconButton
                color="inherit"
                size="large"
                sx={{ p: 1 }}
                onClick={() => setSearchOpen(true)}
              >
                <SearchIcon fontSize="medium" sx={{ color: navIconColor }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Filter Options" arrow>
              <IconButton
                color="inherit"
                size="large"
                sx={{ p: 1 }}
                onClick={() => openDrawer('filter')}
              >
                <FilterListIcon fontSize="medium" sx={{ color: navIconColor }} />
              </IconButton>
            </Tooltip>

            {isLoggedIn ? (
              <Tooltip title="Logout" arrow>
                <IconButton
                  color="inherit"
                  size="large"
                  sx={{ p: 1 }}
                  onClick={() => {
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('username');
                    localStorage.removeItem('admin');
                    setIsLoggedIn(false);
                    handleNav('/');
                  }}
                >
                  <LogoutIcon fontSize="medium" sx={{ color: navIconColor }} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Login" arrow>
                <IconButton
                  color="inherit"
                  size="large"
                  sx={{ p: 1 }}
                  onClick={() => navigate('/login')}
                >
                  <LoginIcon fontSize="medium" sx={{ color: navIconColor }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer - mirrors NavBar */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={closeDrawers}
        hideBackdrop={false}
        PaperProps={drawerPaperProps}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          zIndex: 1199, // just below AppBar
        }}
      >
        <List sx={{ pt: 0 }}>
          <ListItem
            disablePadding
            sx={{
              backgroundColor: theme.palette.primary.dark,
              display: 'flex',
              justifyContent: 'space-between',
              pl: 2,
              pr: 1,
              py: 0.5,
            }}
          >
            <Box component="span" sx={{ fontWeight: 500, fontSize: '1.2rem', color: navIconColor }}>
              Menu
            </Box>
            <IconButton onClick={closeDrawers}>
              <KeyboardArrowDownIcon sx={{ color: navIconColor }} />
            </IconButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/" onClick={closeDrawers}>
              <ListItemIcon>
                <MapIcon sx={{ color: navIconColor }} />
              </ListItemIcon>
              <ListItemText primary="Map" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/tastings" onClick={closeDrawers}>
              <ListItemIcon>
                <RateReviewIcon sx={{ color: navIconColor }} />
              </ListItemIcon>
              <ListItemText primary="Tastings" />
            </ListItemButton>
          </ListItem>

          {isLoggedIn && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setShowAddCafe(true);
                  closeDrawers();
                }}
              >
                <ListItemIcon>
                  <AddLocationIcon sx={{ color: navIconColor }} />
                </ListItemIcon>
                <ListItemText primary="Add Cafe" />
              </ListItemButton>
            </ListItem>
          )}

          {isLoggedIn && isAdmin && (
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/admin" onClick={closeDrawers}>
                <ListItemIcon>
                  <AdminPanelSettingsIcon sx={{ color: navIconColor }} />
                </ListItemIcon>
                <ListItemText primary="Admin" />
              </ListItemButton>
            </ListItem>
          )}

          {isLoggedIn && !isAdmin && (
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/user" onClick={closeDrawers}>
                <ListItemIcon>
                  <DoorFrontIcon sx={{ color: navIconColor }} />
                </ListItemIcon>
                <ListItemText primary="Userpage" />
              </ListItemButton>
            </ListItem>
          )}

          <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />

          {!isLoggedIn ? (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setShowLogin(true);
                  closeDrawers();
                }}
              >
                <ListItemIcon>
                  <LoginIcon sx={{ color: navIconColor }} />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
          ) : (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  localStorage.removeItem('userToken');
                  localStorage.removeItem('username');
                  localStorage.removeItem('admin');
                  setIsLoggedIn(false);
                  closeDrawers();
                  navigate('/');
                }}
              >
                <ListItemIcon>
                  <LogoutIcon sx={{ color: navIconColor }} />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          )}

          <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />

          <ListItem>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {darkMode ? (
                  <DarkModeIcon sx={{ color: navIconColor }} />
                ) : (
                  <LightModeIcon sx={{ color: navIconColor }} />
                )}
                <Box component="span" sx={{ color: navIconColor }}>
                  Theme
                </Box>
              </Box>
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                inputProps={{ 'aria-label': 'toggle dark mode' }}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: theme.palette.light?.main,
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: theme.palette.accent?.main,
                  },
                }}
              />
            </Box>
          </ListItem>

          <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/about" onClick={closeDrawers}>
              <ListItemIcon>
                <InfoIcon sx={{ color: navIconColor }} />
              </ListItemIcon>
              <ListItemText primary="About Me" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Drawer
        anchor="bottom"
        open={filterDrawerOpen}
        onClose={closeDrawers}
        hideBackdrop={false}
        PaperProps={drawerPaperProps}
        sx={{
          '& .MuiBackdrop-root': { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
          zIndex: 1199,
        }}
      >
        {/* Header */}
        <List sx={{ pt: 0 }}>
          <ListItem
            disablePadding
            sx={{
              backgroundColor: theme.palette.primary.dark,
              display: 'flex',
              justifyContent: 'space-between',
              pl: 2,
              pr: 1,
              py: 0.5,
            }}
          >
            <Box component="span" sx={{ fontWeight: 500, fontSize: '1.2rem', color: navIconColor }}>
              Filter Cafes
            </Box>
            <IconButton onClick={closeDrawers}>
              <KeyboardArrowDownIcon sx={{ color: navIconColor }} />
            </IconButton>
          </ListItem>
        </List>

        {/* Filter controls */}
        <Box sx={{ px: 2, py: 2 }}>
          {/* Cafe Type */}
          <TextField
            select
            fullWidth
            label="Filter by Cafe Type"
            value={cafeTypeQuery}
            onChange={(e) => setCafeTypeQuery(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': { color: theme.palette.light.main },
              '& .MuiInputLabel-root': { color: theme.palette.light.main },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.light.main },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.light.main },
              '& .MuiSelect-icon': { color: theme.palette.light.main },
            }}
            InputProps={{
              startAdornment: <StorefrontIcon sx={{ color: navIconColor, mr: 1 }} />,
            }}
          >
            <MenuItem sx={{ color: theme.palette.light.main, fontWeight: 500 }} value="all">
              All Types
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} sx={{ color: theme.palette.light.main }} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          {/* Neighborhood */}
          <TextField
            select
            fullWidth
            label="Filter by Neighborhood"
            value={neighborhoodQuery}
            onChange={(e) => setNeighborhoodQuery(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': { color: theme.palette.light.main },
              '& .MuiInputLabel-root': { color: theme.palette.light.main },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.light.main },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.light.main },
              '& .MuiSelect-icon': { color: theme.palette.light.main },
            }}
            InputProps={{
              startAdornment: <TravelExploreIcon sx={{ color: navIconColor, mr: 1 }} />,
            }}
          >
            <MenuItem sx={{ color: theme.palette.light.main, fontWeight: 500 }} value="all">
              All Neighborhoods
            </MenuItem>
            {neighborhoods.map((neighborhood) => (
              <MenuItem
                key={neighborhood}
                sx={{ color: theme.palette.light.main }}
                value={neighborhood}
              >
                {neighborhood.charAt(0).toUpperCase() + neighborhood.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Drawer>

      {/* Login dialog */}
      <Dialog
        open={showLogin}
        onClose={() => setShowLogin(false)}
        maxWidth="xs"
        fullWidth
        disableRestoreFocus
        keepMounted={false}
      >
        <DialogContent sx={{ p: 0 }}>
          <LoginForm onClose={() => setShowLogin(false)} setIsLoggedIn={setIsLoggedIn} />
        </DialogContent>
      </Dialog>

      {/* New cafe dialog */}
      <Dialog
        open={showAddCafe}
        onClose={() => setShowAddCafe(false)}
        maxWidth="sm"
        fullWidth
        disableRestoreFocus
        keepMounted={false}
        sx={{
          '& .MuiDialog-container': {
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          },
        }}
        PaperProps={{
          sx: {
            position: 'absolute',
            top: 88,
            left: 24,
            width: { xs: 'calc(100% - 48px)', sm: 600 },
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <NewCafeForm onClose={() => setShowAddCafe(false)} />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default MobileBottomNav;
