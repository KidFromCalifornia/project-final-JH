import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Switch,
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import sccLogoMono from '../../../assets/images/whiteCup_logo.svg';

const NavigationHeader = ({ 
  theme,
  open,
  darkMode,
  isLoggedIn,
  navIconColor,
  handleToggleDarkMode 
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        flexGrow: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, paddingLeft: 8 }}>
        <Link
          to="/"
          aria-label="map"
          style={{ display: "inline-flex", lineHeight: 0 }}
        >
          <img
            src={sccLogoMono}
            alt="SCC Logo"
            style={{ height: "1.75rem", width: "auto", display: "block" }}
          />
        </Link>
        
        <Typography
          variant="subtitle1"
          component="div"
          noWrap
          sx={{
            color: theme.palette.light.main,
            lineHeight: 1,
            fontFamily: theme.typography.subtitle1.fontFamily,
            fontSize: {
              xs: '1.5rem',
              sm: '1.75rem', 
              md: '2rem',
            },
            fontWeight: theme.typography.subtitle1.fontWeight,
            textTransform: "uppercase",
          }}
        >
          Stockholms Coffee Club
        </Typography>
      </Box>

      {/* Right side controls */}
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        marginLeft: 'auto',
        gap: 1 
      }}>
        <Tooltip title="Theme" arrow>
          <IconButton 
            onClick={handleToggleDarkMode}
            sx={{ p: 1 }}
          >
            {darkMode ? (
              <DarkModeIcon sx={{ color: navIconColor }} />
            ) : (
              <LightModeIcon sx={{ color: theme.palette.accent.main }} />
            )}
          </IconButton>
        </Tooltip>
        
        <Switch
          color="light"
          checked={darkMode}
          onChange={handleToggleDarkMode}
          inputProps={{ "aria-label": "toggle dark mode" }}
        />

        {isLoggedIn && (
          <Tooltip title="Profile" arrow>
            <IconButton
              component={Link}
              to="/user"
              sx={{ p: 1 }}
              aria-label="User Page"
            >
              <AccountCircleIcon
                sx={{
                  color: theme.palette.accent.main,
                }}
              />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default NavigationHeader;
