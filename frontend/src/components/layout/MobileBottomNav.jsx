import React, { useState, Suspense } from 'react';
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
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';

import LoadingLogo from '../common/LoadingLogo';

// Lazy load forms for better performance
const LoginForm = React.lazy(() => import('../forms/LoginForm'));
const NewCafeForm = React.lazy(() => import('../forms/NewCafeForm'));

import {
  Login as LoginIcon,
  Logout as LogoutIcon,
  DoorFront as DoorFrontIcon,
  Menu as MenuIcon,
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
  Search as SearchIcon,
} from '@mui/icons-material';

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

  const categories = Array.from(new Set(cafes.map((cafe) => cafe.category).filter(Boolean)));

  const neighborhoods = Array.from(
    new Set(cafes.map((cafe) => cafe.locations?.[0]?.neighborhood).filter(Boolean))
  );

  let isAdmin = false;
  if (typeof window !== 'undefined' && window.localStorage) {
    isAdmin = localStorage.getItem('admin') === 'true';
  }

  // Local UI state (remove filter state as it's now in store)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showAddCafe, setShowAddCafe] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  console.log('Cafes count:', cafes.length);
  console.log('Categories:', categories);
  console.log('Neighborhoods:', neighborhoods);

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
                sx={{
                  p: 1,
                  bgcolor: drawerOpen ? 'rgba(255,255,255,0.15)' : 'transparent',
                  transition: 'background-color 200ms ease',
                  '&:hover': {
                    bgcolor: drawerOpen ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                  },
                }}
                onClick={() => (drawerOpen ? closeDrawers() : openDrawer('main'))}
              >
                <MenuIcon
                  fontSize="medium"
                  sx={{
                    color: drawerOpen ? theme.palette.accent?.main || navIconColor : navIconColor,
                    transition: 'color 200ms ease',
                  }}
                />
              </IconButton>
            </Tooltip>

            <Tooltip title="Coffee Tastings" arrow>
              <IconButton
                color="inherit"
                size="large"
                sx={{
                  p: 1,
                  bgcolor:
                    location.pathname === '/tastings' ? 'rgba(255,255,255,0.15)' : 'transparent',
                  transition: 'background-color 200ms ease',
                  '&:hover': {
                    bgcolor:
                      location.pathname === '/tastings'
                        ? 'rgba(255,255,255,0.2)'
                        : 'rgba(255,255,255,0.1)',
                  },
                }}
                onClick={() => handleNav('/tastings')}
              >
                <RateReviewIcon
                  fontSize="medium"
                  sx={{
                    color:
                      location.pathname === '/tastings'
                        ? theme.palette.accent?.main || navIconColor
                        : navIconColor,
                    transition: 'color 200ms ease',
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Search Cafes" arrow>
              <IconButton
                color="inherit"
                size="large"
                sx={{
                  p: 1,
                  bgcolor: searchOpen ? 'rgba(255,255,255,0.15)' : 'transparent',
                  transition: 'background-color 200ms ease',
                  '&:hover': {
                    bgcolor: searchOpen ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                  },
                }}
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <SearchIcon
                  fontSize="medium"
                  sx={{
                    color: searchOpen ? theme.palette.accent?.main || navIconColor : navIconColor,
                    transition: 'color 200ms ease',
                  }}
                />
              </IconButton>
            </Tooltip>

            <Tooltip title="Filter Options" arrow>
              <IconButton
                color="inherit"
                size="large"
                sx={{
                  p: 1,
                  bgcolor: filterDrawerOpen ? 'rgba(255,255,255,0.15)' : 'transparent',
                  transition: 'background-color 200ms ease',
                  '&:hover': {
                    bgcolor: filterDrawerOpen ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                  },
                }}
                onClick={() => (filterDrawerOpen ? closeDrawers() : openDrawer('filter'))}
              >
                <FilterListIcon
                  fontSize="medium"
                  sx={{
                    color: filterDrawerOpen
                      ? theme.palette.accent?.main || navIconColor
                      : navIconColor,
                    transition: 'color 200ms ease',
                  }}
                />
              </IconButton>
            </Tooltip>
            {isLoggedIn ? (
              <Tooltip title="Logout" arrow>
                <IconButton
                  color="inherit"
                  size="large"
                  sx={{
                    p: 1,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
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
                  sx={{
                    p: 1,
                    bgcolor: showLogin ? 'rgba(255,255,255,0.15)' : 'transparent',
                    transition: 'background-color 200ms ease',
                    '&:hover': {
                      bgcolor: showLogin ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                    },
                  }}
                  onClick={() => setShowLogin(!showLogin)}
                >
                  <LoginIcon
                    fontSize="medium"
                    sx={{
                      color: showLogin ? theme.palette.accent?.main || navIconColor : navIconColor,
                      transition: 'color 200ms ease',
                    }}
                  />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </AppBar>

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
            <ListItemButton
              component={Link}
              to="/"
              onClick={closeDrawers}
              sx={{
                bgcolor: location.pathname === '/' ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  bgcolor:
                    location.pathname === '/' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                },
              }}
            >
              <ListItemIcon>
                <MapIcon
                  sx={{
                    color:
                      location.pathname === '/'
                        ? theme.palette.accent?.main || navIconColor
                        : navIconColor,
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="Map" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/tastings"
              onClick={closeDrawers}
              sx={{
                bgcolor:
                  location.pathname === '/tastings' ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  bgcolor:
                    location.pathname === '/tastings'
                      ? 'rgba(255,255,255,0.15)'
                      : 'rgba(255,255,255,0.05)',
                },
              }}
            >
              <ListItemIcon>
                <RateReviewIcon
                  sx={{
                    color:
                      location.pathname === '/tastings'
                        ? theme.palette.accent?.main || navIconColor
                        : navIconColor,
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="Tastings" />
            </ListItemButton>
          </ListItem>

          {isLoggedIn && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setShowAddCafe(!showAddCafe);
                  closeDrawers();
                }}
                sx={{
                  bgcolor: showAddCafe ? 'rgba(255,255,255,0.1)' : 'transparent',
                  '&:hover': {
                    bgcolor: showAddCafe ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                  },
                }}
              >
                <ListItemIcon>
                  <AddLocationIcon
                    sx={{
                      color: showAddCafe
                        ? theme.palette.accent?.main || navIconColor
                        : navIconColor,
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary="Add Cafe" />
              </ListItemButton>
            </ListItem>
          )}

          {isLoggedIn && isAdmin && (
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/admin"
                onClick={closeDrawers}
                sx={{
                  bgcolor: location.pathname === '/admin' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  '&:hover': {
                    bgcolor:
                      location.pathname === '/admin'
                        ? 'rgba(255,255,255,0.15)'
                        : 'rgba(255,255,255,0.05)',
                  },
                }}
              >
                <ListItemIcon>
                  <AdminPanelSettingsIcon
                    sx={{
                      color:
                        location.pathname === '/admin'
                          ? theme.palette.accent?.main || navIconColor
                          : navIconColor,
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary="Admin" />
              </ListItemButton>
            </ListItem>
          )}

          {isLoggedIn && !isAdmin && (
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/user"
                onClick={closeDrawers}
                sx={{
                  bgcolor: location.pathname === '/user' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  '&:hover': {
                    bgcolor:
                      location.pathname === '/user'
                        ? 'rgba(255,255,255,0.15)'
                        : 'rgba(255,255,255,0.05)',
                  },
                }}
              >
                <ListItemIcon>
                  <DoorFrontIcon
                    sx={{
                      color:
                        location.pathname === '/user'
                          ? theme.palette.accent?.main || navIconColor
                          : navIconColor,
                    }}
                  />
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
                  setShowLogin(!showLogin);
                  closeDrawers();
                }}
                sx={{
                  bgcolor: showLogin ? 'rgba(255,255,255,0.1)' : 'transparent',
                  '&:hover': {
                    bgcolor: showLogin ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                  },
                }}
              >
                <ListItemIcon>
                  <LoginIcon
                    sx={{
                      color: showLogin ? theme.palette.accent?.main || navIconColor : navIconColor,
                    }}
                  />
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
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                  },
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
            <ListItemButton
              component={Link}
              to="/about"
              onClick={closeDrawers}
              sx={{
                bgcolor: location.pathname === '/about' ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  bgcolor:
                    location.pathname === '/about'
                      ? 'rgba(255,255,255,0.15)'
                      : 'rgba(255,255,255,0.05)',
                },
              }}
            >
              <ListItemIcon>
                <InfoIcon
                  sx={{
                    color:
                      location.pathname === '/about'
                        ? theme.palette.accent?.main || navIconColor
                        : navIconColor,
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="About Page" />
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
          <Suspense fallback={<LoadingLogo />}>
            <LoginForm onClose={() => setShowLogin(false)} setIsLoggedIn={setIsLoggedIn} />
          </Suspense>
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
          <Suspense fallback={<LoadingLogo />}>
            <NewCafeForm onClose={() => setShowAddCafe(false)} />
          </Suspense>
        </DialogContent>
      </Dialog>

      {/* Search dialog */}
      <Dialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            pt: 1,
            width: { xs: 'calc(100% - 32px)', sm: '400px' },
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Search Cafes</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            placeholder="Search by name, neighborhood or coffee roaster..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            variant="outlined"
            size="medium"
          />
          {searchQuery && (
            <Box sx={{ mt: 2 }}>
              <List>
                {cafes
                  .filter(
                    (cafe) =>
                      cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (cafe.locations?.[0]?.neighborhood || '')
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      (cafe.roaster || '').toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .slice(0, 5) // Limit results
                  .map((cafe) => (
                    <ListItem
                      key={cafe._id}
                      button
                      onClick={() => {
                        navigate(`/cafe/${cafe._id}`);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': {
                          bgcolor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <StorefrontIcon sx={{ mr: 2, color: 'text.secondary' }} />
                      <ListItemText
                        primary={cafe.name}
                        secondary={cafe.locations?.[0]?.neighborhood || 'Unknown location'}
                      />
                    </ListItem>
                  ))}
              </List>
              {cafes.filter(
                (cafe) =>
                  cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (cafe.locations?.[0]?.neighborhood || '')
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  (cafe.roaster || '').toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                  No cafes found matching your search
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default MobileBottomNav;
