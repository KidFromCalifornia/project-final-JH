import React, { useEffect, Suspense } from 'react';
import { useCafeStore } from '../stores/useCafeStore';
import Container from '@mui/material/Container';
import { Box, Typography, Button, Alert, Tooltip, useTheme } from '@mui/material';
import CafeSearchBar from '../components/common/CafeSearchBar';
import FlipTastingCard from '../components/common/FlipTastingCard';
import LoadingLogo from '../components/common/LoadingLogo';
import { tastingAPI } from '../services/api';

// Lazy load TastingForm for better performance
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

  const theme = useTheme();
  const fetchTastings = useCafeStore((state) => state.fetchTastings);

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

  // Submit logic for both create and edit
  const handleTastingSubmit = async (formData) => {
    try {
      let result;

      if (editingTasting) {
        result = await tastingAPI.update(editingTasting._id, formData);
        if (result.success) {
          setTastings((prev) => prev.map((t) => (t._id === editingTasting._id ? result.data : t)));
          setEditingTasting(null);
        } else {
          console.error('Update failed:', result.error);
        }
      } else {
        result = await tastingAPI.create(formData);
        if (result.success) {
          setTastings((prev) => [result.data, ...prev]);
        } else {
          console.error('Create failed:', result.error);
        }
      }
    } catch (error) {
      console.error('Submit error:', error.message);
    }
  };

  // Normalize function
  const normalize = (str) =>
    String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  // Filtering logic - SINGLE VERSION ONLY
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
      tasting.cafeId?.name, // Changed from cafe?.name to cafeId?.name to match FlipTastingCard
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
        backgroundColor: theme.palette.textMuted?.default,
        color: theme.palette.text.primary,
        flexDirection: { xs: 'column', sm: 'row' },
        alignSelf: 'center',
        p: 0,
      }}
    >
      <Typography variant="h1" hidden gutterBottom>
        Coffee Tasting Page
      </Typography>

      {/* Form Section */}
      <Box
        sx={{
          width: { xs: '100%', sm: '50%' },
          maxHeight: { xs: 'auto', sm: '100vh' },
          overflowY: { xs: 'visible', sm: 'auto' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px',
        }}
      >
        {isLoggedIn ? (
          <Suspense fallback={<LoadingLogo />}>
            <TastingForm onSubmit={handleTastingSubmit} initialValues={editingTasting || {}} />
          </Suspense>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="text.primary" gutterBottom>
              Share Your Coffee Experience
            </Typography>
            <Typography variant="body1" color="text.primary">
              Please log in to add your own tasting notes and experiences
            </Typography>
          </Box>
        )}
      </Box>

      {/* Right Section - Results */}
      <Box
        className="pageRight"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          width: { xs: '100%', sm: '50%' },
          maxHeight: { xs: 'auto', sm: '100vh' },
          overflowY: { xs: 'visible', sm: 'auto' },
          mt: { xs: 2, sm: 0 },
          mb: { xs: 8, sm: 0 },
          px: 2,
          py: 2,
        }}
      >
        <CafeSearchBar
          fullWidth
          setSearchQuery={setSearchQuery}
          type="tastings"
          sx={{ width: '100%', minHeight: '56px', mb: 2 }}
        />

        {filteredTastings.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No tastings found. {searchQuery && 'Try adjusting your search terms.'}
          </Alert>
        ) : (
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {filteredTastings.length} tasting{filteredTastings.length !== 1 ? 's' : ''} found
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(auto-fill, minmax(280px, 1fr))',
                },
                gap: 2,
                mt: 2,
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
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: 4,
                  mb: 2,
                  position: 'sticky',
                  bottom: 0,
                  backgroundColor: theme.palette.background.default,
                  py: 2,
                }}
              >
                <Tooltip title="Go to previous page" arrow>
                  <span>
                    <Button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      variant="outlined"
                      size="small"
                      sx={{ mx: 1, minWidth: '80px' }}
                    >
                      Previous
                    </Button>
                  </span>
                </Tooltip>

                <Typography variant="body2" sx={{ mx: 2 }}>
                  Page {currentPage} of {totalPages}
                </Typography>

                <Tooltip title="Go to next page" arrow>
                  <span>
                    <Button
                      onClick={() =>
                        setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
                      }
                      disabled={currentPage === totalPages || filteredTastings.length === 0}
                      variant="outlined"
                      size="small"
                      sx={{ mx: 1, minWidth: '80px' }}
                    >
                      Next
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default TastingsPage;
