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

const FlipTastingCard = ({ tasting, setEditingTasting, setDeletingTasting, isLoggedIn }) => {
  // Safety check - make sure we have valid tasting data
  if (!tasting || !tasting._id) {
    console.error('🚨 FlipTastingCard received invalid tasting data:', tasting);
    return null;
  }

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasBeenFlipped, setHasBeenFlipped] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const cafes = useCafeStore((state) => state.cafes);

  // Use the populated cafeId data directly since it's populated from the API
  const cafe = useMemo(() => {
    // If cafeId is already populated (object), use it directly
    if (tasting.cafeId && typeof tasting.cafeId === 'object' && tasting.cafeId.name) {
      return tasting.cafeId;
    }
    // Fallback: if cafeId is just an ID string, look it up in the cafes store
    return cafes.find((c) => c._id === tasting.cafeId) || {};
  }, [cafes, tasting.cafeId]);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
    if (!hasBeenFlipped) {
      setHasBeenFlipped(true);
    }
  };

  // Mobile touch handling for better user experience
  useEffect(() => {
    if (!isMobile) return;

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
  }, [isMobile, tasting._id, touchStart, hasBeenFlipped]);

  // Memoize card content to avoid unnecessary re-renders
  const frontContent = useMemo(
    () => (
      <StyledCard>
        <BoxMain minHeight={280} position="relative">
          <StyledDivContent>
            <TypographyTitle variant="h2">{tasting.coffeeName}</TypographyTitle>
            {/* Tasting Notes in the gradient overlay */}
            {Array.isArray(tasting.tastingNotes) && tasting.tastingNotes.length > 0 && (
              <TastingNotesContainer>
                {tasting.tastingNotes.slice(0, 4).map((note, index) => (
                  <Chip
                    key={index}
                    label={note}
                    size="small"
                    sx={{
                      height: '20px',
                      fontSize: theme.typography.caption.fontSize,
                      fontWeight: theme.typography.fontWeightMedium,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: theme.palette.text.secondary,
                      borderRadius: theme.shape.borderRadius * 2.5,
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      '& .MuiChip-label': {
                        px: theme.spacing(0.75),
                      },
                    }}
                  />
                ))}
              </TastingNotesContainer>
            )}
          </StyledDivContent>
        </BoxMain>

        <RowAuthor>
          <Box sx={{ alignSelf: 'center', flex: 1, minWidth: 0 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: theme.typography.fontWeightMedium,
                color: theme.palette.text.primary,
                mb: 0,
              }}
            >
              {tasting.userId?.username || 'Anonymous'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
              }}
            >
              {new Date(tasting.createdAt || tasting.date).toLocaleDateString()} |{' '}
              {cafe.name || 'Unknown Cafe'}
            </Typography>
          </Box>
        </RowAuthor>
        <Shadow className="Shadow1" />
        <Shadow className="Shadow2" />
      </StyledCard>
    ),
    [tasting, cafe.name, theme]
  );

  const backContent = useMemo(() => {
    if (!isFlipped && !hasBeenFlipped) return null;

    return (
      <>
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography variant="h6" component="div" gutterBottom color="text.primary">
            Tasting Details
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={1} mb={2}>
            {Array.isArray(tasting.tastingNotes) &&
              tasting.tastingNotes.map((note, index) => (
                <Chip
                  key={index}
                  label={note}
                  size="small"
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  }}
                />
              ))}
            {(!Array.isArray(tasting.tastingNotes) || tasting.tastingNotes.length === 0) && (
              <Typography variant="body2" color="text.secondary">
                No tasting notes recorded
              </Typography>
            )}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <Typography variant="body2" color="text.secondary">
              {new Date(tasting.createdAt || tasting.date).toLocaleDateString()}
            </Typography>
          </Stack>

          {tasting.notes && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
              "{tasting.notes}"
            </Typography>
          )}
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          {isLoggedIn && tasting.userId && (
            <>
              <Button
                size="small"
                variant="text"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingTasting(tasting);
                }}
              >
                Edit
              </Button>
              <Button
                size="small"
                variant="text"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeletingTasting(tasting);
                }}
              >
                Delete
              </Button>
            </>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="caption" color="text.secondary">
            Tap to flip back
          </Typography>
        </CardActions>
      </>
    );
  }, [
    tasting,
    isFlipped,
    hasBeenFlipped,
    isLoggedIn,
    setEditingTasting,
    setDeletingTasting,
    theme,
  ]);

  return (
    <Box
      id={`tasting-card-${tasting._id}`}
      sx={{
        width: '100%',
        height: '100%',
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
            bgcolor: theme.palette.background.paper,
            overflow: 'hidden',
          }}
        >
          {backContent}
        </StyledCard>
      ) : (
        frontContent
      )}
    </Box>
  );
};

export default React.memo(FlipTastingCard);
