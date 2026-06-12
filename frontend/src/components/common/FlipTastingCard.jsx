import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  useMediaQuery,
  useTheme,
  Stack,
  Tooltip,
  Rating,
} from '@mui/material';
import { useCafeStore } from '../../stores/useCafeStore';
import {
  StyledCard,
  BoxMain,
  StyledDivContent,
  StyledDivTag,
  TypographyTitle,
  RowAuthor,
  Shadow,
  TastingNotesContainer,
} from '../../styles/FlipTastingCard.styles';

const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const FlipTastingCard = ({ tasting }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasBeenFlipped, setHasBeenFlipped] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const cafes = useCafeStore((state) => state.cafes);

  const cafe = useMemo(() => {
    if (tasting && tasting.cafeId && typeof tasting.cafeId === 'object' && tasting.cafeId.name) {
      return tasting.cafeId;
    }
    return cafes.find((c) => c._id === tasting?.cafeId) || {};
  }, [cafes, tasting?.cafeId]);

  // Reset notes when card flips back
  useEffect(() => {
    if (!isFlipped) setShowNotes(false);
  }, [isFlipped]);

  // Mobile touch handling
  useEffect(() => {
    if (!isMobile || !tasting?._id) return;
    const cardElement = document.getElementById(`tasting-card-${tasting._id}`);
    if (!cardElement) return;

    const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
    const handleTouchEnd = (e) => {
      if (!touchStart) return;
      const diff = touchStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        setIsFlipped(diff > 0);
        if (!hasBeenFlipped) setHasBeenFlipped(true);
      }
    };

    cardElement.addEventListener('touchstart', handleTouchStart);
    cardElement.addEventListener('touchend', handleTouchEnd);
    return () => {
      cardElement.removeEventListener('touchstart', handleTouchStart);
      cardElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, tasting?._id, touchStart, hasBeenFlipped]);

  const frontContent = useMemo(() => {
    if (!tasting) return null;
    return (
      <StyledCard>
        <BoxMain minHeight={280} position="relative">
          <StyledDivContent className="tasting-cd">
            <TypographyTitle role="title" variant="h3">
              {toTitleCase(tasting.coffeeName)}
            </TypographyTitle>
            {Array.isArray(tasting.tastingNotes) && tasting.tastingNotes.length > 0 && (
              <TastingNotesContainer>
                {tasting.tastingNotes.slice(0, 4).map((note, index) => (
                  <Chip
                    key={index}
                    label={toTitleCase(note)}
                    id={`tasting-note-${tasting._id}-${index}`}
                    role="presentation"
                    size="small"
                    sx={{
                      fontWeight: theme.typography.fontWeightMedium,
                      fontSize: theme.typography.caption.fontSize,
                      bgcolor: 'transparent',
                      color: theme.palette.card.main,
                      border: 'none',
                      borderRadius: 0,
                      backdropFilter: 'blur(8px)',
                      padding: '0 !important',
                      margin: '0 !important',
                      minHeight: 'unset',
                      height: 'unset',
                      '& .MuiChip-label': { padding: '0 !important', margin: '0 !important', lineHeight: 1 },
                      '&.MuiChip-root': { padding: '0 !important', margin: '0 !important' },
                    }}
                  />
                ))}
              </TastingNotesContainer>
            )}
          </StyledDivContent>
        </BoxMain>
        <RowAuthor>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', flex: 1, minWidth: 0 }}>
            <Typography fontFamily="font.main" textTransform="uppercase" sx={{ mb: 0, color: theme.palette.text.primary, fontWeight: 500 }}>
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
    );
  }, [tasting, theme]);

  const handleClick = () => {
    setIsFlipped((v) => !v);
    if (!hasBeenFlipped) setHasBeenFlipped(true);
  };

  const handleNotesToggle = (e) => {
    e.stopPropagation();
    setShowNotes((v) => !v);
  };

  const hasCafeInDb = tasting?.cafeId && typeof tasting.cafeId === 'object' && tasting.cafeId.name;
  const locationDisplay = hasCafeInDb ? toTitleCase(cafe.name) : tasting?.location || null;
  const neighbourhood = hasCafeInDb ? cafe.locations?.[0]?.neighborhood : null;

  if (!tasting || !tasting._id) return null;

  // Mobile full-screen notes overlay
  if (isMobile && isFlipped && showNotes) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1400,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.card.main,
          overflowY: 'auto',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography
          variant="caption"
          onClick={() => setShowNotes(false)}
          sx={{ cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px', alignSelf: 'flex-start' }}
        >
          ← Back to card
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {toTitleCase(tasting.coffeeName)} — Notes & Recipe
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
          {tasting.notes}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Backdrop when flipped */}
      {isFlipped && (
        <Box
          onClick={handleClick}
          sx={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 1200,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        />
      )}

      <Tooltip title={isFlipped ? '' : 'Click to flip'} arrow>
        <Box
          id={`tasting-card-${tasting._id}`}
          onClick={isFlipped ? (e) => e.stopPropagation() : handleClick}
          role="button"
          tabIndex={0}
          aria-label={`Coffee tasting: ${toTitleCase(tasting?.coffeeName || 'Unknown')}. Click to flip.`}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
          sx={isFlipped ? {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '80vw', md: '50vw' },
            maxHeight: '80vh',
            overflowY: 'auto',
            zIndex: 1300,
            cursor: 'pointer',
            borderRadius: 2,
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          } : {
            width: '100%',
            height: 345,
            cursor: 'pointer',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {isFlipped ? (
            <StyledCard
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                background:
                  theme.palette.mode === 'dark'
                    ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.background.paper} 100%)`
                    : `linear-gradient(135deg, ${theme.palette.secondary.main} 20%, ${theme.palette.primary.main} 100%)`,
                color: theme.palette.card.main,
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Origin + Region */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" component="h2" sx={{ fontWeight: theme.typography.fontWeightBold }}>
                    {toTitleCase(tasting.coffeeOrigin) || '—'}
                  </Typography>
                  {tasting.coffeeOriginRegion && (
                    <Typography variant="body2" color="text.secondary">
                      {toTitleCase(tasting.coffeeOriginRegion)}
                    </Typography>
                  )}
                </Box>

                {/* Brew Method + Roaster */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1.5 }}>
                  {tasting.brewMethod && (
                    <Box>
                      <Typography textTransform="uppercase" variant="body2" sx={{ fontWeight: 'bold' }}>Brew Method:</Typography>
                      <Typography variant="body2" sx={{ pl: 1 }}>{toTitleCase(tasting.brewMethod)}</Typography>
                    </Box>
                  )}
                  {tasting.coffeeRoaster && (
                    <Box>
                      <Typography textTransform="uppercase" variant="body1" sx={{ fontWeight: 'bold' }}>Roaster:</Typography>
                      <Typography variant="body2" sx={{ pl: 1 }}>{toTitleCase(tasting.coffeeRoaster)}</Typography>
                    </Box>
                  )}

                  {/* Tasting profile */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                    {tasting.roastLevel && (
                      <Box>
                        <Typography textTransform="uppercase" variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>Roast:</Typography>
                        <Typography variant="body2">{toTitleCase(tasting.roastLevel)}</Typography>
                      </Box>
                    )}
                    {tasting.acidity && (
                      <Box>
                        <Typography textTransform="uppercase" variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>Acidity:</Typography>
                        <Typography variant="body2">{toTitleCase(tasting.acidity)}</Typography>
                      </Box>
                    )}
                    {tasting.mouthFeel && (
                      <Box>
                        <Typography textTransform="uppercase" variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>Body:</Typography>
                        <Typography variant="body2">{toTitleCase(tasting.mouthFeel)}</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Notes toggle */}
                {tasting.notes && (
                  <Box>
                    <Typography
                      variant="caption"
                      onClick={handleNotesToggle}
                      sx={{
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        textUnderlineOffset: '3px',
                        userSelect: 'none',
                        '&:hover': { color: 'text.primary' },
                      }}
                    >
                      {showNotes ? 'Hide notes' : 'Show tasting notes & recipe'}
                    </Typography>
                    {showNotes && (
                      <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
                        {tasting.notes}
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Footer */}
                {locationDisplay && (
                  <Box sx={{ mt: 'auto', pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>{locationDisplay}</strong>
                      {neighbourhood && ` • ${toTitleCase(neighbourhood)}`}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </StyledCard>
          ) : (
            <Box sx={{ height: '100%' }}>{frontContent}</Box>
          )}
        </Box>
      </Tooltip>
    </>
  );
};

export default React.memo(FlipTastingCard);
