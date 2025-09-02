import React, { useEffect, useState, Suspense } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  MyLocation as MyLocationIcon,
  Clear as ClearIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import MapLegend from '../components/map/MapLegend';
import ReusableFab from '../components/common/ReusableFab';
import { useCafeStore } from '../stores/useCafeStore';
import { getCustomIcon } from '../components/map/MapIcons';
import { cafeAPI } from '../services/api';

const MapLibreMap = React.lazy(() => import('../components/map/MapLibreMap'));

const MapPage = () => {
  const theme = useTheme();
  const cafes = useCafeStore((state) => state.cafes);
  const setCafes = useCafeStore((state) => state.setCafes);
  const searchResults = useCafeStore((state) => state.searchResults);
  const filteredCafes = useCafeStore((state) => state.filteredCafes);
  const userLocation = useCafeStore((state) => state.user?.location);
  const themeMode = useCafeStore((state) => state.themeMode);
  const [showUserPin, setShowUserPin] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const setUser = useCafeStore((state) => state.setUser);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Listen for mobile drawer state changes
  useEffect(() => {
    const handleDrawerStateChange = (event) => {
      setMobileDrawerOpen(event.detail.isOpen);
    };

    window.addEventListener('drawerStateChange', handleDrawerStateChange);
    return () => {
      window.removeEventListener('drawerStateChange', handleDrawerStateChange);
    };
  }, []);

  const handleGeotag = () => {
    if (showUserPin) {
      setShowUserPin(false);
      setUser({ location: null });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUser({ location: { lat: latitude, lng: longitude } });
          setShowUserPin(true);
        },
        () => alert('Could not get your location')
      );
    } else {
      alert('Geolocation not supported');
    }
  };

  useEffect(() => {
    if (cafes.length === 0) {
      const fetchCafes = async () => {
        try {
          const data = await cafeAPI.getAll();
          setCafes(data.data || []);
        } catch (error) {
          console.error('Error fetching cafes:', error);
        }
      };

      fetchCafes();
    }
  }, [cafes, setCafes]);

  // Check if any filters are active
  const cafeTypeFilter = useCafeStore((state) => state.cafeTypeFilter);
  const neighborhoodFilter = useCafeStore((state) => state.neighborhoodFilter);
  const hasActiveFilters = cafeTypeFilter || neighborhoodFilter;

  const cafesToShow =
    searchResults.length > 0 ? searchResults : hasActiveFilters ? filteredCafes : cafes;

  // Store filters for clear FAB condition
  const clearFilters = useCafeStore((state) => state.clearFilters);

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
      }}
    >
      <Typography hidden variant="h1">
        Stockholm's Coffee Club Map
      </Typography>

      {/* FABs using reusable component */}
      <Box
        sx={{
          position: 'fixed',
          zIndex: mobileDrawerOpen ? 1300 : 1301, // Higher z-index when mobile drawer is open
          bottom: {
            xs: mobileDrawerOpen ? 'auto' : '2.75rem',
            sm: 'auto',
          },
          top: {
            xs: mobileDrawerOpen ? '1rem' : 'auto',
            sm: '4.5rem',
          },
          right: { xs: 'auto', sm: '1.875rem' },
          left: { xs: '50%', sm: 'auto' },
          transform: { xs: 'translateX(-50%)', sm: 'none' },
          display: 'flex',
          flexDirection: { xs: 'row', sm: 'column' },
          gap: 2,
          alignItems: 'center',
          transition: 'all 0.3s ease-in-out', // Smooth transition when drawer opens/closes
        }}
      >
        <ReusableFab
          icon={<MyLocationIcon fontSize="large" />}
          tooltipTitle=" Display My Location"
          onClick={handleGeotag}
          ariaLabel="geotag"
        />

        <ReusableFab
          icon={<ClearIcon fontSize="large" />}
          tooltipTitle="Clear Filters"
          onClick={clearFilters}
          ariaLabel="Clear all filters"
          showCondition={hasActiveFilters}
        />

        <ReusableFab
          icon={<MapIcon fontSize="large" />}
          tooltipTitle="Display Map Legend"
          onClick={() => setLegendOpen(true)}
          ariaLabel="map legend"
        />
      </Box>

      <MapLegend open={legendOpen} onClose={() => setLegendOpen(false)} />
      <Suspense fallback={<div>Loading map...</div>}>
        <MapLibreMap
          cafesToShow={cafesToShow}
          showUserPin={showUserPin}
          userLocation={userLocation}
          theme={theme}
          themeMode={themeMode}
          selectedCafe={selectedCafe}
          setSelectedCafe={setSelectedCafe}
          getCustomIcon={getCustomIcon}
        />
      </Suspense>
    </Box>
  );
};

export default MapPage;
