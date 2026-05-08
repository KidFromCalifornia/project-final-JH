import { Map, Marker, Popup } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { LIGHT_MAP_STYLE, DARK_MAP_STYLE } from '../../styles/mapStyles';
import { Box, Typography } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

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
      key={themeMode}
      mapLib={maplibregl}
      initialViewState={{ longitude: 18.0686, latitude: 59.3293, zoom: 12 }}
      style={{ width: '100vw', height: '100vh' }}
      mapStyle={themeMode === 'dark' ? DARK_MAP_STYLE : LIGHT_MAP_STYLE}
    >
      {cafesToShow.flatMap((cafe) =>
        (cafe.locations
          ?.map((location, locationIndex) => {
            const coords = location.coordinates?.coordinates;
            if (Array.isArray(coords) && coords.length === 2 && coords.every(Number.isFinite)) {
              return (
                <Marker
                  key={`${cafe._id}-${locationIndex}`}
                  longitude={coords[0]}
                  latitude={coords[1]}
                >
                  <button
                    className="marker_icon"
                    aria-label={`${cafe.name} – Coffee shop at ${location.address || 'this location'}`}
                    onClick={() =>
                      setSelectedCafe({ ...cafe, selectedLocationIndex: locationIndex })
                    }
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, outline: 'none' }}
                  >
                    {getCustomIcon(cafe.category, theme, themeMode)}
                  </button>
                </Marker>
              );
            }
            return null;
          })
          .filter(Boolean)) || []
      )}

      {showUserPin &&
        userLocation &&
        Number.isFinite(userLocation.lng) &&
        Number.isFinite(userLocation.lat) && (
          <Marker longitude={userLocation.lng} latitude={userLocation.lat}>
            <div role="img" aria-label="Your current location" style={{ pointerEvents: 'none' }}>
              {getCustomIcon('geotag', theme, themeMode)}
            </div>
          </Marker>
        )}

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
                className={`map-popup ${themeMode}`}
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: theme.shape.borderRadius,
                  padding: theme.spacing(2),
                }}
              >
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ mb: 1, fontWeight: 600 }}
                >
                  {selectedCafe.name}
                </Typography>

                {selectedCafe.category && (
                  <Typography
                    variant="caption"
                    sx={{
                      backgroundColor: alpha(theme.palette.secondary.main, 0.6),
                      color: theme.palette.primary.contrastText,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 0.5,
                      textTransform: 'capitalize',
                      display: 'inline-block',
                      mb: 1,
                      fontWeight: 600,
                    }}
                  >
                    {selectedCafe.category}
                  </Typography>
                )}

                <Typography
                  variant="body2"
                  sx={{ mb: 0.5, fontWeight: 500 }}
                >
                  {selectedLocation.address}
                </Typography>

                {selectedLocation.neighborhood && (
                  <Typography
                    variant="body2"
                    sx={{ mb: 1.5, fontWeight: 500 }}
                  >
                    {selectedLocation.neighborhood}
                  </Typography>
                )}

                {selectedCafe.website && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <a
                      href={selectedCafe.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'inherit',
                        fontWeight: 500,
                        textDecoration: 'underline',
                      }}
                    >
                      Visit Website
                    </a>
                  </Typography>
                )}
              </Popup>
            );
          }
          return null;
        })()}
    </Map>
  );
}
