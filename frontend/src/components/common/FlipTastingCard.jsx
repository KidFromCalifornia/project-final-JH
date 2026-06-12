import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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

const FlipTastingCard = ({ tasting, isFlipped = false, onFlip }) => {
  const theme = useTheme();
  const [showNotes, setShowNotes] = useState(false);
  const cafes = useCafeStore((state) => state.cafes);

  const cafe = useMemo(() => {
    if (tasting?.cafeId && typeof tasting.cafeId === 'object' && tasting.cafeId.name) {
      return tasting.cafeId;
    }
    return cafes.find((c) => c._id === tasting?.cafeId) || {};
  }, [cafes, tasting?.cafeId]);

  if (!tasting?._id) return null;

  const hasCafeInDb = tasting.cafeId && typeof tasting.cafeId === 'object' && tasting.cafeId.name;
  const locationDisplay = hasCafeInDb ? toTitleCase(cafe.name) : tasting.location || null;
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
      <Box sx={{ width: '100%', height: 345, cursor: 'pointer' }} onClick={handleFlip}>
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

  // Back side — absolute so it floats above other cards
  return (
    <Box sx={{ position: 'relative', height: 345 }}>
    <Card
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 20,
        borderRadius: `${theme.shape.borderRadius * 3}px`,
        boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
        background:
          theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.background.paper} 100%)`
            : `linear-gradient(135deg, ${theme.palette.secondary.main} 20%, ${theme.palette.primary.main} 100%)`,
        color: theme.palette.card.main,
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

      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* Origin + Region */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {toTitleCase(tasting.coffeeOrigin) || '—'}
          </Typography>
          {tasting.coffeeOriginRegion && (
            <Typography variant="body2" sx={{ color: theme.palette.accent.main }}>
              {toTitleCase(tasting.coffeeOriginRegion)}
            </Typography>
          )}
        </Box>

        {/* Brew Method + Roaster */}
        {tasting.brewMethod && (
          <Box>
            <Typography textTransform="uppercase" variant="body2" sx={{ fontWeight: 'bold' }}>Brew Method:</Typography>
            <Typography variant="body2" sx={{ pl: 1 }}>{toTitleCase(tasting.brewMethod)}</Typography>
          </Box>
        )}
        {tasting.coffeeRoaster && (
          <Box>
            <Typography textTransform="uppercase" variant="body2" sx={{ fontWeight: 'bold' }}>Roaster:</Typography>
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
              <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
                {tasting.notes}
              </Typography>
            )}
          </Box>
        )}

        {/* Footer */}
        {locationDisplay && (
          <Box sx={{ pt: 2, borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant="caption" sx={{ color: '#fff' }}>
              <strong>{locationDisplay}</strong>
              {neighbourhood && ` • ${toTitleCase(neighbourhood)}`}
            </Typography>
          </Box>
        )}

      </CardContent>
    </Card>
    </Box>
  );
};

export default React.memo(FlipTastingCard);
