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
  AdminPanelSettings as AdminPanelSettingsIcon,
  DoorFront as DoorFrontIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const NavigationItems = ({
  isLoggedIn,
  isAdmin,
  navIconColor,
  open,
  setShowLogin,
  setShowAddCafe,
  setIsLoggedIn,
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
        <ListItem disablePadding sx={{ display: 'block' }}>
          <Tooltip title="Map" arrow placement="right" disableHoverListener={open}>
            <ListItemButton component={Link} to="/">
              <ListItemIcon>
                <MapIcon sx={{ color: navIconColor }} />
              </ListItemIcon>
              <ListItemText primary="Map" />
            </ListItemButton>
          </Tooltip>
        </ListItem>

        <ListItem disablePadding sx={{ display: 'block' }}>
          <Tooltip title="Tastings" arrow placement="right" disableHoverListener={open}>
            <ListItemButton component={Link} to="/tastings">
              <ListItemIcon>
                <RateReviewIcon sx={{ color: navIconColor }} />
              </ListItemIcon>
              <ListItemText primary="Tastings" />
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {isLoggedIn && (
          <ListItem disablePadding sx={{ display: 'block' }}>
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

        {isLoggedIn && isAdmin && (
          <ListItem disablePadding sx={{ display: 'block' }}>
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
          <ListItem disablePadding sx={{ display: 'block' }}>
            <Tooltip title="Profile" arrow placement="right" disableHoverListener={open}>
              <ListItemButton component={Link} to="/user">
                <ListItemIcon>
                  <DoorFrontIcon sx={{ color: navIconColor }} />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        )}
      </List>
      <Divider />
      <List>
        {!isLoggedIn && (
          <ListItem disablePadding sx={{ display: 'block' }}>
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
          <ListItem disablePadding sx={{ display: 'block' }}>
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
    </Box>
  );
};

export default NavigationItems;
