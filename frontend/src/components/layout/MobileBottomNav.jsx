import React, { useState, Suspense } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCafeStore } from '../../stores/useCafeStore';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme, alpha } from '@mui/material/styles';
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
import Badge from '@mui/material/Badge';

import LoadingLogo from '../common/LoadingLogo';

// Lazy load forms for better performance

const NewCafeForm = React.lazy(() => import('../forms/NewCafeForm'));
const SuggestionForm = React.lazy(() => import('../forms/SuggestionForm'));

import {
  DoorFront as DoorFrontIcon,
  Menu as MenuIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  RateReview as RateReviewIcon,
  Map as MapIcon,
  AddLocation as AddLocationIcon,
  Lightbulb as LightbulbIcon,
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

const drawerWidth = '18.75rem'; // 300px converted to rem
const appBarHeight = '3.5rem'; // 56px converted to rem

const MobileBottomNav = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const cafes = useCafeStore((state) => state.cafes);
  const themeMode = useCafeStore((state) => state.themeMode);
  const setThemeMode = useCafeStore((state) => state.setThemeMode);
  const darkMode = themeMode === 'dark';
  const navIconColor = theme.palette.light?.main || '#fff';

  const cafeTypeQuery = useCafeStore((state) => state.cafeTypeFilter);
  const neighborhoodQuery = useCafeStore((state) => state.neighborhoodFilter);
  const setCafeTypeQuery = useCafeStore((state) => state.setCafeTypeFilter);
  const setNeighborhoodQuery = useCafeStore((state) => state.setNeighborhoodFilter);
  const setSearchQuery = useCafeStore((state) => state.setSearchQuery);
  const setSearchResults = useCafeStore((state) => state.setSearchResults);
  const hasActiveFilters = (cafeTypeQuery && cafeTypeQuery !== 'all') || (neighborhoodQuery && neighborhoodQuery !== 'all');
  const isMapPage = location.pathname === '/';

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
  const [searchQuery, setLocalSearchQuery] = useState('');

  const [showAddCafe, setShowAddCafe] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

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
      borderTopLeftRadius: '1rem',
      borderTopRightRadius: '1rem',
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
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Main Menu" arrow>
              <IconButton
                color="inherit"
                size="large"
                aria-label="Open main menu"
                sx={{
                  p: 0.75,
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
                aria-label="Navigate to coffee tastings"
                sx={{
                  p: 0.75,
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
            {isMapPage && (
              <Tooltip title="Search Cafes" arrow>
                <IconButton
                  color="inherit"
                  size="large"
                  aria-label="Toggle cafe search"
                  sx={{
                    p: 0.75,
                    bgcolor: searchOpen ? 'rgba(255,255,255,0.15)' : 'transparent',
                    transition: 'background-color 200ms ease',
                    '&:hover': { bgcolor: searchOpen ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)' },
                  }}
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <SearchIcon
                    fontSize="medium"
                    sx={{ color: searchOpen ? theme.palette.accent?.main || navIconColor : navIconColor, transition: 'color 200ms ease' }}
                  />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Filter Options" arrow>
              <IconButton
                color="inherit"
                size="large"
                aria-label="Toggle filter options"
                sx={{
                  p: 0.75,
                  bgcolor: filterDrawerOpen ? 'rgba(255,255,255,0.15)' : 'transparent',
                  transition: 'background-color 200ms ease',
                  '&:hover': { bgcolor: filterDrawerOpen ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)' },
                }}
                onClick={() => (filterDrawerOpen ? closeDrawers() : openDrawer('filter'))}
              >
                <Badge
                  variant="dot"
                  invisible={!hasActiveFilters}
                  sx={{ '& .MuiBadge-dot': { backgroundColor: theme.palette.accent?.main } }}
                >
                  <FilterListIcon
                    fontSize="medium"
                    sx={{ color: filterDrawerOpen ? theme.palette.accent?.main || navIconColor : navIconColor, transition: 'color 200ms ease' }}
                  />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={closeDrawers}
        hideBackdrop={false}
        role="navigation"
        aria-label="Mobile navigation menu"
        PaperProps={{
          ...drawerPaperProps,
          tabIndex: -1,
          onKeyDown: (e) => {
            const container = e.currentTarget;
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              container.scrollTop -= 50;
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              container.scrollTop += 50;
            } else if (e.key === 'PageUp') {
              e.preventDefault();
              container.scrollTop -= container.clientHeight;
            } else if (e.key === 'PageDown') {
              e.preventDefault();
              container.scrollTop += container.clientHeight;
            } else if (e.key === 'Home') {
              e.preventDefault();
              container.scrollTop = 0;
            } else if (e.key === 'End') {
              e.preventDefault();
              container.scrollTop = container.scrollHeight;
            }
          },
        }}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          zIndex: 1199, // just below AppBar
        }}
      >
        <List aria-label="Main navigation" sx={{ pt: 0 }}>
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
            <IconButton onClick={closeDrawers} sx={{ p: 0.75 }}>
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
              <ListItemIcon aria-hidden="true">
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
                    color: showAddCafe ? theme.palette.accent?.main || navIconColor : navIconColor,
                  }}
                />
              </ListItemIcon>
              <ListItemText primary="Add Cafe" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                setShowSuggestion(true);
                closeDrawers();
              }}
              sx={{
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
              }}
            >
              <ListItemIcon>
                <LightbulbIcon sx={{ color: navIconColor }} />
              </ListItemIcon>
              <ListItemText primary="Make a Suggestion" />
            </ListItemButton>
          </ListItem>

          {isAdmin && (
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
        role="navigation"
        aria-label="Filter navigation menu"
        PaperProps={{
          ...drawerPaperProps,
          tabIndex: -1,
          onKeyDown: (e) => {
            const container = e.currentTarget;
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              container.scrollTop -= 50;
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              container.scrollTop += 50;
            } else if (e.key === 'PageUp') {
              e.preventDefault();
              container.scrollTop -= container.clientHeight;
            } else if (e.key === 'PageDown') {
              e.preventDefault();
              container.scrollTop += container.clientHeight;
            } else if (e.key === 'Home') {
              e.preventDefault();
              container.scrollTop = 0;
            } else if (e.key === 'End') {
              e.preventDefault();
              container.scrollTop = container.scrollHeight;
            }
          },
        }}
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
            <IconButton onClick={closeDrawers} sx={{ p: 0.75 }}>
              <KeyboardArrowDownIcon sx={{ color: navIconColor }} />
            </IconButton>
          </ListItem>
        </List>
        {/* Filter controls */}
        <Box sx={{ px: 2, py: 2 }}>
          {/* Cafe Type */}
          <TextField
            select
            variant="filled"
            fullWidth
            label="Filter by Cafe Type"
            value={cafeTypeQuery}
            onChange={(e) => setCafeTypeQuery(e.target.value)}
            sx={{
              mb: 2,
            }}
            InputProps={{
              startAdornment: <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />,
              disableUnderline: true,
              sx: {
                paddingTop: '8px',
                backgroundColor: theme.palette.mode === 'dark' ? 'muted.main' : 'light.main',
                borderRadius: 1,
                '& fieldset': { border: 'none' },
              },
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
            variant="filled"
            fullWidth
            label="Filter by Neighborhood"
            value={neighborhoodQuery}
            onChange={(e) => setNeighborhoodQuery(e.target.value)}
            sx={{
              mb: 2,
            }}
            InputProps={{
              startAdornment: <TravelExploreIcon sx={{ mr: 1, color: 'primary.main' }} />,
              disableUnderline: true,
              sx: {
                paddingTop: '8px',
                backgroundColor: theme.palette.mode === 'dark' ? 'muted.main' : 'light.main',
                borderRadius: 1,
                '& fieldset': { border: 'none' },
              },
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

      {/* Make a Suggestion dialog */}
      <Dialog
        open={showSuggestion}
        onClose={() => setShowSuggestion(false)}
        maxWidth="sm"
        fullWidth
        disableRestoreFocus
        keepMounted={false}
        PaperProps={{
          sx: { width: { xs: 'calc(100% - 32px)', sm: 600 }, mx: 'auto', mt: { xs: 2, sm: 4 } },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Suspense fallback={<LoadingLogo />}>
            <SuggestionForm onClose={() => setShowSuggestion(false)} />
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
        PaperProps={{
          sx: { width: { xs: 'calc(100% - 32px)', sm: 600 }, mx: 'auto', mt: { xs: 2, sm: 4 } },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Suspense fallback={<LoadingLogo />}>
            <NewCafeForm onClose={() => setShowAddCafe(false)} />
          </Suspense>
        </DialogContent>
      </Dialog>

      {/* Search dialog — map page only */}
      <Dialog
        open={searchOpen && isMapPage}
        onClose={() => { setSearchOpen(false); setLocalSearchQuery(''); setSearchResults([]); }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, pt: 1, width: { xs: 'calc(100% - 32px)', sm: '400px' } } }}
      >
        <DialogTitle sx={{ pb: 1 }}>Search Cafes</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            placeholder="Search by name or neighbourhood…"
            value={searchQuery}
            onChange={(e) => {
              const q = e.target.value;
              setLocalSearchQuery(q);
              if (!q.trim()) {
                setSearchResults([]);
              } else {
                const results = cafes.filter(
                  (cafe) =>
                    cafe.name.toLowerCase().includes(q.toLowerCase()) ||
                    cafe.locations?.some((l) =>
                      (l.neighborhood || '').toLowerCase().includes(q.toLowerCase())
                    )
                );
                setSearchResults(results);
              }
            }}
            InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
            size="medium"
          />
          {searchQuery && (
            <Box sx={{ mt: 2 }}>
              {cafes.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                <Box sx={{ p: 2, textAlign: 'center', opacity: 0.6 }}>No cafes found</Box>
              ) : (
                <List disablePadding>
                  {cafes
                    .filter(
                      (cafe) =>
                        cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        cafe.locations?.some((l) =>
                          (l.neighborhood || '').toLowerCase().includes(searchQuery.toLowerCase())
                        )
                    )
                    .slice(0, 6)
                    .map((cafe) => (
                      <ListItemButton
                        key={cafe._id}
                        onClick={() => {
                          setSearchResults([cafe]);
                          setSearchOpen(false);
                        }}
                        sx={{ borderRadius: 1, mb: 0.5 }}
                      >
                        <StorefrontIcon sx={{ mr: 2, opacity: 0.6, fontSize: '1.1rem' }} />
                        <ListItemText
                          primary={cafe.name}
                          secondary={cafe.locations?.[0]?.neighborhood || ''}
                        />
                      </ListItemButton>
                    ))}
                </List>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default MobileBottomNav;
