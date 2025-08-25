import { useEffect, useState } from "react";
//Import MUI
import { Box, Typography, IconButton, Paper } from "@mui/material";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useTheme } from "@mui/material/styles";
//import map
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { Map, Marker, Popup } from "@vis.gl/react-maplibre";

// import assets & components
import { getCustomIcon } from "../components/CustomCafeIcon";
import { useCafeStore } from "../useCafeStore";
import { MAP_STYLE_LIGHT, MAP_STYLE_DARK } from "../mapStyles";
import UserPinSvg from "../assets/User_Pin.svg";
import MyLocationIcon from "@mui/icons-material/MyLocation";

const MapPage = () => {
  const theme = useTheme();
  // Zustand store
  const cafes = useCafeStore((state) => state.cafes);
  const setCafes = useCafeStore((state) => state.setCafes);
  const searchResults = useCafeStore((state) => state.searchResults);
  const userLocation = useCafeStore((state) => state.user?.location);
  const themeMode = useCafeStore((state) => state.themeMode);
  const [showUserPin, setShowUserPin] = useState(false);
  const setUser = useCafeStore((state) => state.setUser);

  // Geotag: set user location and center map
  const handleGeotag = () => {
    if (showUserPin) {
      setShowUserPin(false);
      setUser({ location: null });
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setUser({ location: { lat: latitude, lng: longitude } });
            setShowUserPin(true);
          },
          (err) => {
            alert("Could not get your location");
          }
        );
      } else {
        alert("Geolocation not supported");
      }
    }
  };
  // Local state
  const [selectedCafe, setSelectedCafe] = useState(null);

  // Fetch cafes if not loaded
  useEffect(() => {
    if (cafes.length === 0) {
      fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001/api"}/cafes`
      )
        .then((res) => res.json())
        .then((data) => {
          setCafes(data.data || []);
        });
    }
  }, [cafes, setCafes]);

  const cafesToShow = searchResults.length > 0 ? searchResults : cafes;
  // Debug: log cafe coordinates
  cafesToShow.forEach((cafe) => {
    const loc = cafe.locations?.[0];
  });

  return (
    <Box
      sx={{
        width: { xs: "100vw", sm: "100%" },
        height: { xs: "100vh", sm: "100vh" },
        position: "relative",
        left: { xs: 0, sm: "auto" },
        top: { xs: 0, sm: "auto" },
      }}
    >
      <Typography hidden variant="h1">
        Stockholm's Coffee Club Map
      </Typography>
      {/* Geotag button only visible on desktop */}
      <Box
        sx={{
          position: "fixed",
          zIndex: 1301,
          right: 24,
          bottom: 24,
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
        }}
      >
        <Paper elevation={3}>
          <IconButton onClick={handleGeotag} size="large">
            <MyLocationIcon />
          </IconButton>
        </Paper>
      </Box>
      <Map
        mapLib={maplibregl}
        initialViewState={{
          longitude: 18.0686,
          latitude: 59.3293,
          zoom: 12,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle={themeMode === "dark" ? MAP_STYLE_DARK : MAP_STYLE_LIGHT}
      >
        {/* Café Markers with coordinate checks */}
        {cafesToShow.map((cafe) => {
          const coords = cafe.locations?.[0]?.coordinates?.coordinates;
          if (
            Array.isArray(coords) &&
            coords.length === 2 &&
            typeof coords[0] === "number" &&
            typeof coords[1] === "number" &&
            !isNaN(coords[0]) &&
            !isNaN(coords[1])
          ) {
            return (
              <Marker
                key={cafe._id}
                longitude={coords[0]}
                latitude={coords[1]}
                onClick={() => setSelectedCafe(cafe)}
              >
                <img
                  src={getCustomIcon(cafe.category, theme)}
                  alt={cafe.category || "Cafe"}
                  style={{ width: 32, height: 32, cursor: "pointer" }}
                />
              </Marker>
            );
          }
          return null;
        })}

        {showUserPin &&
          userLocation &&
          typeof userLocation.lng === "number" &&
          typeof userLocation.lat === "number" &&
          !isNaN(userLocation.lng) &&
          !isNaN(userLocation.lat) && (
            <Marker longitude={userLocation.lng} latitude={userLocation.lat}>
              <img
                src={UserPinSvg}
                alt="User Location"
                style={{ width: 32, height: 32, cursor: "pointer" }}
              />
            </Marker>
          )}

        {/* Popup for cafés with coordinate check */}
        {selectedCafe &&
          Array.isArray(
            selectedCafe.locations?.[0]?.coordinates?.coordinates
          ) &&
          selectedCafe.locations[0].coordinates.coordinates.length === 2 &&
          typeof selectedCafe.locations[0].coordinates.coordinates[0] ===
            "number" &&
          typeof selectedCafe.locations[0].coordinates.coordinates[1] ===
            "number" &&
          !isNaN(selectedCafe.locations[0].coordinates.coordinates[0]) &&
          !isNaN(selectedCafe.locations[0].coordinates.coordinates[1]) && (
            <Popup
              longitude={selectedCafe.locations[0].coordinates.coordinates[0]}
              latitude={selectedCafe.locations[0].coordinates.coordinates[1]}
              onClose={() => setSelectedCafe(null)}
              closeOnClick={false}
            >
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {selectedCafe.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedCafe.locations[0].address}
                </Typography>
              </Box>
            </Popup>
          )}
      </Map>
    </Box>
  );
};

export default MapPage;
