import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useThemeUtils } from "../../hooks/useThemeUtils";
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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Coffee as CoffeeIcon,
  Star as StarIcon,
} from "@mui/icons-material";

function EnhancedFlipTastingCard({
  tasting,
  isLoggedIn,
  setEditingTasting,
  setDeletingTasting,
  themeMode,
}) {
  const [flipped, setFlipped] = useState(false);
  const { theme, styles, colors, helpers } = useThemeUtils();
  
  // Enhanced gradients using theme utilities
  const gradientFront = styles.gradients.primary;
  const gradientBack = styles.gradients.accent;

  const cardStyles = {
    ...styles.cardHover,
    perspective: 1000,
    width: "100%",
    height: 340,
    position: "relative",
    mb: 2,
  };

  const flipCardInner = {
    position: "relative",
    width: "100%",
    height: "100%",
    textAlign: "center",
    transition: "transform 0.6s ease-in-out",
    transformStyle: "preserve-3d",
    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
  };

  const cardSide = {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    overflow: "hidden",
    ...styles.glassMorphism,
  };

  const frontCard = {
    ...cardSide,
    background: gradientFront.background,
    color: theme.palette.common.white,
  };

  const backCard = {
    ...cardSide,
    transform: "rotateY(180deg)",
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
  };

  return (
    <Box sx={cardStyles}>
      <Tooltip
        title={flipped ? "Click to see front" : "Click for details"}
        arrow
        placement="top"
      >
        <Box
          onClick={() => setFlipped((prev) => !prev)}
          sx={flipCardInner}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setFlipped((prev) => !prev);
            }
          }}
          aria-label={`Tasting card for ${tasting.cafeId?.name || 'Unknown cafe'}`}
        >
          {/* Front of card */}
          <Card sx={frontCard} elevation={0}>
            <CardContent sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 3,
            }}>
              <Box>
                <Box sx={{ ...styles.flexBetween, mb: 2 }}>
                  <CoffeeIcon sx={{ fontSize: 32, opacity: 0.9 }} />
                  <Chip
                    label={tasting.brewMethod || 'Coffee'}
                    size="small"
                    sx={{
                      backgroundColor: colors.alpha(theme.palette.common.white, 0.2),
                      color: 'inherit',
                      fontWeight: 600,
                    }}
                  />
                </Box>
                
                <Typography 
                  variant="h5" 
                  component="h3"
                  gutterBottom
                  sx={{ 
                    fontWeight: 700,
                    ...styles.textClamp(2),
                    mb: 1,
                  }}
                >
                  {tasting.cafeId?.name || "Unknown Cafe"}
                </Typography>
                
                <Box sx={{ ...styles.centerContent, mb: 2 }}>
                  <Rating
                    value={tasting.rating || 0}
                    readOnly
                    size="large"
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: theme.palette.accent.main,
                      },
                      '& .MuiRating-iconEmpty': {
                        color: colors.alpha(theme.palette.common.white, 0.3),
                      },
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.9,
                    ...styles.textClamp(3),
                  }}
                >
                  {tasting.notes || "No notes available"}
                </Typography>
                
                <Typography 
                  variant="caption" 
                  sx={{ 
                    opacity: 0.7,
                    mt: 2,
                    display: 'block',
                  }}
                >
                  by {tasting.userId?.username || "Anonymous"} • {" "}
                  {tasting.createdAt 
                    ? new Date(tasting.createdAt).toLocaleDateString()
                    : "Unknown date"
                  }
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Back of card */}
          <Card sx={backCard} elevation={0}>
            <CardContent sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              p: 3,
            }}>
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
                      <Typography variant="body1">
                        {tasting.rating}/5
                      </Typography>
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
                    {tasting.notes || "No detailed notes available"}
                  </Typography>
                </Box>
              </Box>

              {isLoggedIn && (
                <CardActions sx={{ 
                  justifyContent: 'center', 
                  gap: 1,
                  pt: 2,
                  borderTop: `1px solid ${theme.palette.divider}`,
                }}>
                  <Tooltip title="Edit tasting">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTasting(tasting);
                      }}
                      size="small"
                      sx={helpers.hover(
                        { color: theme.palette.primary.main },
                        { backgroundColor: colors.primary.light }
                      )}
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
                      sx={helpers.hover(
                        { color: theme.palette.error.main },
                        { backgroundColor: colors.alpha(theme.palette.error.main, 0.1) }
                      )}
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

export default EnhancedFlipTastingCard;
