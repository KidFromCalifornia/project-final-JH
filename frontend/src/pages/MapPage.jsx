import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, Popup, useMap } from "react-leaflet";
import { useCafeStore } from "../useCafeStore";
import userPinSvg from "../assets/User_Pin.svg";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { getCustomIcon, getGeotagIcon } from "../components/CustomCafeIcon";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import { useTheme } from "@mui/material/styles";
import "leaflet/dist/leaflet.css";
import { Global } from "@emotion/react";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import { TileLayer } from "react-leaflet";

const MapPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const theme = useTheme();
  const [showTransport, setShowTransport] = useState(false);

  const [gtfsStops, setGtfsStops] = useState([]);
  // GTFS stops caching logic
  useEffect(() => {
    const GTFS_KEY = "gtfs_stops";
    const GTFS_TIMESTAMP_KEY = "gtfs_stops_timestamp";
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const cached = localStorage.getItem(GTFS_KEY);
    const cachedTime = localStorage.getItem(GTFS_TIMESTAMP_KEY);
    if (cached && cachedTime && now - cachedTime < ONE_WEEK_MS) {
      setGtfsStops(JSON.parse(cached));
    } else {
      fetch(
        `https://api.trafiklab.se/v2/gtfs/stops?key=${
          import.meta.env.VITE_GTFS_API_KEY
        }`
      )
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const stops = data.stops || data;
          setGtfsStops(stops);
          localStorage.setItem(GTFS_KEY, JSON.stringify(stops));
          localStorage.setItem(GTFS_TIMESTAMP_KEY, now);
        })
        .catch((err) => {
          console.error("GTFS fetch error:", err);
        });
    }
  }, []);

  function MapTilerVectorTiles() {
    const map = useMap();
    useEffect(() => {
      const mtLayer = new MaptilerLayer({
        apiKey: "a82bxq3OIw2AzmMU9SKn",
        style:
          "https://api.maptiler.com/maps/0198dc89-072a-795c-919e-84fefe62bc97/style.json?key=a82bxq3OIw2AzmMU9SKn",
      });
      mtLayer.addTo(map);
      return () => {
        map.removeLayer(mtLayer);
      };
    }, [map]);
    return null;
  }

  // Store
  const cafes = useCafeStore((state) => state.cafes);
  const setCafes = useCafeStore((state) => state.setCafes);
  const searchResults = useCafeStore((state) => state.searchResults);
  const loading = cafes.length === 0;

  // Fetch cafes
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

  // Helper: Render cafe markers
  const renderCafeMarkers = () =>
    cafesToShow.map((cafe) => {
      const coords = cafe.locations?.[0]?.coordinates?.coordinates;
      if (
        coords &&
        coords.length === 2 &&
        typeof coords[0] === "number" &&
        typeof coords[1] === "number" &&
        coords[0] !== 0 &&
        coords[1] !== 0
      ) {
        const hood = cafe.locations?.[0]?.neighborhood || "Unavailable";
        return (
          <Marker
            key={cafe._id}
            position={[coords[1], coords[0]]}
            icon={getCustomIcon(cafe.category, theme)}
          >
            <Popup minWidth={300} maxWidth={400}>
              <Typography variant="h6" fontWeight="bold">
                {cafe.name}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {hood}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {cafe.locations?.[0]?.address}
              </Typography>
              <Typography variant="body2">
                <b>Neighborhood:</b> {hood}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {cafe.description}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <a
                  href={cafe.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                  }}
                >
                  {cafe.website}
                </a>
              </Typography>
            </Popup>
          </Marker>
        );
      }
      return null;
    });

  // Helper: Render GTFS stop markers
  const renderGtfsStopMarkers = () =>
    gtfsStops.map((stop) => {
      // GTFS stops usually have stop_lat and stop_lon
      const lat = stop.stop_lat || stop.Latitude;
      const lon = stop.stop_lon || stop.Longitude;
      if (lat && lon) {
        return (
          <Marker
            key={stop.stop_id || stop.StopPointNumber}
            position={[lat, lon]}
            // You can use a custom icon for stops if desired
          >
            <Popup>
              <Typography variant="subtitle2" fontWeight="bold">
                {stop.stop_name || stop.StopPointName}
              </Typography>
            </Popup>
          </Marker>
        );
      }
      return null;
    });

  // Floating buttons component
  const handleFindLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  };
  const FloatingMapButtons = ({ onFindLocation }) => (
    <Box
      sx={{
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 1000,
        display: "flex",
        gap: 2,
      }}
    >
      <Button
        variant="contained"
        onClick={() => setShowTransport((prev) => !prev)}
        sx={{
          backgroundColor: "#002147", // Oxford blue
          color: "#fff",
          minWidth: 0,
          width: 48,
          height: 48,
          borderRadius: "50%",
          boxShadow: 3,
          "&:hover": { backgroundColor: "#00112b" },
        }}
      >
        <DirectionsBusIcon />
      </Button>
      <Button
        variant="outlined"
        onClick={onFindLocation}
        sx={{
          backgroundColor: "#fff",
          color: "#002147",
          minWidth: 0,
          width: 48,
          height: 48,
          borderRadius: "50%",
          boxShadow: 3,
          border: "2px solid #002147",
          ml: 1,
          "&:hover": { backgroundColor: "#e6e6e6" },
        }}
      >
        📍
      </Button>
    </Box>
  );

  // Loading state
  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Loading map...
        </Typography>
        <Typography variant="body2">
          Please wait while we fetch the latest data.
        </Typography>
      </Box>
    );
  }

  // Main render
  return (
    <>
      {/* Global style override to imprve assaiblity  */}
      <Global
        styles={{
          ".leaflet-popup-close-button": {
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            top: "8px",
            right: "8px",
            fontSize: "1.5rem",
            lineHeight: "24px",
            margin: "0.5rem",
          },
          ".leaflet-popup-close-button span": {
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            lineHeight: "24px",
            color: "#002147",
          },
        }}
      />

      <Typography hidden variant="h1">
        Stockholm's Coffee Club
      </Typography>
      <Box>
        {/* Map with floating buttons overlays */}
        <Box
          sx={{
            position: "relative",
            height: "calc(100dvh - 64px)",
            width: "calc(100% - 64px)",
            mb: 0,
            pt: 0,
            mt: "64px", // Move map down by AppBar height
            ml: { xs: 0, md: "64px" },
          }}
        >
          <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
            <FloatingMapButtons onFindLocation={handleFindLocation} />
            <MapContainer
              center={
                userLocation
                  ? [userLocation.lat, userLocation.lng]
                  : [59.3293, 18.0686]
              }
              zoom={12}
              style={{ height: "100%", width: "100%" }}
            >
              <MapTilerVectorTiles />
              {renderCafeMarkers()}
              {showTransport && renderGtfsStopMarkers()}
              {/* User geotag marker */}
              {userLocation && (
                <Marker
                  position={[userLocation.lat, userLocation.lng]}
                  icon={getGeotagIcon(theme, userPinSvg)}
                >
                  <Popup>
                    <Typography variant="subtitle1" fontWeight="bold">
                      You are here
                    </Typography>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MapPage;
