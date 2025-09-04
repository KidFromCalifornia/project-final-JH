import TastingForm from '../components/forms/TastingForm';
import { useEffect } from 'react';
import { useCafeStore } from '../stores/useCafeStore';
import Container from '@mui/material/Container';
import { Box, Typography, Button, Alert, Tooltip, useTheme } from '@mui/material';
import CafeSearchBar from '../components/common/CafeSearchBar';
import FlipTastingCard from '../components/common/FlipTastingCard';
import { tastingAPI } from '../services/api';

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

  // Delete logic
  useEffect(() => {
    const deleteTasting = async () => {
      if (!deletingTasting) return;

      try {
        const result = await tastingAPI.delete(deletingTasting._id);
        if (result.success) {
          setTastings((prev) => prev.filter((t) => t._id !== deletingTasting._id));
          console.log('Tasting deleted successfully');
        } else {
          console.error('Delete failed:', result.error);
        }
      } catch (error) {
        console.error('Delete error:', error.message);
      } finally {
        setDeletingTasting(null);
      }
    };

    deleteTasting();
  }, [deletingTasting, setTastings, setDeletingTasting]);

  // Submit logic for both create and edit
  const handleTastingSubmit = async (formData) => {
    try {
      let result;

      if (editingTasting) {
        result = await tastingAPI.update(editingTasting._id, formData);
        if (result.success) {
          setTastings((prev) => prev.map((t) => (t._id === editingTasting._id ? result.data : t)));
          setEditingTasting(null);
          console.log('Tasting updated successfully');
        } else {
          console.error('Update failed:', result.error);
        }
      } else {
        result = await tastingAPI.create(formData);
        if (result.success) {
          setTastings((prev) => [result.data, ...prev]);
          console.log('Tasting created successfully');
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
  const filteredTastings = tastings.filter((tasting) => {
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
      ...(tasting.tastingNotes || []),
      tasting.cafe?.name,
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
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.textMuted?.default,
        color: theme.palette.text.primary,
        flexDirection: { xs: 'column', sm: 'row' },
        marginLeft: '2.75rem',
        marginRight: '0',
        alignSelf: 'center',
      }}
    >
      <Typography variant="h1" hidden gutterBottom>
        Coffee Tasting Page
      </Typography>

      {/* Form Section */}
      <Box
        sx={{
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px',
        }}
      >
        {isLoggedIn ? (
          <TastingForm onSubmit={handleTastingSubmit} initialValues={editingTasting || {}} />
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

      {/* Right Section */}
      <Box
        className="pageRight"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flexGrow: 1,
          width: { xs: '100%', sm: '50%' },
          mt: 2,
          mb: 4,
          px: 1,
        }}
      >
        <CafeSearchBar
          fullWidth
          setSearchQuery={setSearchQuery}
          type="tastings"
          sx={{ width: '100%', minHeight: '56px' }}
        />

        {filteredTastings.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No tastings found. {searchQuery && 'Try adjusting your search terms.'}
          </Alert>
        ) : (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {filteredTastings.length} tasting{filteredTastings.length !== 1 ? 's' : ''} found
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                mt: 2,
              }}
            >
              {currentTastings.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{ textAlign: 'center', py: 4, width: '100%' }}
                >
                  No tasting cards to display.
                </Typography>
              ) : (
                currentTastings.map((tasting) => (
                  <Box
                    key={tasting._id}
                    sx={{
                      flex: '1 1 300px',
                      maxWidth: '300px',
                      display: 'flex',
                    }}
                  >
                    <FlipTastingCard
                      tasting={tasting}
                      isLoggedIn={isLoggedIn}
                      setEditingTasting={setEditingTasting}
                      setDeletingTasting={setDeletingTasting}
                    />
                  </Box>
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
                }}
              >
                <Tooltip title="Go to previous page" arrow>
                  <span>
                    <Button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      variant="outlined"
                      sx={{ mx: 1, minWidth: '100px', minHeight: '40px' }}
                    >
                      Previous
                    </Button>
                  </span>
                </Tooltip>

                <Typography variant="body2" sx={{ mx: 3 }}>
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
                      sx={{ mx: 1, minWidth: '100px', minHeight: '40px' }}
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
