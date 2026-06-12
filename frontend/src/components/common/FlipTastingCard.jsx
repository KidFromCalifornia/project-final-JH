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


const NotesToggle = ({ notes, theme }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Box>
      <Button
        size="small"
        variant="contained"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        sx={{
          mb: open ? 1 : 0,
          backgroundColor: 'rgba(255,255,255,0.15)',
          color: '#ebf2fa',
          '&:hover': { backgroundColor: '#7a8ca3', color: '#0a1f33' },
          '&:active': { boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.35)' },
        }}
      >
        {open ? 'Hide Notes' : 'Tasting Notes & Recipe'}
      </Button>
      {open && (
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
          {notes}
        </Typography>
      )}
    </Box>
  );
};

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
  const [touchStart, setTouchStart] = useState(null);
  const cafes = useCafeStore((state) => state.cafes);

  const cafe = useMemo(() => {
    if (tasting && tasting.cafeId && typeof tasting.cafeId === 'object' && tasting.cafeId.name) {
      return tasting.cafeId;
    }

    return cafes.find((c) => c._id === tasting?.cafeId) || {};
  }, [cafes, tasting?.cafeId]);

  // Mobile touch handling for better user experience
  useEffect(() => {
    if (!isMobile || !tasting?._id) return;

    const cardElement = document.getElementById(`tasting-card-${tasting._id}`);
    if (!cardElement) return;

    const handleTouchStart = (e) => {
      setTouchStart(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
      if (!touchStart) return;

      const touchEnd = e.changedTouches[0].clientX;
      const diff = touchStart - touchEnd;

      // Swipe left to flip card, swipe right to flip back
      if (Math.abs(diff) > 50) {
        // 50px threshold for swipe
        setIsFlipped(diff > 0);
        if (!hasBeenFlipped) {
          setHasBeenFlipped(true);
        }
      }
    };

    cardElement.addEventListener('touchstart', handleTouchStart);
    cardElement.addEventListener('touchend', handleTouchEnd);

    return () => {
      cardElement.removeEventListener('touchstart', handleTouchStart);
      cardElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, tasting?._id, touchStart, hasBeenFlipped]);

  // Memoize card content to avoid unnecessary re-renders
  const frontContent = useMemo(() => {
    if (!tasting) return null;
    return (
      <StyledCard>
        <BoxMain minHeight={280} position="relative">
          <StyledDivContent className="tasting-cd">
            <TypographyTitle role="title" variant="h3">
              {toTitleCase(tasting.coffeeName)}
            </TypographyTitle>
            {/* Tasting Notes in the gradient overlay */}
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

                      '& .MuiChip-label': {
                        padding: '0 !important',
                        margin: '0 !important',
                        lineHeight: 1,
                      },

                      '&.MuiChip-root': {
                        padding: '0 !important',
                        margin: '0 !important',
                      },
                    }}
                  />
                ))}
              </TastingNotesContainer>
            )}
          </StyledDivContent>
        </BoxMain>

        <RowAuthor>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignSelf: 'center',
              flex: 1,
              minWidth: 0,
            }}
          >
            <Typography
              fontFamily="font.main"
              textTransform={'uppercase'}
              sx={{
                mb: 0,
                color: theme.palette.text.primary,
                fontWeight: 500,
              }}
            >
              {tasting.username || 'Anonymous'}
            </Typography>
            <Typography
              sx={{
                color: theme.palette.text.secondary,
              }}
            >
              {new Date(tasting.createdAt || tasting.date).toLocaleDateString()}
            </Typography>
          </Box>
        </RowAuthor>
        <Shadow className="Shadow1" />
        <Shadow className="Shadow2" />
      </StyledCard>
    );
  }, [tasting, theme]);

  const backContent = useMemo(() => {
    if (!tasting || (!isFlipped && !hasBeenFlipped)) return null;

    const hasCafeInDb = tasting.cafeId && typeof tasting.cafeId === 'object' && tasting.cafeId.name;
    const locationDisplay = hasCafeInDb
      ? toTitleCase(cafe.name)
      : tasting.location || null;
    const neighbourhood = hasCafeInDb ? cafe.locations?.[0]?.neighborhood : null;

    return (
      <>
        <CardContent
          sx={{
            flexGrow: 1,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* Header - Coffee Origin + Region */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontWeight: theme.typography.fontWeightBold }}
            >
              {toTitleCase(tasting.coffeeOrigin) || '—'}
            </Typography>
            {tasting.coffeeOriginRegion && (
              <Typography variant="body2" color="text.secondary">
                {toTitleCase(tasting.coffeeOriginRegion)}
              </Typography>
            )}
          </Box>

          {/* Coffee Details */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1.5 }}>
            {tasting.brewMethod && (
              <Box>
                <Typography textTransform="uppercase" variant="body2" sx={{ fontWeight: 'bold' }}>
                  Brew Method:
                </Typography>
                <Typography variant="body2" sx={{ pl: 1 }}>
                  {toTitleCase(tasting.brewMethod)}
                </Typography>
              </Box>
            )}

            {tasting.coffeeRoaster && (
              <Box>
                <Typography textTransform="uppercase" variant="body1" sx={{ fontWeight: 'bold' }}>
                  Roaster:
                </Typography>
                <Typography variant="body2" sx={{ pl: 1 }}>
                  {toTitleCase(tasting.coffeeRoaster)}
                </Typography>
              </Box>
            )}

            {/* Tasting profile — 3 columns */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
              {tasting.roastLevel && (
                <Box>
                  <Typography textTransform="uppercase" variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
                    Roast:
                  </Typography>
                  <Typography variant="body2">{toTitleCase(tasting.roastLevel)}</Typography>
                </Box>
              )}
              {tasting.acidity && (
                <Box>
                  <Typography textTransform="uppercase" variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
                    Acidity:
                  </Typography>
                  <Typography variant="body2">{toTitleCase(tasting.acidity)}</Typography>
                </Box>
              )}
              {tasting.mouthFeel && (
                <Box>
                  <Typography textTransform="uppercase" variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
                    Body:
                  </Typography>
                  <Typography variant="body2">{toTitleCase(tasting.mouthFeel)}</Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Additional notes toggle */}
          {tasting.notes && (
            <NotesToggle notes={tasting.notes} theme={theme} />
          )}

          {/* Footer */}
          {locationDisplay && (
            <Box
              sx={{
                mt: 'auto',
                pt: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                <strong>{locationDisplay}</strong>
                {neighbourhood && ` • ${toTitleCase(neighbourhood)}`}
              </Typography>
            </Box>
          )}
        </CardContent>
      </>
    );
  }, [tasting, cafe, isFlipped, hasBeenFlipped, theme]);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
    if (!hasBeenFlipped) {
      setHasBeenFlipped(true);
    }
  };

  // Safety check - make sure we have valid tasting data
  if (!tasting || !tasting._id) {
    console.error('🚨 FlipTastingCard received invalid tasting data:', tasting);
    return null;
  }

  return (
    <Tooltip title="Click to flip" arrow>
      <Box
        id={`tasting-card-${tasting._id}`}
        sx={{
          width: '100%',
          height: 345,
          cursor: 'pointer',
        }}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`Coffee tasting: ${toTitleCase(tasting?.coffeeName || 'Unknown')}. Click to flip card and see details.`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {isFlipped ? (
          <StyledCard
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background:
                theme.palette.mode === 'dark'
                  ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.background.paper} 100%)`
                  : `linear-gradient(135deg, ${theme.palette.secondary.main} 20%, ${theme.palette.primary.main} 100%)`,
              color: theme.palette.card.main,
            }}
          >
            {backContent}
          </StyledCard>
        ) : (
          <Box sx={{ height: '100%' }}>{frontContent}</Box>
        )}
      </Box>
    </Tooltip>
  );
};

export default React.memo(FlipTastingCard);
