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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasBeenFlipped, setHasBeenFlipped] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const cafes = useCafeStore((state) => state.cafes);

  // Find cafe name from cafeId
  const cafe = useMemo(() => {
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
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography variant="h6" component="div" gutterBottom noWrap>
            {tasting.coffeeName}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <StorefrontIcon fontSize="small" color="primary" />
            <Typography variant="body2" color="text.secondary" noWrap>
              {cafe.name || 'Unknown Cafe'}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <CoffeeIcon fontSize="small" color="primary" />
            <Typography variant="body2" color="text.secondary" noWrap>
              {tasting.brewMethod || 'Unknown Method'}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <GradeIcon fontSize="small" color="primary" />
            <Typography variant="body2" color="text.secondary">
              Rating: {tasting.rating || 'N/A'}/5
            </Typography>
          </Stack>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <Chip
            label={`${tasting.origin || 'Unknown Origin'}`}
            size="small"
            icon={<LocalCafeIcon />}
            color="primary"
            variant="outlined"
          />
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="caption" color="text.secondary">
            Tap to flip
          </Typography>
        </CardActions>
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
              {new Date(tasting.date).toLocaleDateString()}
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
        ...cardContainerStyle,
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}
      onClick={handleClick}
    >
      {/* Front Card */}
      <Card
        sx={{
          ...cardFaceStyle(false),
          display: isFlipped ? 'none' : 'flex', // Performance optimization
        }}
      >
        {frontContent}
      </Card>

      {/* Back Card */}
      <Card
        sx={{
          ...cardFaceStyle(true),
          display: isFlipped ? 'flex' : 'none', // Performance optimization
        }}
      >
        {backContent}
      </Card>
    </Box>
  );
};

export default React.memo(FlipTastingCard); // Use memo to prevent unnecessary re-renders
