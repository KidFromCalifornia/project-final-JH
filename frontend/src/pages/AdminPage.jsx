import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Stack,
  Chip,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  MenuItem,
  useTheme,
} from '@mui/material';
import LoginForm from '../components/forms/LoginForm.jsx';
import MuiTheme from '../components/layout/MuiTheme.jsx';
import CafeEditForm, { NEIGHBORHOODS, FEATURES } from '../components/admin/CafeEditForm.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const buttonStyles = {
  minWidth: '120px',
  fontWeight: 600,
};

const formatValue = (key, value) => {
  if (value === null || value === undefined || value === '') return null;

  if (Array.isArray(value)) {
    if (key === 'locations') return value.map((l) => l.address).join(', ');
    if (key === 'images') return `${value.length} image(s)`;
    return value.map((v) => v.replaceAll('_', ' ')).join(', ');
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

    {item.name === 'suggestion' && (
      <Chip label="Suggestion" size="small" color="warning" sx={{ mb: 1, mr: 1 }} />
    )}
    {item.parentCafeId && (
      <Chip label="New location for existing cafe" size="small" color="info" sx={{ mb: 1 }} />
    )}

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

const AdminSection = ({ title, count, items, emptyMessage, ItemCardProps }) => (
  <Paper elevation={2} sx={{ p: 3, mb: 4, width: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <Typography variant="h5">{title}</Typography>
      {count > 0 && <Chip label={count} color="primary" size="small" />}
    </Box>
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

  const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [cafesRes, pendingRes, tastingsRes] = await Promise.all([
          fetch(`${API_URL}/cafes`, { headers: getHeaders() }),
          fetch(`${API_URL}/cafes/pending`, { headers: getHeaders() }),
          fetch(`${API_URL}/tastings/admin/all`, { headers: getHeaders() }),
        ]);

        const [cafesData, pendingData, tastingsData] = await Promise.all([
          cafesRes.json(),
          pendingRes.json(),
          tastingsRes.json(),
        ]);

        setCafes(cafesData?.data ?? []);
        setSubmissions(pendingData?.data ?? []);
        setTastings(tastingsData?.data ?? []);

        if (!pendingRes.ok) setErrorMessage(`Pending fetch failed: ${pendingData?.error ?? pendingRes.status}`);
      } catch (error) {
        setErrorMessage(`Failed to load admin data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (!isAdmin) return;
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
  const handleDeleteSubmission = createDeleteHandler('/cafes', 'submission', setSubmissions);
  const handleDeleteTasting = createDeleteHandler('/tastings', 'tasting', setTastings);

  const handleApproveSubmission = async (submissionId) => {
    try {
      const submission = submissions.find((s) => s._id === submissionId);
      const res = await fetch(`${API_URL}/cafes/${submissionId}/approve`, {
        method: 'PUT',
        headers: getHeaders(),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmissions((prev) => prev.filter((s) => s._id !== submissionId));

        if (submission?.parentCafeId) {
          // Update the existing parent cafe in the list
          setCafes((prev) =>
            prev.map((c) => (c._id === submission.parentCafeId ? data.data : c))
          );
        } else {
          // Add as a new approved cafe
          setCafes((prev) => [...prev, data.data]);
        }
      } else {
        setErrorMessage('Failed to approve cafe');
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
      else if (editType === 'submission') endpoint = `/cafes/${editingId}`;
      else if (editType === 'tasting') endpoint = `/tastings/${editingId}`;

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        const saved = await res.json();
        const updater = (prev) =>
          prev.map((item) => (item._id === editingId ? saved.data : item));

        if (editType === 'cafe') setCafes(updater);
        else if (editType === 'submission') setSubmissions(updater);
        else if (editType === 'tasting') setTastings(updater);

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Admin Dashboard</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={fetchAdminData} variant="outlined" sx={buttonStyles} disabled={loading}>
              {loading ? 'Refreshing…' : 'Refresh'}
            </Button>
            <Button onClick={handleLogout} variant="contained" sx={buttonStyles}>
              Logout
            </Button>
          </Box>
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
              title="Pending Submissions"
              count={submissions.length}
              items={submissions}
              emptyMessage="No submissions pending"
              ItemCardProps={{
                theme,
                fields: [
                  { key: 'name', label: 'Name' },
                  { key: 'category', label: 'Category' },
                  { key: 'description', label: 'Description' },
                  { key: 'locations', label: 'Address' },
                  { key: 'website', label: 'Website' },
                  { key: 'features', label: 'Features' },
                  { key: 'createdAt', label: 'Submitted' },
                ],
                showApprove: true,
                onApprove: handleApproveSubmission,
                onEdit: (item) => handleEditClick(item._id, 'submission', item),
                onDelete: handleDeleteSubmission,
              }}
            />
          </Box>

          <AdminSection
            title="Approved Cafes"
            count={cafes.length}
            items={cafes}
            emptyMessage="No cafes found"
            ItemCardProps={{
              theme,
              fields: [
                { key: 'name', label: 'Name' },
                { key: 'category', label: 'Category' },
                { key: 'description', label: 'Description' },
                { key: 'locations', label: 'Address' },
                { key: 'website', label: 'Website' },
                { key: 'instagram', label: 'Instagram' },
                { key: 'features', label: 'Features' },
                { key: 'createdAt', label: 'Created' },
              ],
              onEdit: (item) => handleEditClick(item._id, 'cafe', item),
              onDelete: handleDeleteCafe,
            }}
          />

          <AdminSection
            title="Tasting Notes"
            count={tastings.length}
            items={tastings}
            emptyMessage="No tasting notes found"
            ItemCardProps={{
              theme,
              fields: [
                { key: 'coffeeName', label: 'Coffee' },
                { key: 'username', label: 'By' },
                { key: 'brewMethod', label: 'Brew Method' },
                { key: 'roastLevel', label: 'Roast' },
                { key: 'rating', label: 'Rating' },
                { key: 'tastingNotes', label: 'Tasting Notes' },
                { key: 'notes', label: 'Notes' },
                { key: 'createdAt', label: 'Created' },
              ],
              onEdit: (item) => handleEditClick(item._id, 'tasting', item),
              onDelete: handleDeleteTasting,
            }}
          />
        </Box>

        <Dialog open={!!editingId} onClose={() => setEditingId(null)} maxWidth="md" fullWidth>
          <DialogTitle>Edit {editType}</DialogTitle>
          <DialogContent>
            {(editType === 'cafe' || editType === 'submission') && (
              <CafeEditForm editData={editData} setEditData={setEditData} />
            )}
            {editType === 'tasting' && (
              <Stack spacing={2}>
                <TextField
      variant="filled"
                  fullWidth
                  label="Coffee Name"
                  value={editData.coffeeName || ''}
                  onChange={(e) => setEditData({ ...editData, coffeeName: e.target.value })}
                />
                <TextField
      variant="filled"
                  fullWidth
                  label="Rating"
                  type="number"
                  inputProps={{ min: 1, max: 5 }}
                  value={editData.rating || ''}
                  onChange={(e) => setEditData({ ...editData, rating: e.target.value })}
                />
                <TextField
      variant="filled"
                  fullWidth
                  multiline
                  rows={3}
                  label="Notes"
                  value={editData.notes || ''}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                />
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingId(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MuiTheme>
  );
};

export default AdminPage;
