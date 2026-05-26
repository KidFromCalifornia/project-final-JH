import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Chip,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';

const categoryLabel = (cat) => {
  const map = { thirdwave: 'Third Wave', specialty: 'Specialty', roaster: 'Roaster' };
  return map[cat] ?? cat.replace(/\b\w/g, (c) => c.toUpperCase());
};

const CafeListDialog = ({ open, onClose, cafes, onSelectCafe }) => {
  const theme = useTheme();
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeNeighborhood, setActiveNeighborhood] = useState(null);

  const categories = useMemo(
    () => [...new Set(cafes.map((c) => c.category).filter(Boolean))].sort(),
    [cafes]
  );

  const neighborhoods = useMemo(
    () => [...new Set(cafes.flatMap((c) => c.locations?.map((l) => l.neighborhood)).filter(Boolean))].sort(),
    [cafes]
  );

  const filtered = useMemo(() => {
    let result = cafes;
    if (activeCategory) result = result.filter((c) => c.category === activeCategory);
    if (activeNeighborhood) result = result.filter((c) => c.locations?.some((l) => l.neighborhood === activeNeighborhood));
    return result;
  }, [cafes, activeCategory, activeNeighborhood]);

  const handleSelect = (cafe) => {
    onSelectCafe(cafe);
    onClose();
  };

  const chipSx = (active) => ({
    cursor: 'pointer',
    fontWeight: active ? 700 : 500,
    borderColor: active ? theme.palette.light.main : alpha(theme.palette.light.main, 0.35),
    color: active ? theme.palette.light.main : alpha(theme.palette.light.main, 0.7),
    backgroundColor: active ? alpha(theme.palette.light.main, 0.15) : 'transparent',
    '&:hover': {
      backgroundColor: alpha(theme.palette.light.main, 0.1),
      borderColor: theme.palette.light.main,
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { maxHeight: '80vh' } }}
    >
      <DialogTitle
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}
      >
        <Typography variant="h6" fontWeight={700}>
          Current Cafes
        </Typography>
        <IconButton onClick={onClose} size="small" aria-label="Close cafe list">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Category chips */}
      {categories.length > 0 && (
        <Box sx={{ px: 3, pb: 1, display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={categoryLabel(cat)}
              variant="outlined"
              size="small"
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              sx={chipSx(activeCategory === cat)}
            />
          ))}
        </Box>
      )}

      {/* Neighbourhood chips */}
      {neighborhoods.length > 0 && (
        <Box sx={{ px: 3, pb: 1.5, display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          {neighborhoods.map((n) => (
            <Chip
              key={n}
              label={n}
              variant="outlined"
              size="small"
              onClick={() => setActiveNeighborhood(activeNeighborhood === n ? null : n)}
              sx={chipSx(activeNeighborhood === n)}
            />
          ))}
        </Box>
      )}

      <Divider />

      <DialogContent sx={{ p: 0 }}>
        {filtered.length === 0 ? (
          <Typography variant="body2" sx={{ p: 3, opacity: 0.6, textAlign: 'center' }}>
            No cafes in this category.
          </Typography>
        ) : (
          <List disablePadding>
            {filtered.map((cafe) => {
              const loc = cafe.locations?.[0];
              return (
                <ListItemButton
                  key={cafe._id}
                  onClick={() => handleSelect(cafe)}
                  divider
                  sx={{
                    py: 1.25,
                    px: 3,
                    '&:hover': { backgroundColor: alpha(theme.palette.light.main, 0.06) },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" fontWeight={600}>
                          {cafe.name}
                        </Typography>
                        {cafe.category && (
                          <Typography
                            variant="caption"
                            sx={{
                              px: 0.75,
                              py: 0.2,
                              borderRadius: 0.5,
                              backgroundColor: alpha(theme.palette.secondary.main, 0.5),
                              color: theme.palette.light.main,
                              fontWeight: 600,
                              fontSize: '0.65rem',
                            }}
                          >
                            {categoryLabel(cafe.category)}
                          </Typography>
                        )}
                        {cafe.locations?.length > 1 && (
                          <Typography variant="caption" sx={{ opacity: 0.55, fontSize: '0.65rem' }}>
                            {cafe.locations.length} locations
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={
                      loc ? (
                        <Typography variant="caption" sx={{ opacity: 0.65 }}>
                          {[loc.address, loc.neighborhood].filter(Boolean).join(' · ')}
                        </Typography>
                      ) : null
                    }
                  />
                </ListItemButton>
              );
            })}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CafeListDialog;
