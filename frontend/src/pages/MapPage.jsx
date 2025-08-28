import React, { useEffect, useState, Suspense } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import GeotagFab from "../components/map/GeotagFab";
import MapLegend from "../components/map/MapLegend";
import { useCafeStore } from "../stores/useCafeStore";
import { getCustomIcon } from "../components/map/MapIcons";

const MapLibreMap = React.lazy(() => import("../components/map/MapLibreMap"));

const MapPage = () => {
  const theme = useTheme();
  const cafes = useCafeStore((state) => state.cafes);
  const setCafes = useCafeStore((state) => state.setCafes);
  const searchResults = useCafeStore((state) => state.searchResults);
  const filteredCafes = useCafeStore((state) => state.filteredCafes);
  const userLocation = useCafeStore((state) => state.user?.location);
  const themeMode = useCafeStore((state) => state.themeMode);
  const [showUserPin, setShowUserPin] = useState(false);
  const setUser = useCafeStore((state) => state.setUser);
  const [selectedCafe, setSelectedCafe] = useState(null);

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
        () => alert("Could not get your location")
      );
    } else {
      alert("Geolocation not supported");
    }
  };

  useEffect(() => {
    if (cafes.length === 0) {
      fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001/api"}/cafes`
      )
        .then((res) => res.json())
        .then((data) => setCafes(data.data || []));
    }
  }, [cafes, setCafes]);

  // Check if any filters are active
  const cafeTypeFilter = useCafeStore((state) => state.cafeTypeFilter);
  const neighborhoodFilter = useCafeStore((state) => state.neighborhoodFilter);
  const hasActiveFilters = cafeTypeFilter || neighborhoodFilter;

  
  const cafesToShow = searchResults.length > 0 ? searchResults : 
                     hasActiveFilters ? filteredCafes : cafes;

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        position: "relative",
      }}
    >
      <Typography hidden variant="h1">
        Stockholm's Coffee Club Map
      </Typography>

      <GeotagFab
        onClick={handleGeotag}
        icon={<MyLocationIcon fontSize="large" />}
        ariaLabel="geotag"
        sx={{
          position: "fixed",
          zIndex: 1301,
          width: 56,
          height: 56,
          boxShadow: 3,
          bottom: { xs: 40, sm: "auto" }, // Overlap with AppBar (56px - 16px = 40px overlap)
          left: { xs: "50%", sm: "auto" },
          transform: { xs: "translateX(-50%)", sm: "none" },
          top: { xs: "auto", sm: 75 },
          right: { xs: "auto", sm: 30 },
        }}
      />

      <MapLegend />

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
