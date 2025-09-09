import React, { useEffect, useState, Suspense } from 'react';
import { useCafeStore } from '../stores/useCafeStore';
import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  Button,
  Alert,
  Tooltip,
  useTheme,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, Store as StoreIcon } from '@mui/icons-material';
import CafeSearchBar from '../components/common/CafeSearchBar';
import FlipTastingCard from '../components/common/FlipTastingCard';
import { tastingAPI } from '../services/api';
import LoadingLogo from '../components/common/LoadingLogo';

// Lazy load forms
const TastingForm = React.lazy(() => import('../components/forms/TastingForm'));
const MiniCafeForm = React.lazy(() => import('../components/forms/NewCafeForm'));

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const UserPage = () => {
  const theme = useTheme();

  // Get global state from store
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
  const userSubmissions = useCafeStore((state) => state.userSubmissions);
  const setUserSubmissions = useCafeStore((state) => state.setUserSubmissions);
  const isLoggedIn = useCafeStore((state) => state.isLoggedIn);
  const username = useCafeStore((state) => state.username);
  const fetchTastings = useCafeStore((state) => state.fetchTastings);

  const [loading, setLoading] = useState(false);
  const [showTastingForm, setShowTastingForm] = useState(false);
  const [showCafeForm, setShowCafeForm] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleToggleCafeForm = () => {
    setShowCafeForm((prev) => !prev);
  };

  // Fetch user submissions
  useEffect(() => {
    const fetchUserSubmissions = async () => {
      if (isLoggedIn) {
        setLoading(true);
        try {
          const res = await fetch(`${API_URL}/cafeSubmissions/my-submissions`, {
            headers: {
              Authorization: `Bearer ${useCafeStore.getState().userToken}`,
            },
          });

          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }

          const data = await res.json();
          setUserSubmissions(data.data || []);
        } catch (error) {
          console.error('Error fetching user submissions:', error);
          setUserSubmissions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setUserSubmissions([]);
      }
    };

    fetchUserSubmissions();
  }, [isLoggedIn, setUserSubmissions]);

  const handleCafeSubmit = async (formData) => {
    try {
      const res = await fetch(`${API_URL}/cafeSubmissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${useCafeStore.getState().userToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowCafeForm(false);
        // Refresh submissions list
        const updatedRes = await fetch(`${API_URL}/cafeSubmissions/my-submissions`, {
          headers: { Authorization: `Bearer ${useCafeStore.getState().userToken}` },
        });
        const updatedData = await updatedRes.json();
        setUserSubmissions(updatedData.data || []);
      }
    } catch (error) {
      console.error('Error submitting cafe:', error);
    }
  };

  // Fetch tastings
  useEffect(() => {
    fetchTastings(isLoggedIn);
  }, [isLoggedIn, fetchTastings]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, setCurrentPage]);

  // Handle tasting form submission
  const handleTastingSubmit = async (formData) => {
    try {
      let result;
      if (editingTasting) {
        const res = await fetch(`${API_URL}/tastings/${editingTasting._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${useCafeStore.getState().userToken}`,
          },
          body: JSON.stringify(formData),
        });
        result = await res.json();
        if (result.success) {
          setTastings((prev) => prev.map((t) => (t._id === editingTasting._id ? result.data : t)));
          setEditingTasting(null);
        }
      } else {
        result = await tastingAPI.create(formData);
        if (result.success) {
          setTastings((prev) => [result.data, ...prev]);
        }
      }

      if (result.success) {
        setShowTastingForm(false);
      }
    } catch (error) {
      console.error('Error submitting tasting:', error);
    }
  };

  // Toggle tasting form
  const handleToggleTastingForm = () => {
    setShowTastingForm((prev) => !prev);
    if (showTastingForm) {
      setEditingTasting(null);
    }
  };

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

  useEffect(() => {
    if (deletingTasting) {
      handleDeleteTasting(deletingTasting);
    }
  }, [deletingTasting]);

  // Handle edit tasting
  const handleEditTasting = (tasting) => {
    setEditingTasting(tasting);
    setShowTastingForm(true);
    setActiveTab(1);
  };

  const normalize = (str) =>
    String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  // Filter tastings to show only user's tastings
  const userTastings = (Array.isArray(tastings) ? tastings : []).filter((tasting) => {
    if (!tasting || !tasting._id || tasting._id === 'error') return false;

    if (isLoggedIn && tasting.userId && typeof tasting.userId === 'object') {
      return tasting.userId.username === username;
    }

    return false;
  });

  // Apply search filter to user tastings
  const filteredTastings = userTastings.filter((tasting) => {
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

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 1) {
      setSearchQuery('');
    }
  };

  if (loading) {
    return <LoadingLogo />;
  }

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
        p: 2,
        overflow: 'visible',
      }}
    >
      {/* Screen reader accessible H1 */}
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
        Your Dashboard
      </Typography>

      <Tooltip
        title="Your personal dashboard for managing cafe submissions and coffee tasting notes"
        arrow
      >
        <Typography
          variant="h4"
          color="text.primary"
          gutterBottom
          sx={{ textAlign: 'center', mb: 3, cursor: 'help' }}
        >
          {username ? `${username}'s Dashboard` : 'User Dashboard'}
        </Typography>
      </Tooltip>

      {!isLoggedIn ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please log in to view your dashboard and manage your coffee tastings.
        </Alert>
      ) : (
        <>
          {/* Navigation Tabs - ✅ Fixed */}
          <Paper elevation={1} sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              color="primary"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 48,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderBottom: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    color: theme.palette.text.primary,
                  },
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 700,
                    boxShadow: theme.shadows[2],
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  },
                },
                '& .MuiTabs-indicator': {
                  display: 'none', // Hide the default indicator since we're using background colors
                },
              }}
            >
              <Tooltip title="View and manage your cafe submissions for review" arrow>
                <Tab
                  label={`Cafe Submissions (${userSubmissions?.length || 0})`}
                  aria-label={`Cafe Submissions (${userSubmissions?.length || 0})`}
                />
              </Tooltip>

              <Tooltip title="View and manage your coffee tasting notes" arrow>
                <Tab
                  label={`My Tastings (${filteredTastings?.length || 0})`}
                  aria-label={`My Tastings (${filteredTastings?.length || 0})`}
                />
              </Tooltip>
            </Tabs>
          </Paper>

          {/* Tab Content */}
          {activeTab === 0 && (
            <Box>
              {/* Action Bar for Cafe Submissions */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                  mb: 3,
                }}
              >
                <Tooltip title="Cafes you've submitted for review will appear below" arrow>
                  <Typography variant="h5" sx={{ mb: 0, cursor: 'help' }}>
                    Your Cafe Submissions
                  </Typography>
                </Tooltip>

                <Tooltip
                  title="Submit a new cafe for review by the Stockholm Coffee Club community"
                  arrow
                >
                  <Button
                    variant={showCafeForm ? 'outlined' : 'contained'}
                    startIcon={showCafeForm ? <CloseIcon /> : <StoreIcon />}
                    onClick={handleToggleCafeForm}
                    sx={{
                      backgroundColor: showCafeForm ? 'transparent' : theme.palette.primary.main,
                      color: showCafeForm
                        ? theme.palette.primary.secondary
                        : theme.palette.primary.contrastText,
                      border: `2px solid ${theme.palette.primary.main}`,
                      minWidth: { xs: '7.5rem', sm: '8.75rem' },
                      whiteSpace: 'nowrap',
                      overflow: 'visible',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&:hover': {
                        backgroundColor: showCafeForm
                          ? theme.palette.primary.light
                          : theme.palette.primary.secondary,
                        color: theme.palette.primary.contrastText,
                      },
                    }}
                  >
                    {showCafeForm ? 'Close Form' : 'Submit New Cafe'}
                  </Button>
                </Tooltip>
              </Box>

              {/* Cafe Form */}
              {showCafeForm && (
                <Tooltip title="Fill out all required fields to submit a new cafe for review" arrow>
                  <Box sx={{ mb: 4 }}>
                    <Suspense fallback={<LoadingLogo />}>
                      <MiniCafeForm onSubmit={handleCafeSubmit} />
                    </Suspense>
                  </Box>
                </Tooltip>
              )}

              {/* Submissions List */}
              {userSubmissions.length === 0 ? (
                <Tooltip
                  title="New cafe submissions will be reviewed by the Stockholm Coffee Club team"
                  arrow
                >
                  <Alert severity="info">
                    {showCafeForm
                      ? 'Fill out the form above to submit a new cafe for review.'
                      : "No cafe submissions yet. Click 'Submit New Cafe' to add one!"}
                  </Alert>
                </Tooltip>
              ) : (
                <List role="list" aria-label="User submissions">
                  {userSubmissions.map((sub, index) => (
                    <Tooltip
                      key={sub._id || `submission-${index}`}
                      title={`${sub.isApproved ? 'This cafe has been approved and added to the map' : 'This submission is being reviewed by our team'}`}
                      arrow
                    >
                      <ListItem
                        role="listitem"
                        aria-label={`Submission: ${sub.name} - ${sub.isApproved ? 'Approved' : 'Pending Review'}`}
                        sx={{
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          mb: 2,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: 1,
                          border: `1px solid ${theme.palette.divider}`,
                          cursor: 'help',
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          {sub.name}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {sub.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                          {sub.category} • Status:{' '}
                          {sub.isApproved ? '✅ Approved' : '⏳ Pending Review'}
                        </Typography>
                      </ListItem>
                    </Tooltip>
                  ))}
                </List>
              )}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              {/* Action Bar */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                  mb: 3,
                  px: 3,
                }}
              >
                <Tooltip
                  title={
                    editingTasting
                      ? 'Close form to stop editing'
                      : 'Add a new coffee tasting experience'
                  }
                  arrow
                >
                  <Button
                    variant={showTastingForm ? 'outlined' : 'contained'}
                    startIcon={showTastingForm ? <CloseIcon /> : <AddIcon />}
                    onClick={handleToggleTastingForm}
                    sx={{
                      backgroundColor: showTastingForm ? 'transparent' : theme.palette.primary.main,
                      color: showTastingForm
                        ? theme.palette.secondary.main
                        : theme.palette.primary.contrastText,
                      border: `2px solid ${theme.palette.primary.main}`,
                      minWidth: { xs: '7.5rem', sm: '8.75rem' },
                      whiteSpace: 'nowrap',
                      overflow: 'visible',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      '&:hover': {
                        backgroundColor: showTastingForm
                          ? theme.palette.primary.light
                          : theme.palette.primary.secondary,
                        color: theme.palette.primary.contrastText,
                      },
                    }}
                  >
                    {showTastingForm ? 'Close Form' : 'Add New Tasting'}
                  </Button>
                </Tooltip>

                <Tooltip
                  title="Search through your tasting notes by coffee name, roaster, origin, brewing method, or flavor notes"
                  arrow
                >
                  <CafeSearchBar
                    setSearchQuery={setSearchQuery}
                    type="tastings"
                    sx={{ width: '100%' }}
                  />
                </Tooltip>
              </Box>

              {/* Tasting Form */}
              {showTastingForm && (
                <Tooltip
                  title={
                    editingTasting
                      ? 'Update your tasting notes and click save'
                      : 'Record your coffee tasting experience with detailed notes'
                  }
                  arrow
                >
                  <Box sx={{ mb: 4 }}>
                    <Suspense fallback={<LoadingLogo />}>
                      <TastingForm
                        onSubmit={handleTastingSubmit}
                        initialValues={editingTasting || {}}
                      />
                    </Suspense>
                  </Box>
                </Tooltip>
              )}

              {/* Tastings Display */}
              {filteredTastings.length === 0 ? (
                <Tooltip
                  title="Start documenting your coffee experiences by adding tasting notes"
                  arrow
                >
                  <Alert severity="info" sx={{ mt: 2 }}>
                    {searchQuery
                      ? `No tastings found matching "${searchQuery}". Try adjusting your search terms.`
                      : "You haven't added any coffee tastings yet. Click 'Add New Tasting' to get started!"}
                  </Alert>
                </Tooltip>
              ) : (
                <Box sx={{ flex: 1, overflow: 'visible' }}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(auto-fill, minmax(280px, 1fr))',
                      },
                      gap: 2,
                      mt: 2,
                      padding: '0 0.5rem 0.5rem 0.5rem',
                      overflow: 'visible',
                    }}
                  >
                    {currentTastings.length === 0 ? (
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{ textAlign: 'center', py: 4, gridColumn: '1 / -1' }}
                      >
                        No tastings to display for this page.
                      </Typography>
                    ) : (
                      currentTastings.map((tasting, index) => (
                        <FlipTastingCard
                          key={tasting._id || `tasting-${index}`}
                          tasting={tasting}
                          isLoggedIn={isLoggedIn}
                          setEditingTasting={handleEditTasting}
                          setDeletingTasting={setDeletingTasting}
                          sx={{ width: '100%' }}
                        />
                      ))
                    )}
                  </Box>

                  {/* Pagination */}
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

                      <Tooltip
                        title={`Showing ${filteredTastings.length} total tastings across ${totalPages} pages`}
                        arrow
                      >
                        <Typography variant="body2" sx={{ mx: 2, cursor: 'help' }}>
                          Page {currentPage} of {totalPages}
                        </Typography>
                      </Tooltip>

                      <Tooltip title="Go to next page" arrow>
                        <span>
                          <Button
                            onClick={() =>
                              setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
                            }
                            disabled={currentPage === totalPages}
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
          )}
        </>
      )}
    </Container>
  );
};

export default UserPage;
