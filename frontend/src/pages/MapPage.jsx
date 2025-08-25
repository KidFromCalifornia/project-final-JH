import { useState } from "react";
import { Box, Typography } from "@mui/material";

import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { getCustomIcon } from "../components/CustomCafeIcon";
import { useCafeStore } from "../useCafeStore";
import UserPinSvg from "../assets/User_Pin.svg";
import { useTheme } from "@mui/material/styles";

const MapPage = () => {
  const theme = useTheme();
  // Zustand store
  const cafes = useCafeStore((state) => state.cafes);
  const setCafes = useCafeStore((state) => state.setCafes);
  const searchResults = useCafeStore((state) => state.searchResults);
  const userLocation = useCafeStore((state) => state.user?.location);
  // Local state
  const [selectedCafe, setSelectedCafe] = useState(null);
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

  return (
    <Box sx={{ width: "100%", height: "100vh" }}>
      <Typography variant="h4" sx={{ p: 2, fontWeight: "bold" }}>
        Stockholm's Coffee Club Map
      </Typography>
      <Map
        mapLib={maplibregl}
        initialViewState={{
          longitude: userLocation?.lng || 18.0686,
          latitude: userLocation?.lat || 59.3293,
          zoom: 12,
        }}
        style={{ width: "100%", height: "calc(100vh - 56px)" }}
        mapStyle="https://api.maptiler.com/maps/0198dc89-072a-795c-919e-84fefe62bc97/style.json?key=a82bxq3OIw2AzmMU9SKn"
      >
        {/* Café Markers */}
        {cafesToShow.map((cafe) => (
          <Marker
            key={cafe._id}
            longitude={cafe.location?.coordinates?.[0]}
            latitude={cafe.location?.coordinates?.[1]}
            onClick={() => setSelectedCafe(cafe)}
          >
            <img
              src={getCustomIcon(cafe.category, theme)}
              alt={cafe.category || "Cafe"}
              style={{ width: 32, height: 32, cursor: "pointer" }}
            />
          </Marker>
        ))}

        {/* GTFS Stops (optional toggle) */}
        {showTransport &&
          gtfsStops.map((stop) => (
            <Marker
              key={stop.stop_id}
              longitude={stop.stop_lon}
              latitude={stop.stop_lat}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ fontSize: 20 }}>
                  🚌
                </Typography>
              </Box>
            </Marker>
          ))}

        {/* User location */}
        {userLocation && (
          <Marker longitude={userLocation.lng} latitude={userLocation.lat}>
            <img
              src={UserPinSvg}
              alt="User Location"
              style={{ width: 32, height: 32, cursor: "pointer" }}
            />
          </Marker>
        )}

        {/* Popup for cafés */}
        {selectedCafe && (
          <Popup
            longitude={selectedCafe.location?.coordinates?.[0]}
            latitude={selectedCafe.location?.coordinates?.[1]}
            onClose={() => setSelectedCafe(null)}
            closeOnClick={false}
          >
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {selectedCafe.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedCafe.address}
              </Typography>
            </Box>
          </Popup>
        )}
      </Map>
    </Box>
  );
};

export default MapPage;
