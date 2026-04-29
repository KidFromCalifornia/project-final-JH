import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Stack,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import LoginForm from '../components/forms/LoginForm.jsx';
import MuiTheme from '../components/layout/MuiTheme.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const buttonStyles = {
  minWidth: '200px',
  py: 1.5,
  fontSize: '1rem',
  fontWeight: 600,
  borderRadius: 2,
};

const formatValue = (key, value) => {
  if (!value) return null;

  if (Array.isArray(value)) {
    if (key === 'locations') return value.map((l) => l.address).join(', ');
    if (key === 'images') return `${value.length} image(s)`;
    return value.join(', ');
  }

  if (typeof value === 'boolean') {
    return key === 'isApproved' ? (value ? 'Approved' : 'Not Approved') : String(value);
  }

  if (key === 'createdAt') return new Date(value).toLocaleDateString();
  if (key === 'rating') return `${value}/5`;

  return String(value);
};

const ItemCard = ({ item, theme, onEdit, onDelete, onApprove, fields, showApprove }) => (
  <Box mb={2} p={2} border={1} borderColor="grey.200" borderRadius={2}>
    <Typography variant="subtitle1" fontWeight="bold">
      {item.name || item.coffeeName}
    </Typography>

    {fields.map((field) => {
      const value = item[field.key];
      const displayValue = formatValue(field.key, value);
      if (!displayValue) return null;

      return (
        <Typography key={field.key} variant="body2">
          <strong>{field.label}:</strong> {displayValue}
        </Typography>
      );
    })}

    <Box mt={1} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {showApprove && (
        <Button
          variant="contained"
          color="success"
          sx={{ ...buttonStyles, backgroundColor: theme.palette.success.main }}
          onClick={() => onApprove(item._id)}
        >
          Approve
        </Button>
      )}

      {onEdit && (
        <Button
          variant="contained"
          sx={{ ...buttonStyles, backgroundColor: theme.palette.primary.main }}
          onClick={() => onEdit(item)}
        >
          Edit
        </Button>
      )}

      {onDelete && (
        <Button
          variant="contained"
          color="error"
          sx={{ ...buttonStyles, backgroundColor: theme.palette.error.main }}
          onClick={() => onDelete(item._id)}
        >
          Delete
        </Button>
      )}
    </Box>
  </Box>
);

const AdminSection = ({ title, items, emptyMessage, ItemCardProps }) => (
  <Paper elevation={2} sx={{ p: 3, mb: 4, width: '100%' }}>
    <Typography variant="h5" gutterBottom>
      {title}
    </Typography>
    <Divider sx={{ mb: 2 }} />
    {items.length === 0 ? (
      <Typography variant="body2">{emptyMessage}</Typography>
    ) : (
      items.map((item, index) => (
        <ItemCard key={item._id || `${title}-${index}`} item={item} {...ItemCardProps} />
      ))
    )}
  </Paper>
);

const AdminPage = () => {
  const [cafes, setCafes] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [tastings, setTastings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('admin') === 'true');

  const [editingId, setEditingId] = useState(null);
  const [editType, setEditType] = useState(null);
  const [editData, setEditData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const theme = useTheme();

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
    'Content-Type': 'application/json',
  });

  useEffect(() => {
    if (!isAdmin) return;

    const fetchAdminData = async () => {
      try {
        const [cafesRes, submissionsRes, tastingsRes] = await Promise.all([
          fetch(`${API_URL}/cafes`, { headers: getHeaders() }),
          fetch(`${API_URL}/cafeSubmissions`, { headers: getHeaders() }),
          fetch(`${API_URL}/tastings/admin/all`, { headers: getHeaders() }),
        ]);

        const [cafesData, submissionsData, tastingsData] = await Promise.all([
          cafesRes.json(),
          submissionsRes.json(),
          tastingsRes.json(),
        ]);

        setCafes(cafesData?.data ?? []);
        setSubmissions(submissionsData?.data ?? []);
        setTastings(tastingsData?.data ?? []);
      } catch (error) {
        setErrorMessage(`Failed to load admin data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [isAdmin]);

  const createDeleteHandler = (endpoint, itemType, setItems) => {
    return async (itemId) => {
      if (!window.confirm(`Are you sure you want to delete this ${itemType}?`)) return;

      try {
        const res = await fetch(`${API_URL}${endpoint}/${itemId}`, {
          method: 'DELETE',
          headers: getHeaders(),
        });

        if (res.ok) {
          setItems((prev) => prev.filter((item) => item._id !== itemId));
        } else {
          setErrorMessage(`Failed to delete ${itemType}`);
        }
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
  };

  const handleDeleteCafe = createDeleteHandler('/cafes', 'cafe', setCafes);
  const handleDeleteSubmission = createDeleteHandler(
    '/cafeSubmissions',
    'submission',
    setSubmissions
  );
  const handleDeleteTasting = createDeleteHandler('/tastings', 'tasting', setTastings);
  const handleDeleteUser = createDeleteHandler('/users', 'user', setUsers);

  const handleApproveSubmission = async (submissionId) => {
    try {
      const res = await fetch(`${API_URL}/cafeSubmissions/${submissionId}/approve`, {
        method: 'PUT',
        headers: getHeaders(),
      });

      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s._id !== submissionId));
      } else {
        setErrorMessage('Failed to approve submission');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleEditClick = (id, type, data) => {
    setEditingId(id);
    setEditType(type);
    setEditData({ ...data });
  };

  const handleSaveEdit = async () => {
    try {
      let endpoint = '';
      if (editType === 'cafe') endpoint = `/cafes/${editingId}`;
      else if (editType === 'submission') endpoint = `/cafeSubmissions/${editingId}`;
      else if (editType === 'tasting') endpoint = `/tastings/${editingId}`;
      else if (editType === 'user') endpoint = `/users/${editingId}`;

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        setEditingId(null);
        setEditType(null);
        setEditData({});
      } else {
        setErrorMessage('Failed to save changes');
      }
    } catch {
      setErrorMessage('Failed to save changes. Please try again.');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('admin');
      localStorage.removeItem('userToken');
      setIsAdmin(false);
    }
  };

  if (!isAdmin) return <LoginForm setIsAdmin={setIsAdmin} onClose={() => {}} />;

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">Loading admin data...</Typography>
      </Box>
    );
  }

  return (
    <MuiTheme>
      <CssBaseline />
      <Box sx={{ mx: 3, pb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4">Admin Dashboard</Typography>
          <Button onClick={handleLogout} variant="contained" sx={buttonStyles}>
            Logout
          </Button>
        </Box>

        {errorMessage && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography color="error">{errorMessage}</Typography>
            <Button onClick={() => setErrorMessage('')}>Dismiss</Button>
          </Paper>
        )}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box sx={{ gridColumn: '1 / -1' }}>
            <AdminSection
              title="Approve/Edit Cafe Submissions"
              items={submissions}
              emptyMessage="No submissions pending"
              ItemCardProps={{
                theme,
                fields: [
                  { key: '_id', label: 'ID' },
                  { key: 'name', label: 'Name' },
                  { key: 'website', label: 'Website' },
                  { key: 'category', label: 'Category' },
                  { key: 'description', label: 'Description' },
                  { key: 'submittedBy', label: 'Submitted By' },
                  { key: 'createdAt', label: 'Created' },
                  { key: 'features', label: 'Features' },
                  { key: 'locations', label: 'Locations' },
                  { key: 'images', label: 'Images' },
                ],
                showApprove: true,
                onApprove: handleApproveSubmission,
                onEdit: (item) => handleEditClick(item._id, 'submission', item),
                onDelete: handleDeleteSubmission,
              }}
            />
          </Box>

          <AdminSection
            title="Edit Cafes"
            items={cafes}
            emptyMessage="No cafes found"
            ItemCardProps={{
              theme,
              fields: [
                { key: '_id', label: 'ID' },
                { key: 'name', label: 'Name' },
                { key: 'website', label: 'Website' },
                { key: 'category', label: 'Category' },
                { key: 'description', label: 'Description' },
                { key: 'submittedBy', label: 'Submitted By' },
                { key: 'createdAt', label: 'Created' },
                { key: 'features', label: 'Features' },
                { key: 'locations', label: 'Locations' },
                { key: 'images', label: 'Images' },
              ],
              onEdit: (item) => handleEditClick(item._id, 'cafe', item),
              onDelete: handleDeleteCafe,
            }}
          />

          <AdminSection
            title="Tasting Notes"
            items={tastings}
            emptyMessage="No tasting notes found"
            ItemCardProps={{
              theme,
              fields: [
                { key: '_id', label: 'ID' },
                { key: 'cafeId', label: 'Cafe ID' },
                { key: 'grindSize', label: 'Grind Size' },
                { key: 'brewMethod', label: 'Brew Method' },
                { key: 'rating', label: 'Rating' },
                { key: 'flavorNotes', label: 'Flavor Notes' },
                { key: 'userId', label: 'User ID' },
                { key: 'createdAt', label: 'Created' },
              ],
              onEdit: (item) => handleEditClick(item._id, 'tasting', item),
              onDelete: handleDeleteTasting,
            }}
          />
        </Box>
        <Dialog open={!!editingId} onClose={() => setEditingId(null)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              value={editData.name || ''}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingId(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MuiTheme>
  );
};

export default AdminPage;
