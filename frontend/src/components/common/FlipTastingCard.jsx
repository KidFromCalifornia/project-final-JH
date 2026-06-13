import React, { useState, useEffect, useMemo } from 'react';
import { Box, Chip, Typography, IconButton, Dialog, CardContent, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCafeStore } from '../../stores/useCafeStore';
import { StyledCard, BoxMain, StyledDivContent, TypographyTitle, RowAuthor, Shadow, TastingNotesContainer } from '../../styles/FlipTastingCard.styles';

const CARD_W = 320;
const CARD_H = 400;
const BACK_W = 400;

const tt = (str) => {
  if (!str) return '';
  return str.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

const Field = ({ label, value }) => (
  <Box>
    <Typography textTransform="uppercase" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{label}:</Typography>
    <Typography sx={{ pl: 1, fontSize: '1rem' }}>{tt(value)}</Typography>
  </Box>
);

const FlipTastingCard = ({ tasting, isFlipped = false, onFlip, anyFlipped = false }) => {
  const theme = useTheme();
  const [showNotes, setShowNotes] = useState(false);
  const cafes = useCafeStore((state) => state.cafes);

  const cafe = useMemo(() => {
    if (tasting?.cafeId && typeof tasting.cafeId === 'object' && tasting.cafeId.name) return tasting.cafeId;
    return cafes.find((c) => c._id === tasting?.cafeId) || {};
  }, [cafes, tasting?.cafeId]);

  useEffect(() => { if (!isFlipped) setShowNotes(false); }, [isFlipped]);

  if (!tasting?._id) return null;

  const hasCafe = tasting.cafeId && typeof tasting.cafeId === 'object' && tasting.cafeId.name;
  const locationDisplay = hasCafe ? tt(cafe.name) : tasting.location || 'Other';
  const neighbourhood = hasCafe ? cafe.locations?.[0]?.neighborhood : null;

  const handleFlip = () => { setShowNotes(false); onFlip?.(tasting._id); };

  // ── Front ──────────────────────────────────────────────
  if (!isFlipped) {
    return (
      <Box sx={{ width: CARD_W, height: CARD_H, cursor: 'pointer', opacity: anyFlipped ? 0.25 : 1, transition: 'opacity 0.3s', pointerEvents: anyFlipped ? 'none' : 'auto', overflow: 'visible', borderRadius: `${theme.shape.borderRadius * 3}px`, boxShadow: '6px 10px 18px rgba(10,31,51,0.35)' }} onClick={handleFlip}>
        <StyledCard elevation={0}>
          <BoxMain minHeight={288} position="relative">
            <StyledDivContent className="tasting-cd">
              <TypographyTitle role="title" variant="h3">{tt(tasting.coffeeName)}</TypographyTitle>
              {Array.isArray(tasting.tastingNotes) && tasting.tastingNotes.length > 0 && (
                <TastingNotesContainer>
                  {tasting.tastingNotes.slice(0, 4).map((note, i) => (
                    <Chip key={i} label={tt(note)} size="small" sx={{
                      fontWeight: theme.typography.fontWeightMedium,
                      fontSize: '16px',
                      bgcolor: 'transparent', color: theme.palette.card.main,
                      border: 'none', borderRadius: 0,
                      padding: '0 !important', margin: '0 !important',
                      minHeight: 'unset', height: 'unset',
                      '& .MuiChip-label': { padding: '0 !important', lineHeight: 1 },
                    }} />
                  ))}
                </TastingNotesContainer>
              )}
            </StyledDivContent>
          </BoxMain>
          <RowAuthor>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', flex: 1, px: 1.5 }}>
              <Typography textTransform="uppercase" sx={{ fontWeight: 600, fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {tasting.username && tasting.username.toLowerCase() !== 'anonymous' ? tasting.username : ''}
              </Typography>
              <Typography sx={{ fontSize: '16px', whiteSpace: 'nowrap', color: theme.palette.text.secondary }}>
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

  // ── Back ───────────────────────────────────────────────
  return (
    <>
      <Box sx={{ width: CARD_W, height: CARD_H, opacity: 0 }} />
      <Dialog open={isFlipped} onClose={handleFlip} maxWidth={false}
        PaperProps={{
          sx: {
            width: BACK_W, height: 'auto', maxHeight: '92vh', overflowY: 'auto',
            borderRadius: `${theme.shape.borderRadius * 3}px`,
            background: theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.background.paper} 100%)`
              : `linear-gradient(135deg, ${theme.palette.secondary.main} 20%, ${theme.palette.primary.main} 100%)`,
            color: theme.palette.card.main,
          },
        }}
        slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' } } }}
      >
        <IconButton size="small" onClick={handleFlip} aria-label="Close"
          sx={{ position: 'absolute', top: 8, right: 8, color: 'inherit', opacity: 0.85, '&:hover': { opacity: 1 } }}>
          <CloseIcon fontSize="small" />
        </IconButton>

        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1.5rem' }}>{tt(tasting.coffeeOrigin) || '—'}</Typography>
            {tasting.coffeeOriginRegion && (
              <Typography sx={{ color: theme.palette.accent.main, fontSize: '1rem' }}>{tt(tasting.coffeeOriginRegion)}</Typography>
            )}
          </Box>

          {tasting.brewMethod && <Field label="Brew Method" value={tasting.brewMethod} />}
          {tasting.coffeeRoaster && <Field label="Roaster" value={tasting.coffeeRoaster} />}

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
            {tasting.roastLevel && <Box><Typography textTransform="uppercase" sx={{ fontWeight: 700, display: 'block', fontSize: '0.75rem' }}>Roast:</Typography><Typography sx={{ fontSize: '1rem' }}>{tt(tasting.roastLevel)}</Typography></Box>}
            {tasting.acidity && <Box><Typography textTransform="uppercase" sx={{ fontWeight: 700, display: 'block', fontSize: '0.75rem' }}>Acidity:</Typography><Typography sx={{ fontSize: '1rem' }}>{tt(tasting.acidity)}</Typography></Box>}
            {tasting.mouthFeel && <Box><Typography textTransform="uppercase" sx={{ fontWeight: 700, display: 'block', fontSize: '0.75rem' }}>Body:</Typography><Typography sx={{ fontSize: '1rem' }}>{tt(tasting.mouthFeel)}</Typography></Box>}
          </Box>

          {tasting.notes && (
            <Box>
              <Typography onClick={() => setShowNotes((v) => !v)}
                sx={{ fontSize: '0.875rem', cursor: 'pointer', color: theme.palette.accent.main, textDecoration: 'underline', textUnderlineOffset: '3px', userSelect: 'none', '&:hover': { opacity: 0.8 } }}>
                {showNotes ? 'Hide notes' : 'Show tasting notes & recipe'}
              </Typography>
              {showNotes && (
                <Typography sx={{ fontSize: '1rem', mt: 1, whiteSpace: 'pre-wrap', color: 'text.secondary', fontWeight: 700 }}>
                  {tasting.notes}
                </Typography>
              )}
            </Box>
          )}

          {locationDisplay && (
            <Box sx={{ pt: 2, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'right' }}>
              <Typography sx={{ fontSize: '0.875rem', color: '#fff' }}>
                <strong>{locationDisplay}</strong>
                {neighbourhood && ` • ${tt(neighbourhood)}`}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Dialog>
    </>
  );
};

export default React.memo(FlipTastingCard);
