import React from 'react';
import { Link } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  Box,
} from '@mui/material';
import {
  Map as MapIcon,
  RateReview as RateReviewIcon,
  AddLocation as AddLocationIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import NavigationFilters from './NavigationFilters.jsx';

const NavigationItems = ({
  isLoggedIn,
  navIconColor,
  open,
  setShowLogin,
  setShowAddCafe,
  setIsLoggedIn,
  categories,
  neighborhoods,
  cafeTypeQuery,
  neighborhoodQuery,
  setCafeTypeQuery,
  setNeighborhoodQuery,
  clearFilters,
}) => {
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('username');
    localStorage.removeItem('admin');
    setIsLoggedIn(false);
    setShowLogin(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <List>
        {!isLoggedIn && (
          <ListItem sx={{ display: 'block', padding: 0 }}>
            <Tooltip title="Login" arrow placement="right" disableHoverListener={open}>
              <ListItemButton onClick={() => setShowLogin(true)}>
                <ListItemIcon>
                  <LoginIcon sx={{ color: navIconColor }} />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        )}

        {isLoggedIn && (
          <ListItem sx={{ display: 'block', padding: 0 }}>
            <Tooltip title="Logout" arrow placement="right" disableHoverListener={open}>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon sx={{ color: navIconColor }} />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        )}
      </List>
      <List>
        <ListItem sx={{ display: 'block', padding: 0 }}>
          <Tooltip title="Map" arrow placement="right" disableHoverListener={open}>
            <ListItemButton component={Link} to="/">
              <ListItemIcon>
                <MapIcon sx={{ color: navIconColor }} />
              </ListItemIcon>
              <ListItemText primary="Map" />
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {isLoggedIn && (
          <ListItem sx={{ display: 'block', padding: 0 }}>
            <Tooltip title="Add Cafe" arrow placement="right" disableHoverListener={open}>
              <ListItemButton onClick={() => setShowAddCafe(true)}>
                <ListItemIcon>
                  <AddLocationIcon sx={{ color: navIconColor }} />
                </ListItemIcon>
                <ListItemText primary="Add Cafe" />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        )}
        <ListItem sx={{ display: 'block', padding: 0 }}>
          <Tooltip title="Tastings" arrow placement="right" disableHoverListener={open}>
            <ListItemButton component={Link} to="/tastings">
              <ListItemIcon>
                <RateReviewIcon sx={{ color: navIconColor }} />
              </ListItemIcon>
              <ListItemText primary="Tastings" />
            </ListItemButton>
          </Tooltip>
        </ListItem>

        <NavigationFilters
          categories={categories}
          neighborhoods={neighborhoods}
          cafeTypeQuery={cafeTypeQuery}
          neighborhoodQuery={neighborhoodQuery}
          setCafeTypeQuery={setCafeTypeQuery}
          setNeighborhoodQuery={setNeighborhoodQuery}
          clearFilters={clearFilters}
          navIconColor={navIconColor}
          open={open}
        />
      </List>
      <Divider />
    </Box>
  );
};

export default NavigationItems;
