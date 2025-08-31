import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Tooltip,
  Chip,
  Rating,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Star as StarIcon } from '@mui/icons-material';

function FlipTastingCard({
  tasting,
  isLoggedIn,
  setEditingTasting,
  setDeletingTasting,
  themeMode,
}) {
  const [flipped, setFlipped] = useState(false);
  const theme = useTheme();

  // Enhanced gradients using theme colors
  const gradientFront = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`;

  const cardStyles = {
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    perspective: 1000,
    width: '100%',
    height: 340,
    position: 'relative',
    mb: 2,
  };

  const flipCardInner = {
    position: 'relative',
    width: '100%',
    height: '100%',
    transition: 'transform 0.6s ease-in-out',
    transformStyle: 'preserve-3d',
    transform: 'rotateY(0deg)',
  };

  const cardSide = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  };

  const frontCard = {
    ...cardSide,
    background: gradientFront,
    color: theme.palette.common.white,
  };

  const backCard = {
    ...cardSide,
    transform: 'rotateY(180deg)',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
  };

  return (
    <Box sx={cardStyles}>
      <Tooltip title="Tasting details" arrow placement="top">
        <Box
          sx={flipCardInner}
          aria-label={`Tasting card for ${tasting.cafeId?.name || 'Unknown cafe'}`}
        >
          {/* Front of card */}
          <Card sx={frontCard} elevation={0}>
            <CardContent
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: 3,
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Chip
                    label={tasting.brewMethod || 'Coffee'}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'inherit',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    fontWeight: 700,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 0,
                  }}
                >
                  {tasting.cafeId?.name || 'Unknown Cafe'}
                </Typography>
              </Box>

              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 1.5,
                    opacity: 0.8,
                  }}
                >
                  Tasting Notes
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.9,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 3,
                  }}
                >
                  {tasting.tastingNotes && tasting.tastingNotes.length > 0
                    ? tasting.tastingNotes.join(', ')
                    : 'No tasting notes available'}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.7,
                    display: 'block',
                  }}
                >
                  by {tasting.userId?.username || 'Anonymous'} •{' '}
                  {tasting.createdAt
                    ? new Date(tasting.createdAt).toLocaleDateString()
                    : 'Unknown date'}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Back of card */}
          <Card sx={backCard} elevation={0}>
            <CardContent
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: 3,
              }}
            >
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                color="primary"
                sx={{ fontWeight: 600 }}
              >
                Tasting Details
              </Typography>

              <Box sx={{ flexGrow: 1, mt: 2 }}>
                {tasting.brewMethod && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Brew Method
                    </Typography>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                      {tasting.brewMethod}
                    </Typography>
                  </Box>
                )}

                {tasting.rating && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Rating
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={tasting.rating} readOnly size="small" />
                      <Typography variant="body1">{tasting.rating}/5</Typography>
                    </Box>
                  </Box>
                )}

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Notes
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.5,
                      lineHeight: 1.6,
                      maxHeight: 100,
                      overflow: 'auto',
                    }}
                  >
                    {tasting.notes || 'No detailed notes available'}
                  </Typography>
                </Box>
              </Box>

              {isLoggedIn && (
                <CardActions
                  sx={{
                    justifyContent: 'center',
                    gap: 1,
                    pt: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Tooltip title="Edit tasting">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTasting(tasting);
                      }}
                      size="small"
                      sx={{
                        color: theme.palette.primary.main,
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete tasting">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingTasting(tasting);
                      }}
                      size="small"
                      sx={{
                        color: theme.palette.error.main,
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              )}
            </CardContent>
          </Card>
        </Box>
      </Tooltip>
    </Box>
  );
}

export default FlipTastingCard;
