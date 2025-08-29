import { Map, Marker, Popup } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { MAP_STYLE_LIGHT, MAP_STYLE_DARK } from "../../styles/mapStyles";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";


export default function MapLibreMap({
  cafesToShow,
  showUserPin,
  userLocation,
  themeMode,
  selectedCafe,
  setSelectedCafe,
  getCustomIcon,
}) {
  const theme = useTheme();
  return (
    <Map
      mapLib={maplibregl}
      initialViewState={{ longitude: 18.0686, latitude: 59.3293, zoom: 12 }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle={themeMode === "dark" ? MAP_STYLE_DARK : MAP_STYLE_LIGHT}
    >
      {/* Café markers */}
      {cafesToShow.flatMap((cafe) => {
        // Create markers for ALL locations of each cafe
        return cafe.locations?.map((location, locationIndex) => {
          const coords = location.coordinates?.coordinates;
          if (
            Array.isArray(coords) &&
            coords.length === 2 &&
            coords.every(Number.isFinite)
          ) {
            return (
              <Marker
                key={`${cafe._id}-${locationIndex}`}
                longitude={coords[0]}
                latitude={coords[1]}
                onClick={() => setSelectedCafe({ ...cafe, selectedLocationIndex: locationIndex })}
                sx={{ boxShadow: 3 }}
              >
                {getCustomIcon(cafe.category, theme, themeMode)}
              </Marker>
            );
          }
          return null;
        }).filter(Boolean) || [];
      })}

      {/* User location marker */}
      {showUserPin &&
        userLocation &&
        Number.isFinite(userLocation.lng) &&
        Number.isFinite(userLocation.lat) && (
          <Marker longitude={userLocation.lng} latitude={userLocation.lat}>
            {getCustomIcon("geotag", theme, themeMode)}
          </Marker>
        )}

      {/* Popup for selected cafe */}
      {selectedCafe && (() => {
        const locationIndex = selectedCafe.selectedLocationIndex || 0;
        const selectedLocation = selectedCafe.locations?.[locationIndex];
        const coords = selectedLocation?.coordinates?.coordinates;
        
        if (Array.isArray(coords) && coords.length === 2) {
          return (
            <Popup
              longitude={coords[0]}
              latitude={coords[1]}
              onClose={() => setSelectedCafe(null)}
              closeOnClick={false}

            >
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {selectedCafe.name}
                </Typography>
                {selectedCafe.hasMultipleLocations && selectedLocation.locationNote && (
                  <Typography variant="body2" color="primary" fontWeight="500">
                    {selectedLocation.locationNote}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  {selectedLocation.address}
                </Typography>
                {selectedLocation.neighborhood && (
                  <Typography variant="body2" color="text.secondary">
                    {selectedLocation.neighborhood}
                  </Typography>
                )}
              </Box>
            </Popup>
          );
        }
        return null;
      })()}
    </Map>
  );
}
