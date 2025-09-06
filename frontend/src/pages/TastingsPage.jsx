import React, { useEffect, Suspense } from 'react';
import { useCafeStore } from '../stores/useCafeStore';
import Container from '@mui/material/Container';
import { Box, Typography, Button, Alert, Tooltip, useTheme } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material'; // ✅ ADDED CloseIcon
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
  const currentPage = useCafeStore((state) => state.currentPage);
  const setCurrentPage = useCafeStore((state) => state.setCurrentPage);
  const tastingsPerPage = useCafeStore((state) => state.tastingsPerPage);
  const isLoggedIn = useCafeStore((state) => state.isLoggedIn);

  const [showTastingForm, setShowTastingForm] = React.useState(false);

  const theme = useTheme();
  const fetchTastings = useCafeStore((state) => state.fetchTastings);

  const handleTastingSubmit = async (formData) => {
    try {
      const result = await tastingAPI.create(formData);
      if (result.success) {
        setTastings((prev) => [result.data, ...prev]);
        setShowTastingForm(false);
      }
    } catch (error) {
      console.error('Error creating tasting:', error);
    }
  };

  // ✅ ADDED toggle function
  const handleToggleTastingForm = () => {
    setShowTastingForm((prev) => !prev);
    if (showTastingForm) {
      setEditingTasting(null);
    }
  };

  useEffect(() => {
    fetchTastings(isLoggedIn);
  }, [isLoggedIn, fetchTastings]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, setCurrentPage]);

  // Delete function - called when delete is triggered
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

  // Normalize function
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

  // Pagination logic
  const indexOfLastTasting = currentPage * tastingsPerPage;
  const indexOfFirstTasting = indexOfLastTasting - tastingsPerPage;
  const currentTastings = filteredTastings.slice(indexOfFirstTasting, indexOfLastTasting);
  const totalPages = Math.ceil(filteredTastings.length / tastingsPerPage);

  return (
    <Container
      maxWidth={false}
      sx={{
        display: 'flex',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        flexDirection: 'column',
        alignSelf: 'center',
        p: { xs: 1, sm: 2 }, // ✅ Responsive padding
        overflow: 'visible',
      }}
    >
      <Typography variant="h1" hidden gutterBottom>
        Current User Coffee Tasting
      </Typography>

      <Typography
        variant="h4"
        color="text.primary"
        gutterBottom
        sx={{
          textAlign: 'center',
          mb: 3,
          fontSize: { xs: '1.75rem', sm: '2.125rem' }, // ✅ Responsive font size
        }}
      >
        Coffee Tastings
      </Typography>

      {/* ✅ Updated search box with toggle button */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }, // ✅ Stack on mobile
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' }, // ✅ Full width on mobile
          gap: 2,
          mb: 3,
          px: { xs: 1, sm: 3 }, // ✅ Less padding on mobile
        }}
      >
        {isLoggedIn ? (
          <Button
            variant={showTastingForm ? 'outlined' : 'contained'} // ✅ Dynamic variant
            startIcon={showTastingForm ? <CloseIcon /> : <AddIcon />} // ✅ Dynamic icon
            onClick={handleToggleTastingForm} // ✅ Toggle function
            sx={{
              backgroundColor: showTastingForm ? 'transparent' : theme.palette.primary.main,
              color: showTastingForm
                ? theme.palette.primary.main
                : theme.palette.primary.contrastText,
              border: '2px solid' + theme.palette.primary.main,
              minWidth: { xs: '120px', sm: '140px' }, // ✅ Smaller min width on mobile
              height: 'fit-content', // ✅ Better height management
              fontSize: { xs: '0.875rem', sm: '1rem' }, // ✅ Responsive font size
              whiteSpace: 'nowrap', // ✅ Prevent text wrapping within button
              overflow: 'visible', // ✅ Allow button to expand
              textWrap: 'nowrap', // ✅ Modern CSS for no wrapping
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
                startIcon={<AddIcon />}
                disabled
                sx={{
                  minWidth: { xs: '120px', sm: '140px' }, // ✅ Responsive min width
                  opacity: 0.6,
                  fontSize: { xs: '0.875rem', sm: '1rem' }, // ✅ Responsive font size
                  whiteSpace: 'nowrap', // ✅ Prevent text wrapping
                  overflow: 'visible', // ✅ Allow button to expand
                  textWrap: 'nowrap', // ✅ Modern CSS for no wrapping
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
            width: { xs: '100%', sm: '50%' }, // ✅ Full width on mobile, 50% on larger screens
            minWidth: { xs: 'unset', sm: '200px' }, // ✅ Minimum width for larger screens
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
            open={showTastingForm}
            onClose={() => {
              setShowTastingForm(false);
              setEditingTasting(null);
            }}
            onSubmit={handleTastingSubmit}
            editingTasting={editingTasting}
          />
        </Suspense>
      )}

      {filteredTastings.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No tastings found. {searchQuery && 'Try adjusting your search terms.'}
          {!isLoggedIn && ' Please log in to add tastings.'}
        </Alert>
      ) : (
        <Box sx={{ flex: 1, overflow: 'visible' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(auto-fill, minmax(280px, 1fr))',
                md: 'repeat(auto-fill, minmax(320px, 1fr))', // ✅ Larger cards on desktop
              },
              gap: { xs: 1, sm: 2 }, // ✅ Smaller gap on mobile
              mt: 2,
              padding: { xs: '0 4px 8px 4px', sm: '0 8px 8px 8px' }, // ✅ Less padding on mobile
              overflow: 'visible',
            }}
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
              currentTastings.map((tasting) => (
                <FlipTastingCard
                  key={tasting._id}
                  tasting={tasting}
                  isLoggedIn={isLoggedIn}
                  setEditingTasting={setEditingTasting}
                  setDeletingTasting={setDeletingTasting}
                  sx={{ width: '100%' }}
                />
              ))
            )}
          </Box>

          {totalPages > 1 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' }, // ✅ Stack pagination on mobile
                justifyContent: 'center',
                alignItems: 'center',
                gap: { xs: 1, sm: 0 }, // ✅ Gap on mobile
                mt: 4,
                mb: 2,
                position: 'sticky',
                bottom: 0,
                backgroundColor: theme.palette.background.default,
                py: 2,
                px: { xs: 1, sm: 0 }, // ✅ Horizontal padding on mobile
              }}
            >
              <Tooltip title="Go to previous page" arrow>
                <span>
                  <Button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    variant="outlined"
                    size="small"
                    sx={{
                      mx: { xs: 0, sm: 1 },
                      minWidth: { xs: '70px', sm: '80px' }, // ✅ Smaller buttons on mobile
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }, // ✅ Smaller text on mobile
                    }}
                  >
                    Previous
                  </Button>
                </span>
              </Tooltip>

              <Typography
                variant="body2"
                sx={{
                  mx: { xs: 0, sm: 2 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }, // ✅ Responsive font size
                  textAlign: 'center',
                  minWidth: 'fit-content',
                }}
              >
                Page {currentPage} of {totalPages}
              </Typography>

              <Tooltip title="Go to next page" arrow>
                <span>
                  <Button
                    onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                    disabled={currentPage === totalPages || filteredTastings.length === 0}
                    variant="outlined"
                    size="small"
                    sx={{
                      mx: { xs: 0, sm: 1 },
                      minWidth: { xs: '70px', sm: '80px' }, // ✅ Smaller buttons on mobile
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }, // ✅ Smaller text on mobile
                    }}
                  >
                    Next
                  </Button>
                </span>
              </Tooltip>
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};

export default TastingsPage;
