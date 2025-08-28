import { Map, Marker, Popup } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { MAP_STYLE_LIGHT, MAP_STYLE_DARK } from "../mapStyles";
import { Box, Typography, SvgIcon } from "@mui/material";

export default function MapLibreMap({
  cafesToShow,
  showUserPin,
  userLocation,
  theme,
  themeMode,
  selectedCafe,
  setSelectedCafe,
  getCustomIcon,
  GeotagPinIcon,
}) {
  return (
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
              sx={{ boxShadow: 3 }}
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
  );
}
