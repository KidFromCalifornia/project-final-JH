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
// ✅ REMOVED unused Block import

const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const FlipTastingCard = ({ tasting, setEditingTasting, setDeletingTasting, isLoggedIn }) => {
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
          <StyledDivContent>
            <TypographyTitle variant="h2">{toTitleCase(tasting.coffeeName)}</TypographyTitle>
            {/* Tasting Notes in the gradient overlay */}
            {Array.isArray(tasting.tastingNotes) && tasting.tastingNotes.length > 0 && (
              <TastingNotesContainer>
                {tasting.tastingNotes.slice(0, 4).map((note, index) => (
                  <Chip
                    key={index}
                    label={toTitleCase(note)}
                    size="small"
                    sx={{
                      fontWeight: theme.typography.fontWeightMedium,
                      fontSize: theme.typography.caption.fontSize,
                      bgcolor: 'transparent',
                      color: theme.palette.text.secondary,
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
              fontSize={16}
              sx={{
                mb: 0,
                color: theme.palette.text.primary,
                fontWeight: 500,
              }}
            >
              {tasting.userId?.username || 'Anonymous'}
            </Typography>
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '1rem',
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

    return (
      <>
        <CardContent
          sx={{
            flexGrow: 1,
            p: 3, // ✅ INCREASED padding for better spacing
            display: 'flex',
            flexDirection: 'column',
            gap: 2, // ✅ ADDED consistent gap between sections
          }}
        >
          {/* Header - Coffee Origin */}
          <Typography
            variant="h4"
            component="h2"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: theme.typography.fontWeightBold,
              textAlign: 'center',
            }}
          >
            {toTitleCase(tasting.coffeeOrigin)}
          </Typography>
          {/* Coffee Details Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr', // ✅ SINGLE column for better readability
              gap: 1.5,
            }}
          >
            {tasting.coffeeRoaster && (
              <Box>
                <Typography
                  textTransform={'uppercase'}
                  variant="body"
                  sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}
                >
                  Roaster:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
                  {toTitleCase(tasting.coffeeRoaster)}
                </Typography>
              </Box>
            )}

            {tasting.brewMethod && (
              <Box>
                <Typography
                  textTransform={'uppercase'}
                  variant="body2"
                  sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}
                >
                  Brew Method:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
                  {toTitleCase(tasting.brewMethod)}
                </Typography>
              </Box>
            )}

            {/* Three column grid for short fields */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)', // ✅ THREE columns for compact info
                gap: 1,
              }}
            >
              {tasting.roastLevel && (
                <Box>
                  <Typography
                    textTransform={'uppercase'}
                    variant="caption"
                    sx={{
                      fontWeight: 'bold',
                      color: theme.palette.text.secondary,
                      display: 'block',
                    }}
                  >
                    Roast:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {toTitleCase(tasting.roastLevel)}
                  </Typography>
                </Box>
              )}

              {tasting.acidity && (
                <Box>
                  <Typography
                    textTransform={'uppercase'}
                    variant="caption"
                    sx={{
                      fontWeight: 'bold',
                      color: theme.palette.text.secondary,
                      display: 'block',
                    }}
                  >
                    Acidity:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {toTitleCase(tasting.acidity)}
                  </Typography>
                </Box>
              )}

              {tasting.mouthFeel && (
                <Box>
                  <Typography
                    textTransform={'uppercase'}
                    variant="caption"
                    sx={{
                      fontWeight: 'bold',
                      color: theme.palette.text.secondary,
                      display: 'block',
                    }}
                  >
                    Body:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {toTitleCase(tasting.mouthFeel)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Location & Date - Footer */}
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
            sx={{
              mt: 'auto',
              pt: 2,
              borderTop: `1px solid ${theme.palette.light.main}`,
              textAlign: 'center', // ✅ CENTERED footer
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              <strong>{toTitleCase(cafe.name) || 'Unknown Cafe'}</strong>
              {cafe.locations?.[0]?.neighborhood &&
                ` • ${toTitleCase(cafe.locations[0].neighborhood)}`}
            </Typography>
          </Box>
        </CardContent>
      </>
    );
  }, [tasting, cafe.name, cafe.locations, isFlipped, hasBeenFlipped, theme]);

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
