import React, { useEffect, Suspense } from 'react';
import { useCafeStore } from '../stores/useCafeStore';
import Container from '@mui/material/Container';
import { Box, Typography, Button, Alert, useTheme } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import CafeSearchBar from '../components/common/CafeSearchBar';
import FlipTastingCard from '../components/common/FlipTastingCard';
import { tastingAPI } from '../services/api';
import LoadingLogo from '../components/common/LoadingLogo';

const TastingForm = React.lazy(() => import('../components/forms/TastingForm'));

const TastingsPage = () => {
  const tastings = useCafeStore((state) => state.tastings);
  const setTastings = useCafeStore((state) => state.setTastings);
  const searchQuery = useCafeStore((state) => state.searchQuery);
  const tastingsPerPage = useCafeStore((state) => state.tastingsPerPage);
  const cafeTypeFilter = useCafeStore((state) => state.cafeTypeFilter);
  const neighborhoodFilter = useCafeStore((state) => state.neighborhoodFilter);
  const fetchTastings = useCafeStore((state) => state.fetchTastings);
  const clearFilters = useCafeStore((state) => state.clearFilters);

  const [showTastingForm, setShowTastingForm] = React.useState(false);
  const [displayedCount, setDisplayedCount] = React.useState(12);

  const theme = useTheme();

  const handleTastingSubmit = async (formData) => {
    try {
      const result = await tastingAPI.create(formData);
      if (result.success) {
        setTastings((prev) => [result.data, ...prev]);
        setShowTastingForm(false);
      }
    } catch (error) {
      console.error('Error saving tasting:', error);
    }
  };

  useEffect(() => {
    fetchTastings();
    setDisplayedCount(tastingsPerPage);
    return () => {
      clearFilters();
    };
  }, [fetchTastings, clearFilters, tastingsPerPage]);

  const normalize = (str) =>
    String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const filteredTastings = (Array.isArray(tastings) ? tastings : []).filter((tasting) => {
    if (!tasting || !tasting._id || tasting._id === 'error') return false;

    if (cafeTypeFilter && cafeTypeFilter !== '') {
      if (!tasting.cafeId?.category || tasting.cafeId.category !== cafeTypeFilter) return false;
    }

    if (neighborhoodFilter && neighborhoodFilter !== '') {
      const neighborhood = tasting.cafeId?.locations?.[0]?.neighborhood;
      if (!neighborhood || neighborhood !== neighborhoodFilter) return false;
    }

    if (!searchQuery) return true;
    const query = normalize(searchQuery);

    const searchableFields = [
      tasting.coffeeName,
      tasting.coffeeRoaster,
      tasting.coffeeOrigin,
      tasting.coffeeOriginRegion,
      tasting.brewMethod,
      tasting.roastLevel,
      tasting.acidity,
      tasting.mouthFeel,
      tasting.notes,
      tasting.username,
      ...(Array.isArray(tasting.tastingNotes) ? tasting.tastingNotes : []),
      tasting.cafeId?.name,
    ].filter(Boolean);

    return searchableFields.map(normalize).join(' ').includes(query);
  });

  const currentTastings = filteredTastings.slice(0, displayedCount);
  const hasMoreItems = displayedCount < filteredTastings.length;

  const handleLoadMore = () => setDisplayedCount((prev) => prev + tastingsPerPage);

  useEffect(() => {
    setDisplayedCount(tastingsPerPage);
  }, [searchQuery, tastingsPerPage]);

  return (
    <Container
      maxWidth={false}
      sx={{
        display: 'flex',
        width: '100%',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        p: { xs: 2, sm: 3 },
        pt: { xs: 2, sm: 4 },
      }}
    >
      <Typography
        variant="h1"
        component="h1"
        sx={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        Coffee Tastings
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 3,
          px: { xs: 1, sm: 3 },
        }}
      >
        <Button
          variant={showTastingForm ? 'outlined' : 'contained'}
          startIcon={
            showTastingForm ? <CloseIcon aria-hidden="true" /> : <AddIcon aria-hidden="true" />
          }
          onClick={() => setShowTastingForm((prev) => !prev)}
          aria-label={showTastingForm ? 'Close tasting form' : 'Add new coffee tasting'}
          sx={{
            minWidth: '8rem',
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            backgroundColor: theme.palette.mode === 'dark' ? 'secondary.main' : 'primary.main',
            color: theme.palette.mode === 'dark' ? 'light.main' : 'primary.contrastText',
            outlineColor: theme.palette.mode === 'dark' ? 'light.main' : 'secondary.main',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? 'muted.main' : 'secondary.main',
              color: theme.palette.mode === 'dark' ? 'secondary.main' : 'primary.contrastText',
              outlineColor: theme.palette.mode === 'dark' ? 'light.main' : 'secondary.main',
            },
          }}
        >
          {showTastingForm ? 'Close' : 'Add Tasting'}
        </Button>
      </Box>

      {showTastingForm && (
        <Suspense fallback={<LoadingLogo />}>
          <TastingForm
            onSubmit={handleTastingSubmit}
            initialValues={{}}
            onClose={() => setShowTastingForm(false)}
          />
        </Suspense>
      )}

      {filteredTastings.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No tastings found. {searchQuery && 'Try adjusting your search terms.'}
        </Alert>
      ) : (
        <Box
          sx={{ width: '100%', maxWidth: '1200px', overflow: 'visible' }}
          role="region"
          aria-label="Coffee tastings section"
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(auto-fit, minmax(280px, 1fr))',
                md: 'repeat(auto-fit, minmax(320px, 1fr))',
              },
              gap: 3,
              mt: 2,
              padding: { xs: '0 0.25rem 0.5rem 0.25rem', sm: '0 0.5rem 0.5rem 0.5rem' },
              overflow: 'visible',
              width: '100%',
            }}
            role="grid"
            aria-label="Coffee tasting cards grid"
          >
            {currentTastings.length === 0 ? (
              <Typography
                variant="body2"
                color="text.primary"
                sx={{ textAlign: 'center', py: 4, gridColumn: '1 / -1' }}
              >
                No tasting cards to display.
              </Typography>
            ) : (
              currentTastings.map((tasting, index) => (
                <FlipTastingCard
                  key={tasting._id || `tasting-${index}`}
                  tasting={tasting}
                  sx={{ width: '100%' }}
                />
              ))
            )}
          </Box>

          {hasMoreItems && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: 4,
                mb: 4,
                py: 2,
              }}
            >
              <Button
                onClick={handleLoadMore}
                variant="contained"
                size="large"
                sx={{
                  minWidth: '200px',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': { backgroundColor: theme.palette.primary.dark },
                }}
                aria-label="Load more tastings"
              >
                Load More ({filteredTastings.length - displayedCount} remaining)
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};

export default TastingsPage;
