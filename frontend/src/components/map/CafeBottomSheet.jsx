import { useState, useEffect } from 'react';
import {
  Drawer, Box, Typography, Collapse, IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

const formatFeature = (f) => f.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export default function CafeBottomSheet({
  selectedCafe,
  setSelectedCafe,
  themeMode,
  isAdmin,
  onEditCafe,
}) {
  const theme = useTheme();
  const [featuresOpen, setFeaturesOpen] = useState(false);

  useEffect(() => {
    setFeaturesOpen(false);
  }, [selectedCafe?._id]);

  const open = !!selectedCafe;
  const locationIndex = selectedCafe?.selectedLocationIndex || 0;
  const selectedLocation = selectedCafe?.locations?.[locationIndex];
  const mutedColor = themeMode === 'dark' ? '#9ec4eb' : '#5d6e7e';

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={() => setSelectedCafe(null)}
      disablePortal={false}
      sx={{
        zIndex: 1400,
        '& .MuiDrawer-paper': {
          borderRadius: '16px 16px 0 0',
          px: 2.5,
          pt: 2,
          pb: 4,
          maxHeight: '70vh',
          overflowY: 'auto',
          backgroundColor: themeMode === 'dark' ? '#0a1f33' : '#fff',
          color: themeMode === 'dark' ? '#ebf2fa' : 'inherit',
        },
      }}
    >
      {selectedCafe && selectedLocation && (
        <Box>
          {/* Drag handle */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
            <Box sx={{ width: 40, height: 4, borderRadius: 2, backgroundColor: mutedColor, opacity: 0.4 }} />
          </Box>

          {/* Close button */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              {selectedCafe.category && (
                <Typography
                  variant="overline"
                  sx={{ display: 'block', fontWeight: 700, letterSpacing: '0.08em', color: mutedColor, lineHeight: 1.4 }}
                >
                  {selectedCafe.category}
                </Typography>
              )}
              <Typography variant="h6" component="h3" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.5 }}>
                {selectedCafe.name}
              </Typography>
            </Box>
            <IconButton
              onClick={() => setSelectedCafe(null)}
              size="small"
              sx={{ color: mutedColor, ml: 1, mt: -0.5 }}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Address + neighbourhood */}
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.25 }}>
            {selectedLocation.address}
          </Typography>
          {selectedLocation.neighborhood && (
            <Typography variant="caption" sx={{ display: 'block', color: mutedColor, mb: 1.5 }}>
              {selectedLocation.neighborhood}
            </Typography>
          )}

          {/* Features — collapsible */}
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

          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', my: 1.5 }} />

          {/* Website */}
          {selectedCafe.website && (
            <a
              href={selectedCafe.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block', textAlign: 'center', padding: '10px 16px',
                marginBottom: 8, borderRadius: 8, border: `1px solid ${mutedColor}`,
                color: 'inherit', fontWeight: 600, fontSize: '0.9rem',
                textDecoration: 'none', letterSpacing: '0.03em',
              }}
            >
              Visit Website
            </a>
          )}

          {/* Admin edit */}
          {isAdmin && (
            <button
              onClick={() => onEditCafe(selectedCafe)}
              style={{
                display: 'block', width: '100%', textAlign: 'center',
                padding: '10px 16px', marginBottom: 8, borderRadius: 8,
                border: `1px solid ${mutedColor}`, background: 'none',
                color: mutedColor, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
              }}
            >
              Edit Cafe
            </button>
          )}

          {/* Location navigator */}
          {selectedCafe.locations && selectedCafe.locations.length > 1 && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
              <Typography
                component="button"
                onClick={() =>
                  setSelectedCafe((prev) => ({
                    ...prev,
                    selectedLocationIndex: (locationIndex - 1 + prev.locations.length) % prev.locations.length,
                  }))
                }
                sx={{ background: 'none', border: 'none', cursor: 'pointer', p: 0, fontSize: '1.4rem', color: mutedColor, '&:hover': { color: 'inherit' } }}
                aria-label="Previous location"
              >
                ‹
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: mutedColor }}>
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
                sx={{ background: 'none', border: 'none', cursor: 'pointer', p: 0, fontSize: '1.4rem', color: mutedColor, '&:hover': { color: 'inherit' } }}
                aria-label="Next location"
              >
                ›
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Drawer>
  );
}
