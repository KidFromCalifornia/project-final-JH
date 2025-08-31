import TastingForm from '../components/forms/TastingForm';
import { useCafeStore } from '../stores/useCafeStore';
import { useEffect, useState } from 'react';
import { Container, Box, Typography, List, ListItem, Divider, Button, Alert } from '@mui/material';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const UserPage = () => {
  // Get global state from store
  const tastings = useCafeStore((state) => state.tastings);
  const setTastings = useCafeStore((state) => state.setTastings);
  const editingTasting = useCafeStore((state) => state.editingTasting);
  const setEditingTasting = useCafeStore((state) => state.setEditingTasting);
  const userSubmissions = useCafeStore((state) => state.userSubmissions);
  const setUserSubmissions = useCafeStore((state) => state.setUserSubmissions);
  const isLoggedIn = useCafeStore((state) => state.isLoggedIn);
  const username = useCafeStore((state) => state.username);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserSubmissions = async () => {
      if (isLoggedIn) {
        setLoading(true);
        const res = await fetch(`${API_URL}/cafeSubmissions/my-submissions`, {
          headers: {
            Authorization: `Bearer ${useCafeStore.getState().userToken}`,
          },
        });
        const data = await res.json();
        setUserSubmissions(data.data || []);
        setLoading(false);
      } else {
        setUserSubmissions([]);
      }
    };

    fetchUserSubmissions();
  }, [isLoggedIn, setUserSubmissions]);

  const handleTastingSubmit = (formData) => {
    const method = editingTasting ? 'PUT' : 'POST';
    const url = editingTasting
      ? `${API_URL}/tastings/${editingTasting._id}`
      : `${API_URL}/tastings`;

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${useCafeStore.getState().userToken}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (editingTasting) {
            setTastings((prev) => prev.map((t) => (t._id === editingTasting._id ? data.data : t)));
            setEditingTasting(null);
          } else {
            setTastings((prev) => [data.data, ...prev]);
          }
        } else {
          console.error('Failed to submit tasting:', data.error);
        }
      })
      .catch((error) => console.error('Error submitting tasting:', error));
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography>Loading tastings...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {username ? `${username}'s Page` : 'User Page'}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Your Cafe Submissions
      </Typography>
      {userSubmissions.length === 0 ? (
        <Alert severity="info">No pending submissions.</Alert>
      ) : (
        <List>
          {userSubmissions.map((sub) => (
            <ListItem
              key={sub._id}
              sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {sub.name}
              </Typography>
              <Typography variant="body2">{sub.description}</Typography>
              <Typography variant="caption" color="text.secondary">
                {sub.category} — {sub.isApproved ? 'Approved' : 'Pending'}
              </Typography>
            </ListItem>
          ))}
        </List>
      )}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h5" gutterBottom>
        Whatcha Drinking?
      </Typography>
      {isLoggedIn ? (
        <TastingForm onSubmit={handleTastingSubmit} initialValues={editingTasting || {}} />
      ) : (
        <Alert severity="warning" sx={{ my: 2 }}>
          Please log in to add your own experience
        </Alert>
      )}
      <Divider sx={{ my: 3 }} />
      {tastings.length === 0 ? (
        <Alert severity="info">Nothing to see here 😞</Alert>
      ) : (
        <List>
          {tastings.map((tasting) => (
            <ListItem
              key={tasting._id}
              sx={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                mb: 2,
                borderBottom: '1px solid #eee',
                pb: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {tasting.coffeeName}
              </Typography>
              <Typography variant="body2">
                at <em>{tasting.cafeId?.name}</em>
              </Typography>
              <Typography variant="body2">Rating: {tasting.rating}/5</Typography>
              <Typography variant="body2">{tasting.notes}</Typography>
              <Typography variant="caption" color="text.secondary">
                {tasting.userId?.username} • {new Date(tasting.createdAt).toLocaleDateString()}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                sx={{ mt: 1 }}
                onClick={() => setEditingTasting(tasting)}
              >
                Edit
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default UserPage;
