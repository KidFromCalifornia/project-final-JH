import { useState, useEffect } from 'react';
import { Map, Marker, Popup } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { LIGHT_MAP_STYLE, DARK_MAP_STYLE } from '../../styles/mapStyles';
import { Box, Typography, Collapse } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

const formatFeature = (f) => f.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export default function MapLibreMap({
  cafesToShow,
  showUserPin,
  userLocation,
  themeMode,
  selectedCafe,
  setSelectedCafe,
  getCustomIcon,
  isAdmin,
  onEditCafe,
  onSuggestCafe,
  suppressPopup = false,
}) {
  const theme = useTheme();
  const [featuresOpen, setFeaturesOpen] = useState(false);

  useEffect(() => {
    setFeaturesOpen(false);
  }, [selectedCafe?._id]);

  return (
    <Map
      key={themeMode}
      mapLib={maplibregl}
      initialViewState={{ longitude: 18.0686, latitude: 59.3293, zoom: 12 }}
      style={{ width: '100vw', height: '100vh' }}
      mapStyle={themeMode === 'dark' ? DARK_MAP_STYLE : LIGHT_MAP_STYLE}
    >
      {(suppressPopup && selectedCafe ? cafesToShow.filter((c) => c._id === selectedCafe._id) : cafesToShow).flatMap(
        (cafe) =>
          cafe.locations
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
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        outline: 'none',
                      }}
                    >
                      {getCustomIcon(cafe.category, theme, themeMode)}
                    </button>
                  </Marker>
                );
              }
              return null;
            })
            .filter(Boolean) || []
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

      {!suppressPopup && selectedCafe &&
        (() => {
          const locationIndex = selectedCafe.selectedLocationIndex || 0;
          const selectedLocation = selectedCafe.locations?.[locationIndex];
          const coords = selectedLocation?.coordinates?.coordinates;

          const mutedColor = themeMode === 'dark' ? '#9ec4eb' : '#5d6e7e';

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
                {/* Eyebrow — category */}
                {selectedCafe.category && (
                  <Typography
                    variant="overline"
                    sx={{
                      display: 'block',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: mutedColor,
                      lineHeight: 1.4,
                    }}
                  >
                    {selectedCafe.category}
                  </Typography>
                )}

                {/* Headline — cafe name */}
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ fontWeight: 700, lineHeight: 1.2, mb: 1 }}
                >
                  {selectedCafe.name}
                </Typography>

                {/* Address + neighbourhood */}
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.25 }}>
                  {selectedLocation.address}
                </Typography>
                {selectedLocation.neighborhood && (
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', color: mutedColor, mb: 1.5 }}
                  >
                    {selectedLocation.neighborhood}
                  </Typography>
                )}

                {/* Cafe Features — collapsible */}
                {(() => {
                  const features = selectedLocation.features?.length ? selectedLocation.features : selectedCafe.features;
                  return features && features.length > 0 && (
                    <Box sx={{ mb: 1.5 }}>
                      <Typography
                        component="button"
                        onClick={() => setFeaturesOpen((o) => !o)}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: 0.5,
                          background: 'none', border: 'none', cursor: 'pointer', p: 0, mb: 0.5,
                          fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase',
                          letterSpacing: '0.06em', color: mutedColor, '&:hover': { color: 'inherit' },
                        }}
                      >
                        Cafe Features {featuresOpen ? '▲' : '▼'}
                      </Typography>
                      <Collapse in={featuresOpen}>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', pt: 0.5 }}>
                          {features.map((feature, idx) => (
                            <Typography
                              key={idx}
                              variant="caption"
                              sx={{
                                backgroundColor: alpha(theme.palette.primary.main, 0.15),
                                color: 'inherit', px: 0.75, py: 0.25, borderRadius: 0.5, fontSize: '0.68rem',
                              }}
                            >
                              {formatFeature(feature)}
                            </Typography>
                          ))}
                        </Box>
                      </Collapse>
                    </Box>
                  );
                })()}

                {/* Divider */}
                <Box sx={{ borderTop: '1px solid', borderColor: 'divider', my: 1 }} />

                {/* Action — website */}
                {selectedCafe.website && (
                  <a
                    href={selectedCafe.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '6px 12px',
                      marginBottom: selectedCafe.locations?.length > 1 ? 8 : 0,
                      borderRadius: 6,
                      border: `1px solid ${mutedColor}`,
                      color: 'inherit',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      textDecoration: 'none',
                      letterSpacing: '0.03em',
                      transition: 'background 0.15s, border-color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        themeMode === 'dark' ? 'rgba(158,196,235,0.12)' : 'rgba(93,110,126,0.10)';
                      e.currentTarget.style.borderColor = 'inherit';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = mutedColor;
                    }}
                  >
                    Visit Website
                  </a>
                )}

                {/* Suggest button */}
                <button
                  onClick={() => onSuggestCafe?.(selectedCafe)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'center',
                    padding: '4px 0', marginBottom: 4, background: 'none',
                    border: 'none', color: mutedColor, fontWeight: 500,
                    fontSize: '0.75rem', cursor: 'pointer', letterSpacing: '0.03em',
                    textDecoration: 'underline',
                  }}
                >
                  Make a suggestion
                </button>

                {/* Admin edit button */}
                {isAdmin && (
                  <button
                    onClick={() => onEditCafe(selectedCafe)}
                    style={{
                      display: 'block', width: '100%', textAlign: 'center',
                      padding: '6px 12px', marginBottom: 8, borderRadius: 6,
                      border: `1px solid ${mutedColor}`, background: 'none',
                      color: mutedColor, fontWeight: 600, fontSize: '0.8rem',
                      cursor: 'pointer', letterSpacing: '0.03em',
                    }}
                  >
                    Edit Cafe
                  </button>
                )}

                {/* Footer — location navigator */}
                {selectedCafe.locations && selectedCafe.locations.length > 1 && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mt: 0.5,
                    }}
                  >
                    <Typography
                      component="button"
                      onClick={() =>
                        setSelectedCafe((prev) => ({
                          ...prev,
                          selectedLocationIndex:
                            (locationIndex - 1 + prev.locations.length) % prev.locations.length,
                        }))
                      }
                      sx={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        p: 0,
                        fontSize: '1.1rem',
                        lineHeight: 1,
                        color: mutedColor,
                        '&:hover': { color: 'inherit' },
                      }}
                      aria-label="Previous location"
                    >
                      ‹
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        textDecoration: 'underline',
                        color: mutedColor,
                      }}
                    >
                      Location {locationIndex + 1} of {selectedCafe.locations.length}
                    </Typography>
                    <Typography
                      component="button"
                      onClick={() =>
                        setSelectedCafe((prev) => ({
                          ...prev,
                          selectedLocationIndex: (locationIndex + 1) % prev.locations.length,
                        }))
                      }
                      sx={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        p: 0,
                        fontSize: '1.1rem',
                        lineHeight: 1,
                        color: mutedColor,
                        '&:hover': { color: 'inherit' },
                      }}
                      aria-label="Next location"
                    >
                      ›
                    </Typography>
                  </Box>
                )}
              </Popup>
            );
          }
          return null;
        })()}
    </Map>
  );
}
