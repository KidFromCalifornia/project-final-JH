import { useEffect, useState } from "react";
// MUI
import { Box, Typography, SvgIcon } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// Map
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { Map, Marker, Popup } from "@vis.gl/react-maplibre";
// Components & assets
import { getCustomIcon } from "../components/customMapIcon";
import { useCafeStore } from "../useCafeStore";
import { MAP_STYLE_LIGHT, MAP_STYLE_DARK } from "../mapStyles";
import GeotagPinIcon from "../assets/geotagPinIcon.svg";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import GeotagFab from "../components/GeotagFab";
npm;
const MapPage = () => {
  const theme = useTheme();
  const cafes = useCafeStore((state) => state.cafes);
  const setCafes = useCafeStore((state) => state.setCafes);
  const searchResults = useCafeStore((state) => state.searchResults);
  const userLocation = useCafeStore((state) => state.user?.location);
  const themeMode = useCafeStore((state) => state.themeMode);
  const [showUserPin, setShowUserPin] = useState(false);
  const setUser = useCafeStore((state) => state.setUser);
  const [selectedCafe, setSelectedCafe] = useState(null);

  // Handle geotag button
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

  // Fetch cafes if not loaded
  useEffect(() => {
    if (cafes.length === 0) {
      fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001/api"}/cafes`
      )
        .then((res) => res.json())
        .then((data) => setCafes(data.data || []));
    }
  }, [cafes, setCafes]);

  const cafesToShow = searchResults.length > 0 ? searchResults : cafes;

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
          bottom: { xs: 80, sm: "auto" },
          left: { xs: "50%", sm: "auto" },
          transform: { xs: "translateX(-50%)", sm: "none" },
          top: { xs: "auto", sm: 75 },
          right: { xs: "auto", sm: 30 },
        }}
      />

      <Map
        mapLib={maplibregl}
        initialViewState={{ longitude: 18.0686, latitude: 59.3293, zoom: 12 }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle={themeMode === "dark" ? MAP_STYLE_DARK : MAP_STYLE_LIGHT}
      >
        {/* Café markers */}
        {cafesToShow.map((cafe) => {
          const coords = cafe.locations?.[0]?.coordinates?.coordinates;
          if (
            Array.isArray(coords) &&
            coords.length === 2 &&
            coords.every(Number.isFinite)
          ) {
            return (
              <Marker
                key={cafe._id}
                longitude={coords[0]}
                latitude={coords[1]}
                onClick={() => setSelectedCafe(cafe)}
              >
                {getCustomIcon(cafe.category, theme, themeMode)}
              </Marker>
            );
          }
          return null;
        })}

        {/* User location marker */}
        {showUserPin &&
          userLocation &&
          Number.isFinite(userLocation.lng) &&
          Number.isFinite(userLocation.lat) && (
            <Marker longitude={userLocation.lng} latitude={userLocation.lat}>
              <SvgIcon
                component={GeotagPinIcon}
                sx={{
                  width: 32,
                  height: 32,
                  color: theme.palette.success.main,
                }}
                inheritViewBox
              />
            </Marker>
          )}

        {/* Popup for selected cafe */}
        {selectedCafe &&
          Array.isArray(
            selectedCafe.locations?.[0]?.coordinates?.coordinates
          ) && (
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
