import React, { useEffect, useState, Suspense } from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CafeEditForm from '../components/admin/CafeEditForm';
import {
  MyLocation as MyLocationIcon,
  Clear as ClearIcon,
  Map as MapIcon,
  Signpost as SignpostIcon,
  FormatListBulleted as ListIcon,
} from '@mui/icons-material';
import MapLegend from '../components/map/MapLegend';
import CafeListDialog from '../components/map/CafeListDialog';
import CafeBottomSheet from '../components/map/CafeBottomSheet';
import SuggestionForm from '../components/forms/SuggestionForm';
import ReusableFab from '../components/common/ReusableFab';
import LoadingLogo from '../components/common/LoadingLogo';
import { useCafeStore } from '../stores/useCafeStore';
import { getCustomIcon } from '../components/map/MapIcons';
import { cafeAPI } from '../services/api';

const MapLibreMap = React.lazy(() => import('../components/map/MapLibreMap'));

const MapPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const cafes = useCafeStore((state) => state.cafes);
  const setCafes = useCafeStore((state) => state.setCafes);
  const searchResults = useCafeStore((state) => state.searchResults);
  const filteredCafes = useCafeStore((state) => state.filteredCafes);
  const userLocation = useCafeStore((state) => state.user?.location);
  const setUser = useCafeStore((state) => state.setUser);
  const themeMode = useCafeStore((state) => state.themeMode);
  const [showUserPin, setShowUserPin] = useState(false);
  const [loadingSlow, setLoadingSlow] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const [cafeListOpen, setCafeListOpen] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [editingCafe, setEditingCafe] = useState(null);
  const [editData, setEditData] = useState({});
  const [suggestionPrefill, setSuggestionPrefill] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const isAdmin = localStorage.getItem('admin') === 'true';
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
        const slowTimer = setTimeout(() => setLoadingSlow(true), 5000);
        try {
          const data = await cafeAPI.getAll();
          setCafes(data.data || []);
        } catch (error) {
          console.error('Error fetching cafes:', error);
        } finally {
          clearTimeout(slowTimer);
          setLoadingSlow(false);
        }
      };
      fetchCafes();
    }
  }, [cafes, setCafes]);

  // Check if any filters are active
  const cafeTypeFilter = useCafeStore((state) => state.cafeTypeFilter);
  const neighborhoodFilter = useCafeStore((state) => state.neighborhoodFilter);
  const featureFilter = useCafeStore((state) => state.featureFilter);
  const setCafeTypeFilter = useCafeStore((state) => state.setCafeTypeFilter);
  const setNeighborhoodFilter = useCafeStore((state) => state.setNeighborhoodFilter);
  const hasActiveFilters = cafeTypeFilter || neighborhoodFilter || featureFilter;

  // Compute filter options from cafes data
  const categories = Array.from(new Set(cafes.map((cafe) => cafe.category).filter(Boolean)));
  const neighborhoods = Array.from(
    new Set(cafes.map((cafe) => cafe.locations?.[0]?.neighborhood).filter(Boolean))
  );

  const cafesToShow =
    searchResults.length > 0 ? searchResults : hasActiveFilters ? filteredCafes : cafes;

  const clearFilters = useCafeStore((state) => state.clearFilters);

  const handleEditCafe = (cafe) => {
    setEditingCafe(cafe);
    setEditData({ ...cafe });
  };

  const handleSuggestCafe = (cafe) => {
    setSuggestionPrefill(`Regarding ${cafe.name}: `);
    setShowSuggestion(true);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`${API_URL}/cafes/${editingCafe._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        const saved = await res.json();
        setCafes(cafes.map((c) => (c._id === editingCafe._id ? saved.data : c)));
        setSelectedCafe(null);
        setEditingCafe(null);
      }
    } catch (err) {
      console.error('Failed to save cafe:', err);
    }
  };

  return (
    <>
      {/* Screen reader only heading - for accessibility */}
      <Typography
        variant="h1"
        component="h1"
        sx={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        Stockholm&apos;s Coffee Club Map
      </Typography>

      {/* Cold start overlay */}
      {loadingSlow && (
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 1500, bgcolor: 'background.default' }}>
          <LoadingLogo message="Waking up the server, hang tight…" />
        </Box>
      )}

      {/* Map container */}
      <Box
        sx={{
          marginTop: { xs: 0, sm: '-64px' }, // Negative top margin on desktop
          marginLeft: { xs: 0, sm: '-72px' }, // Negative left margin on desktop
          marginBottom: { xs: '-56px', sm: 0 },
        }}
      >
        <Box
          sx={{
            position: 'fixed',
            zIndex: mobileDrawerOpen ? 1300 : 1301,
            bottom: {
              xs: mobileDrawerOpen ? 'auto' : 'calc(3.5rem + env(safe-area-inset-bottom) + 0.75rem)',
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
            icon={<SignpostIcon fontSize="large" />}
            tooltipTitle="Display Map Legend"
            onClick={() => setLegendOpen(true)}
            ariaLabel="map legend"
          />

          <ReusableFab
            icon={<ListIcon fontSize="large" />}
            tooltipTitle="Browse All Cafes"
            onClick={() => setCafeListOpen(true)}
            ariaLabel="Browse cafe list"
          />
        </Box>

        <MapLegend open={legendOpen} onClose={() => setLegendOpen(false)} />

        <CafeListDialog
          open={cafeListOpen}
          onClose={() => setCafeListOpen(false)}
          cafes={cafes}
          onSelectCafe={(cafe) => {
            setSelectedCafe({ ...cafe, selectedLocationIndex: 0 });
          }}
        />

        <Suspense fallback={<LoadingLogo />}>
          <MapLibreMap
            cafesToShow={cafesToShow}
            showUserPin={showUserPin}
            userLocation={userLocation}
            theme={theme}
            themeMode={themeMode}
            selectedCafe={selectedCafe}
            setSelectedCafe={setSelectedCafe}
            getCustomIcon={getCustomIcon}
            isAdmin={isAdmin}
            onEditCafe={handleEditCafe}
            onSuggestCafe={handleSuggestCafe}
            suppressPopup={isMobile}
          />
        </Suspense>

        {isMobile && (
          <CafeBottomSheet
            selectedCafe={selectedCafe}
            setSelectedCafe={setSelectedCafe}
            themeMode={themeMode}
            isAdmin={isAdmin}
            onEditCafe={handleEditCafe}
            onSuggestCafe={handleSuggestCafe}
          />
        )}
      </Box>

      <Dialog open={showSuggestion} onClose={() => setShowSuggestion(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 0 }}>
          <SuggestionForm
            prefill={suggestionPrefill}
            onClose={() => setShowSuggestion(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingCafe} onClose={() => setEditingCafe(null)} maxWidth="md" fullWidth>
        <DialogTitle>Edit {editingCafe?.name}</DialogTitle>
        <DialogContent>
          <CafeEditForm editData={editData} setEditData={setEditData} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingCafe(null)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MapPage;
