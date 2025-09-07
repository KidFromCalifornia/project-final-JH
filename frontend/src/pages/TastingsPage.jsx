import React, { useEffect, Suspense } from 'react';
import { useCafeStore } from '../stores/useCafeStore';
import Container from '@mui/material/Container';
import { Box, Typography, Button, Alert, useTheme, Tooltip } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import CafeSearchBar from '../components/common/CafeSearchBar';
import FlipTastingCard from '../components/common/FlipTastingCard';
import { tastingAPI } from '../services/api';
import LoadingLogo from '../components/common/LoadingLogo';

const TastingForm = React.lazy(() => import('../components/forms/TastingForm'));

const TastingsPage = () => {
  const tastings = useCafeStore((state) => state.tastings);
  const setTastings = useCafeStore((state) => state.setTastings);
  const editingTasting = useCafeStore((state) => state.editingTasting);
  const setEditingTasting = useCafeStore((state) => state.setEditingTasting);
  const deletingTasting = useCafeStore((state) => state.deletingTasting);
  const setDeletingTasting = useCafeStore((state) => state.setDeletingTasting);
  const searchQuery = useCafeStore((state) => state.searchQuery);
  const setSearchQuery = useCafeStore((state) => state.setSearchQuery);
  const tastingsPerPage = useCafeStore((state) => state.tastingsPerPage);
  const isLoggedIn = useCafeStore((state) => state.isLoggedIn);

  const [showTastingForm, setShowTastingForm] = React.useState(false);
  const [displayedCount, setDisplayedCount] = React.useState(12); // Start with 12 items

  const theme = useTheme();
  const fetchTastings = useCafeStore((state) => state.fetchTastings);

  const handleTastingSubmit = async (formData) => {
    try {
      let result;
      if (editingTasting) {
        // Update existing tasting
        result = await tastingAPI.update(editingTasting._id, formData);
        if (result.success) {
          setTastings((prev) => prev.map((t) => (t._id === editingTasting._id ? result.data : t)));
        }
      } else {
        // Create new tasting
        result = await tastingAPI.create(formData);
        if (result.success) {
          setTastings((prev) => [result.data, ...prev]);
        }
      }

      if (result.success) {
        setShowTastingForm(false);
        setEditingTasting(null);
      }
    } catch (error) {
      console.error('Error saving tasting:', error);
    }
  };

  const handleToggleTastingForm = () => {
    setShowTastingForm((prev) => !prev);
    if (showTastingForm) {
      setEditingTasting(null);
    }
  };

  useEffect(() => {
    fetchTastings(isLoggedIn);
  }, [isLoggedIn, fetchTastings]);

  const handleDeleteTasting = async (tastingToDelete) => {
    try {
      const result = await tastingAPI.delete(tastingToDelete._id);
      if (result.success) {
        setTastings((prev) => prev.filter((t) => t._id !== tastingToDelete._id));
      } else {
        console.error('Delete failed:', result.error);
      }
    } catch (error) {
      console.error('Delete error:', error.message);
    } finally {
      setDeletingTasting(null);
    }
  };

  // Use effect only to trigger delete when deletingTasting changes
  useEffect(() => {
    if (deletingTasting) {
      handleDeleteTasting(deletingTasting);
    }
  }, [deletingTasting]);

  const normalize = (str) =>
    String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  // Filtering logic
  const filteredTastings = (Array.isArray(tastings) ? tastings : []).filter((tasting) => {
    if (!tasting || !tasting._id || tasting._id === 'error') return false;

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
      ...(Array.isArray(tasting.tastingNotes) ? tasting.tastingNotes : []),
      tasting.cafeId?.name,
    ].filter(Boolean);

    const allFields = searchableFields.map(normalize).join(' ');
    return allFields.includes(query);
  });

  // Load More logic
  const currentTastings = filteredTastings.slice(0, displayedCount);
  const hasMoreItems = displayedCount < filteredTastings.length;

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + tastingsPerPage);
  };

  // Reset displayed count when search query changes
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
      <Typography variant="h1" hidden gutterBottom>
        Current User Coffee Tasting
      </Typography>

      <Typography
        variant="h2"
        color="text.primary"
        gutterBottom
        sx={{
          textAlign: 'center',
          mb: 3,
          fontSize: { xs: '1.75rem', sm: '2.125rem' },
        }}
        id="tastings-heading"
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
        {isLoggedIn ? (
          <Button
            variant={showTastingForm ? 'outlined' : 'contained'}
            startIcon={
              showTastingForm ? <CloseIcon aria-hidden="true" /> : <AddIcon aria-hidden="true" />
            }
            onClick={handleToggleTastingForm}
            aria-label={showTastingForm ? 'Close tasting form' : 'Add new coffee tasting'}
            sx={{
              backgroundColor: showTastingForm ? 'transparent' : theme.palette.primary.main,
              color: showTastingForm
                ? theme.palette.primary.main
                : theme.palette.primary.contrastText,
              border: `2px solid ${theme.palette.primary.main}`,
              minWidth: { xs: '7.5rem', sm: '8.75rem' },
              py: 1.5,
              height: 'fit-content',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              whiteSpace: 'nowrap',
              overflow: 'visible',
              textWrap: 'nowrap',
              '&:hover': {
                backgroundColor: showTastingForm
                  ? theme.palette.primary.light
                  : theme.palette.primary.dark,
                color: showTastingForm
                  ? theme.palette.primary.contrastText
                  : theme.palette.primary.contrastText,
              },
            }}
          >
            {showTastingForm ? 'Close' : 'Add Tasting'} {/* ✅ Dynamic text */}
          </Button>
        ) : (
          <Tooltip title="Please log in to add tastings" placement="bottom" arrow>
            <span>
              <Button
                variant="outlined"
                startIcon={<AddIcon aria-hidden="true" />}
                disabled
                aria-label="Add tasting (login required)"
                sx={{
                  minWidth: { xs: '7.5rem', sm: '8.75rem' },
                  opacity: 0.6,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  whiteSpace: 'nowrap',
                  overflow: 'visible',
                  textWrap: 'nowrap',
                }}
              >
                Add Tasting
              </Button>
            </span>
          </Tooltip>
        )}

        <CafeSearchBar
          setSearchQuery={setSearchQuery}
          type="tastings"
          sx={{
            width: { xs: '100%', sm: '50%' },
            minWidth: { xs: 'unset', sm: '200px' },
          }}
        />
      </Box>

      {/* ✅ Alert for non-logged-in users */}
      {!isLoggedIn && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You must be logged in to add coffee tastings. Please log in to share your coffee
          experiences!
        </Alert>
      )}

      {/* ✅ TastingForm modal */}
      {showTastingForm && (
        <Suspense fallback={<LoadingLogo />}>
          <TastingForm
            onSubmit={handleTastingSubmit}
            initialValues={editingTasting || {}}
            onClose={() => {
              setShowTastingForm(false);
              setEditingTasting(null);
            }}
          />
        </Suspense>
      )}

      {filteredTastings.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No tastings found. {searchQuery && 'Try adjusting your search terms.'}
          {!isLoggedIn && ' Please log in to add tastings.'}
        </Alert>
      ) : (
        <Box
          sx={{ width: '100%', maxWidth: '1200px', overflow: 'visible' }}
          role="region"
          aria-labelledby="tastings-heading"
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
            aria-labelledby="tastings-heading"
            aria-label="Coffee tasting cards grid"
          >
            {currentTastings.length === 0 ? (
              <Typography
                variant="body2"
                color="text.primary"
                sx={{ textAlign: 'center', py: 4, gridColumn: '1 / -1' }}
              >
                {filteredTastings.length === 0
                  ? 'No tasting cards to display.'
                  : 'No more items to display.'}
              </Typography>
            ) : (
              currentTastings.map((tasting, index) => (
                <FlipTastingCard
                  key={tasting._id || `tasting-${index}`}
                  tasting={tasting}
                  isLoggedIn={isLoggedIn}
                  setEditingTasting={setEditingTasting}
                  setDeletingTasting={setDeletingTasting}
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
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
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
