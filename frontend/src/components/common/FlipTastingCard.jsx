import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CoffeeIcon from '@mui/icons-material/Coffee';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import StorefrontIcon from '@mui/icons-material/Storefront';
import DateRangeIcon from '@mui/icons-material/DateRange';
import GradeIcon from '@mui/icons-material/Grade';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useCafeStore } from '../../stores/useCafeStore';

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

  // Optimized card styling with performance improvements
  const cardContainerStyle = {
    perspective: '1000px',
    width: '100%',
    height: '100%',
    position: 'relative',
    transformStyle: 'preserve-3d',
    willChange: 'transform', // Performance hint for browser
    cursor: 'pointer',
    transition: `transform ${isMobile ? '0.3s' : '0.5s'} ease`,
  };

  // Shared style for both card faces with performance optimizations
  const cardFaceStyle = (isBack) => ({
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden', // For Safari
    transform: isBack ? 'rotateY(180deg) translateZ(0)' : 'rotateY(0) translateZ(0)',
    WebkitTransform: isBack ? 'rotateY(180deg) translateZ(0)' : 'rotateY(0) translateZ(0)',
    transition: `transform ${isMobile ? '0.3s' : '0.5s'} ease`,
    display: 'flex',
    flexDirection: 'column',
    bgcolor: theme.palette.background.paper,
    borderRadius: '8px',
    overflow: 'hidden',
  });

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
      <>
        {/* Header with cafe name and rating */}
        <Box
          sx={{
            p: 2,
            pb: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid',
            borderColor: 'primary.main',
            mb: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontSize: '0.85rem',
            }}
          >
            ☕ {cafe.name || 'Unknown Cafe'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <GradeIcon sx={{ fontSize: 18, color: 'warning.main' }} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'warning.main' }}>
              {tasting.rating || 'N/A'}/5
            </Typography>
          </Box>
        </Box>

        {/* Main content */}
        <CardContent sx={{ flexGrow: 1, p: 2, pt: 1 }}>
          {/* Coffee name - main title */}
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              lineHeight: 1.1,
              fontSize: { xs: '1.3rem', sm: '1.5rem' },
              color: 'text.primary',
              textTransform: 'capitalize',
            }}
          >
            🌟 {tasting.coffeeName}
          </Typography>

          {/* Subtitle with roaster and origin */}
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: 2, 
              lineHeight: 1.4,
              fontWeight: 500,
              fontSize: '1rem',
            }}
          >
            📍 {tasting.coffeeRoaster} • {tasting.coffeeOrigin}
            {tasting.coffeeOriginRegion && `, ${tasting.coffeeOriginRegion}`}
          </Typography>

          {/* Brew method and roast level */}
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Method
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {tasting.brewMethod || 'Unknown'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Roast
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                {tasting.roastLevel || 'Unknown'}
              </Typography>
            </Box>
          </Stack>

          {/* Tasting notes preview */}
          {Array.isArray(tasting.tastingNotes) && tasting.tastingNotes.length > 0 && (
            <Box>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', mb: 1, display: 'block' }}
              >
                Tasting Notes
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.5}>
                {tasting.tastingNotes.slice(0, 3).map((note, index) => (
                  <Chip
                    key={index}
                    label={note}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      borderColor: 'primary.main',
                      color: 'primary.main',
                    }}
                  />
                ))}
                {tasting.tastingNotes.length > 3 && (
                  <Chip
                    label={`+${tasting.tastingNotes.length - 3}`}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      borderColor: 'text.secondary',
                      color: 'text.secondary',
                    }}
                  />
                )}
              </Stack>
            </Box>
          )}
        </CardContent>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            pt: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <DateRangeIcon sx={{ fontSize: 14 }} />
            {new Date(tasting.createdAt || tasting.date).toLocaleDateString()}
          </Typography>
          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 500 }}>
            Tap for details
          </Typography>
        </Box>
      </>
    ),
    [tasting, cafe.name]
  );

  // Only render back content if card is flipped or has been flipped
  const backContent = useMemo(() => {
    if (!isFlipped && !hasBeenFlipped) return null;

    return (
      <>
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography variant="h6" component="div" gutterBottom>
            Tasting Notes
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={1} mb={2}>
            {Array.isArray(tasting.tastingNotes) &&
              tasting.tastingNotes.map((note, index) => (
                <Chip
                  key={index}
                  label={note}
                  size="small"
                  color="secondary"
                  icon={<FavoriteIcon fontSize="small" />}
                />
              ))}
            {(!Array.isArray(tasting.tastingNotes) || tasting.tastingNotes.length === 0) && (
              <Typography variant="body2" color="text.secondary">
                No tasting notes recorded
              </Typography>
            )}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <DateRangeIcon fontSize="small" color="primary" />
            <Typography variant="body2" color="text.secondary">
              {new Date(tasting.createdAt || tasting.date).toLocaleDateString()}
            </Typography>
          </Stack>

          {tasting.notes && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              "{tasting.notes}"
            </Typography>
          )}
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          {isLoggedIn && tasting.userId && (
            <>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingTasting(tasting);
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeletingTasting(tasting);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="caption" color="text.secondary">
            Tap to flip back
          </Typography>
        </CardActions>
      </>
    );
  }, [tasting, isFlipped, hasBeenFlipped, isLoggedIn, setEditingTasting, setDeletingTasting]);

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
      {/* Card Content - show front or back based on flip state */}
      <Card
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: theme.palette.background.paper,
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: 2,
          '&:hover': {
            boxShadow: 4,
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out',
          },
        }}
      >
        {isFlipped ? backContent : frontContent}
      </Card>
    </Box>
  );
};

export default React.memo(FlipTastingCard); // Use memo to prevent unnecessary re-renders
