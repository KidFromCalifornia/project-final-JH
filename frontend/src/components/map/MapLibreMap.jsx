import { Map, Marker, Popup } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { LIGHT_MAP_STYLE, DARK_MAP_STYLE } from '../../styles/mapStyles';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

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
      style={{
        width: '100vw',
        height: '100vh',
      }}
      mapStyle={themeMode === 'dark' ? DARK_MAP_STYLE : LIGHT_MAP_STYLE}
    >
      {/* Café markers */}
      {cafesToShow.flatMap((cafe) => {
        // Create markers for ALL locations of each cafe
        return (
          cafe.locations
            ?.map((location, locationIndex) => {
              const coords = location.coordinates?.coordinates;
              if (Array.isArray(coords) && coords.length === 2 && coords.every(Number.isFinite)) {
                return (
                  <Marker
                    key={`${cafe._id}-${locationIndex}`}
                    longitude={coords[0]}
                    latitude={coords[1]}
                    onClick={() =>
                      setSelectedCafe({ ...cafe, selectedLocationIndex: locationIndex })
                    }
                    sx={{ boxShadow: 3 }}
                  >
                    {getCustomIcon(cafe.category, theme, themeMode)}
                  </Marker>
                );
              }
              return null;
            })
            .filter(Boolean) || []
        );
      })}

      {/* User location marker */}
      {showUserPin &&
        userLocation &&
        Number.isFinite(userLocation.lng) &&
        Number.isFinite(userLocation.lat) && (
          <Marker longitude={userLocation.lng} latitude={userLocation.lat}>
            {getCustomIcon('geotag', theme, themeMode)}
          </Marker>
        )}

      {/* Popup for selected cafe */}
      {selectedCafe &&
        (() => {
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
                <Box
                  sx={{
                    minWidth: 200,
                    maxWidth: 300,
                    backgroundColor: theme.palette.light.main,
                    borderRadius: 2,
                    p: 2,
                    boxShadow: 3,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      mb: 1,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {selectedCafe.name}
                  </Typography>

                  {/* Category */}
                  {selectedCafe.category && (
                    <Typography
                      variant="caption"
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        textTransform: 'capitalize',
                        display: 'inline-block',
                        mb: 1,
                      }}
                    >
                      {selectedCafe.category}
                    </Typography>
                  )}

                  {/* Location Note for multiple locations */}
                  {selectedCafe.hasMultipleLocations && selectedLocation.locationNote && (
                    <Typography variant="body2" color="primary" fontWeight="500" sx={{ mb: 1 }}>
                      {selectedLocation.locationNote}
                    </Typography>
                  )}

                  {/* Address */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {selectedLocation.address}
                  </Typography>

                  {/* Neighborhood */}
                  {selectedLocation.neighborhood && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {selectedLocation.neighborhood}
                    </Typography>
                  )}

                  {/* Opening Times */}
                  {selectedLocation.openingTimes && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {selectedLocation.openingTimes}
                    </Typography>
                  )}

                  {/* Website Link */}
                  {selectedCafe.website && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <a
                        href={selectedCafe.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: theme.palette.primary.main,
                          textDecoration: 'none',
                          fontWeight: 500,
                        }}
                      >
                        Visit Website
                      </a>
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
