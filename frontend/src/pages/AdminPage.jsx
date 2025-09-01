import { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Divider } from '@mui/material';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const AdminPage = () => {
  const [cafes, setCafes] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [tastings, setTastings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check admin status from localStorage
  const isAdmin =
    typeof window !== 'undefined' &&
    window.localStorage &&
    localStorage.getItem('admin') === 'true';

  useEffect(() => {
    if (!isAdmin) return;

    const fetchAdminData = async () => {
      try {
        const [cafesRes, submissionsRes, tastingsRes] = await Promise.all([
          fetch(`${API_URL}/cafes`),
          fetch(`${API_URL}/cafeSubmissions`),
          fetch(`${API_URL}/tastings/public`),
        ]);

        // Check if all responses are ok
        if (!cafesRes.ok || !submissionsRes.ok || !tastingsRes.ok) {
          throw new Error('One or more API calls failed');
        }

        const [cafesData, submissionsData, tastingsData] = await Promise.all([
          cafesRes.json(),
          submissionsRes.json(),
          tastingsRes.json(),
        ]);

        setCafes(cafesData.data || []);
        setSubmissions(submissionsData.data || []);
        setTastings(tastingsData.data || []);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="error">
          Access denied. Admins only.
        </Typography>
      </Box>
    );
  }
  if (loading)
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">Loading Approval data...</Typography>
      </Box>
    );

  const handleEditCafe = (cafeId) => {
    // Implement edit cafe logic
  };

  const handleDeleteCafe = (cafeId) => {
    // Implement delete cafe logic
  };

  const handleApproveSubmission = (submissionId) => {
    // Implement approve submission logic
  };
  const handleEditSubmission = (submissionId) => {
    // Implement edit submission logic
  };
  const handleDeleteSubmission = (submissionId) => {
    // Implement delete submission logic
  };

  const handleDeleteTasting = (tastingId) => {
    // Implement delete tasting logic
  };

  return (
    <Box maxWidth="md" mx="auto" mt={4}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Edit Cafes
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {cafes.map((cafe) => (
          <Box key={cafe._id} mb={2} p={2} border={1} borderColor="grey.200" borderRadius={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              {cafe.name}
            </Typography>
            <Typography variant="body2">{cafe.address}</Typography>
            <Typography variant="body2">{cafe.description}</Typography>
            <Typography variant="body2">{cafe.features?.join(', ')}</Typography>
            <Box mt={1}>
              <Button
                variant="outlined"
                size="small"
                sx={{ mr: 1 }}
                onClick={() => handleEditCafe(cafe._id)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDeleteCafe(cafe._id)}
              >
                Delete
              </Button>
            </Box>
          </Box>
        ))}
      </Paper>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Approve/Edit Cafe Submissions
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {submissions.map((sub) => (
          <Box key={sub._id} mb={2} p={2} border={1} borderColor="grey.200" borderRadius={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              {sub.name}
            </Typography>
            <Box mt={1}>
              <Button
                variant="contained"
                color="success"
                size="small"
                sx={{ mr: 1 }}
                onClick={() => handleApproveSubmission(sub._id)}
              >
                Approve
              </Button>
              <Button
                variant="outlined"
                size="small"
                sx={{ mr: 1 }}
                onClick={() => handleEditSubmission(sub._id)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDeleteSubmission(sub._id)}
              >
                Delete
              </Button>
            </Box>
          </Box>
        ))}
      </Paper>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Delete Tasting Notes
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {tastings.map((tasting) => (
          <Box key={tasting._id} mb={2} p={2} border={1} borderColor="grey.200" borderRadius={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              {tasting.cafeName}
            </Typography>
            <Typography variant="body2">{tasting.note}</Typography>
            <Box mt={1}>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDeleteTasting(tasting._id)}
              >
                Delete
              </Button>
            </Box>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default AdminPage;
