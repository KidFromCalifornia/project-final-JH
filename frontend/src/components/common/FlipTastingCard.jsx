import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
  IconButton,
  Dialog,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import useFavourites from '../../hooks/useFavourites';
import { useCafeStore } from '../../stores/useCafeStore';
import {
  StyledCard,
  BoxMain,
  StyledDivContent,
  TypographyTitle,
  RowAuthor,
  Shadow,
  TastingNotesContainer,
} from '../../styles/FlipTastingCard.styles';

const toTitleCase = (str) => {
  if (!str) return '';
  return str.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

const FlipTastingCard = ({ tasting, isFlipped = false, onFlip, anyFlipped = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showNotes, setShowNotes] = useState(false);
  const cafes = useCafeStore((state) => state.cafes);
  // const { isSaved, toggle } = useFavourites();

  const cafe = useMemo(() => {
    if (tasting?.cafeId && typeof tasting.cafeId === 'object' && tasting.cafeId.name) {
      return tasting.cafeId;
    }
    return cafes.find((c) => c._id === tasting?.cafeId) || {};
  }, [cafes, tasting?.cafeId]);

  if (!tasting?._id) return null;

  const hasCafeInDb = tasting.cafeId && typeof tasting.cafeId === 'object' && tasting.cafeId.name;
  const locationDisplay = hasCafeInDb ? toTitleCase(cafe.name) : tasting.location || 'Other';
  const neighbourhood = hasCafeInDb ? cafe.locations?.[0]?.neighborhood : null;

  const handleFlip = () => {
    setShowNotes(false);
    onFlip?.(tasting._id);
  };

  // Reset notes when card is unflipped
  React.useEffect(() => {
    if (!isFlipped) setShowNotes(false);
  }, [isFlipped]);

  if (!isFlipped) {
    return (
      <Box
        sx={{
          width: '100%',
          height: 345,
          cursor: 'pointer',
          opacity: anyFlipped ? 0.25 : 1,
          transition: 'opacity 0.3s ease',
          pointerEvents: anyFlipped ? 'none' : 'auto',
        }}
        onClick={handleFlip}
      >
        <StyledCard>
          <BoxMain minHeight={280} position="relative">
            <StyledDivContent className="tasting-cd">
              <TypographyTitle role="title" variant="h3">
                {toTitleCase(tasting.coffeeName)}
              </TypographyTitle>
              {Array.isArray(tasting.tastingNotes) && tasting.tastingNotes.length > 0 && (
                <TastingNotesContainer>
                  {tasting.tastingNotes.slice(0, 4).map((note, i) => (
                    <Chip
                      key={i}
                      label={toTitleCase(note)}
                      size="small"
                      sx={{
                        fontWeight: theme.typography.fontWeightMedium,
                        fontSize: theme.typography.caption.fontSize,
                        bgcolor: 'transparent',
                        color: theme.palette.card.main,
                        border: 'none',
                        borderRadius: 0,
                        padding: '0 !important',
                        margin: '0 !important',
                        minHeight: 'unset',
                        height: 'unset',
                        '& .MuiChip-label': { padding: '0 !important', lineHeight: 1 },
                      }}
                    />
                  ))}
                </TastingNotesContainer>
              )}
            </StyledDivContent>
          </BoxMain>
          <RowAuthor>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flex: 1 }}>
              <Typography textTransform="uppercase" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                {tasting.username || 'Anonymous'}
              </Typography>
              <Typography sx={{ color: theme.palette.text.secondary }}>
                {new Date(tasting.createdAt || tasting.date).toLocaleDateString()}
              </Typography>
            </Box>
          </RowAuthor>
          <Shadow className="Shadow1" />
          <Shadow className="Shadow2" />
        </StyledCard>
      </Box>
    );
  }

  // Back side — Dialog for reliable centering
  return (
    <>
      {/* Placeholder keeps grid cell height */}
      <Box sx={{ width: '100%', height: 345, opacity: 0 }} />

      <Dialog
        open={isFlipped}
        onClose={handleFlip}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            width: isMobile ? '92vw' : undefined,
            maxHeight: isMobile ? '90vh' : '80vh',
            overflowY: 'auto',
            borderRadius: `${theme.shape.borderRadius * 3}px`,
            background:
              theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.background.paper} 100%)`
                : `linear-gradient(135deg, ${theme.palette.secondary.main} 20%, ${theme.palette.primary.main} 100%)`,
            color: theme.palette.card.main,
          },
        }}
        slotProps={{
          backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' } },
        }}
      >
      {/* Close / flip back button */}
      <IconButton
        size="small"
        onClick={handleFlip}
        sx={{ position: 'absolute', top: 8, right: 8, color: 'inherit', opacity: 0.7, '&:hover': { opacity: 1 } }}
        aria-label="Flip card back"
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {/* Save roaster — commented out until more stable solution
      {tasting.coffeeRoaster && (
        <Tooltip title={isSaved('roaster', tasting.coffeeRoaster) ? 'Unsave roaster' : 'Save roaster'}>
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); toggle('roaster', tasting.coffeeRoaster, tasting.coffeeRoaster); }}
            sx={{ position: 'absolute', top: 8, left: 8, color: isSaved('roaster', tasting.coffeeRoaster) ? '#e57373' : 'rgba(255,255,255,0.5)', '&:hover': { color: '#e57373' } }}
          >
            {isSaved('roaster', tasting.coffeeRoaster) ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      )} */}

      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* Origin + Region */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.4rem' }}>
            {toTitleCase(tasting.coffeeOrigin) || '—'}
          </Typography>
          {tasting.coffeeOriginRegion && (
            <Typography sx={{ color: theme.palette.accent.main, fontSize: '0.9rem' }}>
              {toTitleCase(tasting.coffeeOriginRegion)}
            </Typography>
          )}
        </Box>

        {/* Brew Method + Roaster */}
        {tasting.brewMethod && (
          <Box>
            <Typography textTransform="uppercase" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>Brew Method:</Typography>
            <Typography sx={{ pl: 1, fontSize: '0.9rem' }}>{toTitleCase(tasting.brewMethod)}</Typography>
          </Box>
        )}
        {tasting.coffeeRoaster && (
          <Box>
            <Typography textTransform="uppercase" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>Roaster:</Typography>
            <Typography sx={{ pl: 1, fontSize: '0.9rem' }}>{toTitleCase(tasting.coffeeRoaster)}</Typography>
          </Box>
        )}

        {/* Tasting profile */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
          {tasting.roastLevel && (
            <Box>
              <Typography textTransform="uppercase" sx={{ fontWeight: 'bold', display: 'block', fontSize: '0.65rem' }}>Roast:</Typography>
              <Typography sx={{ fontSize: '0.9rem' }}>{toTitleCase(tasting.roastLevel)}</Typography>
            </Box>
          )}
          {tasting.acidity && (
            <Box>
              <Typography textTransform="uppercase" sx={{ fontWeight: 'bold', display: 'block', fontSize: '0.65rem' }}>Acidity:</Typography>
              <Typography sx={{ fontSize: '0.9rem' }}>{toTitleCase(tasting.acidity)}</Typography>
            </Box>
          )}
          {tasting.mouthFeel && (
            <Box>
              <Typography textTransform="uppercase" sx={{ fontWeight: 'bold', display: 'block', fontSize: '0.65rem' }}>Body:</Typography>
              <Typography sx={{ fontSize: '0.9rem' }}>{toTitleCase(tasting.mouthFeel)}</Typography>
            </Box>
          )}
        </Box>

        {/* Notes toggle */}
        {tasting.notes && (
          <Box>
            <Typography
              variant="caption"
              onClick={() => setShowNotes((v) => !v)}
              sx={{ cursor: 'pointer', color: theme.palette.accent.main, textDecoration: 'underline', textUnderlineOffset: '3px', userSelect: 'none', '&:hover': { opacity: 0.8 } }}
            >
              {showNotes ? 'Hide notes' : 'Show tasting notes & recipe'}
            </Typography>
            {showNotes && (
              <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap', color: 'text.secondary', fontWeight: 700 }}>
                {tasting.notes}
              </Typography>
            )}
          </Box>
        )}

        {/* Footer */}
        {locationDisplay && (
          <Box sx={{ pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="caption" sx={{ color: '#fff' }}>
              <strong>{locationDisplay}</strong>
              {neighbourhood && ` • ${toTitleCase(neighbourhood)}`}
            </Typography>
          </Box>
        )}

      </CardContent>
      </Dialog>
    </>
  );
};

export default React.memo(FlipTastingCard);
