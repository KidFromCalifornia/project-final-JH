import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Chip,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Collapse,
  Tabs,
  Tab,
  Badge,
  Switch,
  FormControlLabel,
  useTheme,
} from '@mui/material';
import LoginForm from '../components/forms/LoginForm.jsx';
import MuiTheme from '../components/layout/MuiTheme.jsx';
import CafeEditForm from '../components/admin/CafeEditForm.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const formatValue = (key, value) => {
  if (value === null || value === undefined || value === '') return null;
  if (Array.isArray(value)) {
    if (key === 'locations') return value.map((l) => l.address).join(', ');
    if (key === 'images') return `${value.length} image(s)`;
    return value.map((v) => v.replaceAll('_', ' ')).join(', ');
  }
  if (typeof value === 'boolean') return key === 'isApproved' ? (value ? 'Approved' : 'Not Approved') : String(value);
  if (key === 'createdAt') return new Date(value).toLocaleDateString();
  return String(value);
};

const ItemCard = ({ item, theme, onEdit, onDelete, onApprove, fields, showApprove }) => (
  <Box mb={2} p={2} border={1} borderColor="divider" borderRadius={2}>
    <Typography variant="subtitle1" fontWeight="bold">{item.name || item.coffeeName || item.message}</Typography>
    {item.parentCafeId && <Chip label="New location for existing cafe" size="small" color="info" sx={{ mb: 1 }} />}
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
        <Button variant="contained" color="success" size="small" onClick={() => onApprove(item._id)}>Approve</Button>
      )}
      {onEdit && (
        <Button variant="contained" size="small" onClick={() => onEdit(item)}>Edit</Button>
      )}
      {onDelete && (
        <Button variant="contained" color="error" size="small" onClick={() => onDelete(item._id)}>Delete</Button>
      )}
    </Box>
  </Box>
);

const AdminPage = () => {
  const [cafes, setCafes] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [tastings, setTastings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('admin') === 'true');
  const [editingId, setEditingId] = useState(null);
  const [editType, setEditType] = useState(null);
  const [editData, setEditData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [newAlert, setNewAlert] = useState({ message: '', severity: 'info', expiresAt: '' });
  const [showAlertForm, setShowAlertForm] = useState(false);

  const theme = useTheme();

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
    'Content-Type': 'application/json',
  });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [cafesRes, pendingRes, tastingsRes, alertsRes] = await Promise.all([
        fetch(`${API_URL}/cafes`, { headers: getHeaders() }),
        fetch(`${API_URL}/cafes/pending`, { headers: getHeaders() }),
        fetch(`${API_URL}/tastings/admin/all`, { headers: getHeaders() }),
        fetch(`${API_URL}/alerts/all`, { headers: getHeaders() }),
      ]);
      const [cafesData, pendingData, tastingsData, alertsData] = await Promise.all([
        cafesRes.json(), pendingRes.json(), tastingsRes.json(), alertsRes.json(),
      ]);
      setCafes(cafesData?.data ?? []);
      setSubmissions(pendingData?.data ?? []);
      setTastings(tastingsData?.data ?? []);
      setAlerts(alertsData?.data ?? []);
      if (!pendingRes.ok) setErrorMessage(`Pending fetch failed: ${pendingData?.error ?? pendingRes.status}`);
    } catch (error) {
      setErrorMessage(`Failed to load admin data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (isAdmin) fetchAdminData(); }, [isAdmin]);

  const createDeleteHandler = (endpoint, itemType, setItems) => async (itemId) => {
    if (!window.confirm(`Delete this ${itemType}?`)) return;
    try {
      const res = await fetch(`${API_URL}${endpoint}/${itemId}`, { method: 'DELETE', headers: getHeaders() });
      if (res.ok) setItems((prev) => prev.filter((item) => item._id !== itemId));
      else setErrorMessage(`Failed to delete ${itemType}`);
    } catch (error) { setErrorMessage(error.message); }
  };

  const handleDeleteCafe = createDeleteHandler('/cafes', 'cafe', setCafes);
  const handleDeleteSubmission = createDeleteHandler('/cafes', 'submission', setSubmissions);
  const handleDeleteTasting = createDeleteHandler('/tastings', 'tasting', setTastings);
  const handleDeleteAlert = createDeleteHandler('/alerts', 'alert', setAlerts);

  const handleApproveSubmission = async (submissionId) => {
    try {
      const submission = submissions.find((s) => s._id === submissionId);
      const res = await fetch(`${API_URL}/cafes/${submissionId}/approve`, { method: 'PUT', headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setSubmissions((prev) => prev.filter((s) => s._id !== submissionId));
        if (submission?.parentCafeId) setCafes((prev) => prev.map((c) => (c._id === submission.parentCafeId ? data.data : c)));
        else setCafes((prev) => [...prev, data.data]);
      } else setErrorMessage('Failed to approve cafe');
    } catch (error) { setErrorMessage(error.message); }
  };

  const handleEditClick = (id, type, data) => { setEditingId(id); setEditType(type); setEditData({ ...data }); };

  const handleSaveEdit = async () => {
    try {
      const endpoint = editType === 'tasting' ? `/tastings/${editingId}`
        : editType === 'alert' ? `/alerts/${editingId}`
        : `/cafes/${editingId}`;
      const res = await fetch(`${API_URL}${endpoint}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(editData) });
      if (res.ok) {
        const saved = await res.json();
        const updater = (prev) => prev.map((item) => (item._id === editingId ? saved.data : item));
        if (editType === 'cafe') setCafes(updater);
        else if (editType === 'submission') setSubmissions(updater);
        else if (editType === 'tasting') setTastings(updater);
        else if (editType === 'alert') setAlerts(updater);
        setEditingId(null); setEditType(null); setEditData({});
      } else setErrorMessage('Failed to save changes');
    } catch { setErrorMessage('Failed to save changes. Please try again.'); }
  };

  const handleCreateAlert = async () => {
    try {
      const body = { ...newAlert, expiresAt: newAlert.expiresAt || null };
      const res = await fetch(`${API_URL}/alerts`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) });
      if (res.ok) {
        const data = await res.json();
        setAlerts((prev) => [data.data, ...prev]);
        setNewAlert({ message: '', severity: 'info', expiresAt: '' });
        setShowAlertForm(false);
      } else setErrorMessage('Failed to create alert');
    } catch (error) { setErrorMessage(error.message); }
  };

  const handleLogout = () => {
    if (window.confirm('Logout?')) { localStorage.removeItem('admin'); localStorage.removeItem('userToken'); setIsAdmin(false); }
  };

  if (!isAdmin) return <LoginForm setIsAdmin={setIsAdmin} onClose={() => {}} />;
  if (loading) return <Box textAlign="center" mt={4}><Typography variant="h6">Loading…</Typography></Box>;

  const TABS = [
    { label: 'Submissions', badge: submissions.length },
    { label: 'Cafes', badge: null },
    { label: 'Tastings', badge: null },
    { label: 'Alerts', badge: alerts.filter((a) => a.isActive).length },
  ];

  return (
    <MuiTheme>
      <CssBaseline />
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 3, pb: 6 }}>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3 }}>
          <Typography variant="h4" fontWeight={700}>Admin</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={fetchAdminData} variant="outlined" disabled={loading} size="small">
              {loading ? 'Refreshing…' : 'Refresh'}
            </Button>
            <Button onClick={handleLogout} variant="contained" size="small">Logout</Button>
          </Box>
        </Box>

        {errorMessage && (
          <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.light' }}>
            <Typography color="error.contrastText">{errorMessage}</Typography>
            <Button size="small" onClick={() => setErrorMessage('')}>Dismiss</Button>
          </Paper>
        )}

        {/* Tabs */}
        <Paper elevation={2} sx={{ mb: 3 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                minWidth: 0,
                flex: 1,
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                py: 2,
              },
            }}
          >
            {TABS.map((t, i) => (
              <Tab
                key={t.label}
                label={
                  t.badge ? (
                    <Badge badgeContent={t.badge} color={i === 0 ? 'error' : 'primary'} sx={{ pr: 1.5 }}>
                      {t.label}
                    </Badge>
                  ) : t.label
                }
              />
            ))}
          </Tabs>
        </Paper>

        {/* Tab: Submissions */}
        {tab === 0 && (
          <Box>
            {submissions.length === 0 ? (
              <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>No pending submissions</Typography>
            ) : (
              submissions.map((item, i) => (
                <ItemCard key={item._id || i} item={item} theme={theme}
                  fields={[
                    { key: 'name', label: 'Name' }, { key: 'category', label: 'Category' },
                    { key: 'description', label: 'Description' }, { key: 'locations', label: 'Address' },
                    { key: 'website', label: 'Website' }, { key: 'features', label: 'Features' },
                    { key: 'createdAt', label: 'Submitted' },
                  ]}
                  showApprove onApprove={handleApproveSubmission}
                  onEdit={(item) => handleEditClick(item._id, 'submission', item)}
                  onDelete={handleDeleteSubmission}
                />
              ))
            )}
          </Box>
        )}

        {/* Tab: Cafes */}
        {tab === 1 && (
          <Box>
            {cafes.length === 0 ? (
              <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>No cafes</Typography>
            ) : (
              cafes.map((item, i) => (
                <ItemCard key={item._id || i} item={item} theme={theme}
                  fields={[
                    { key: 'category', label: 'Category' }, { key: 'locations', label: 'Address' },
                    { key: 'website', label: 'Website' }, { key: 'instagram', label: 'Instagram' },
                    { key: 'features', label: 'Features' }, { key: 'createdAt', label: 'Created' },
                  ]}
                  onEdit={(item) => handleEditClick(item._id, 'cafe', item)}
                  onDelete={handleDeleteCafe}
                />
              ))
            )}
          </Box>
        )}

        {/* Tab: Tastings */}
        {tab === 2 && (
          <Box>
            {tastings.length === 0 ? (
              <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>No tastings</Typography>
            ) : (
              tastings.map((item, i) => (
                <ItemCard key={item._id || i} item={item} theme={theme}
                  fields={[
                    { key: 'username', label: 'By' }, { key: 'coffeeRoaster', label: 'Roaster' },
                    { key: 'coffeeOrigin', label: 'Origin' }, { key: 'brewMethod', label: 'Brew' },
                    { key: 'roastLevel', label: 'Roast' }, { key: 'tastingNotes', label: 'Notes' },
                    { key: 'createdAt', label: 'Created' },
                  ]}
                  onEdit={(item) => handleEditClick(item._id, 'tasting', item)}
                  onDelete={handleDeleteTasting}
                />
              ))
            )}
          </Box>
        )}

        {/* Tab: Alerts */}
        {tab === 3 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button variant="contained" size="small" onClick={() => setShowAlertForm((v) => !v)}>
                {showAlertForm ? 'Cancel' : '+ New Alert'}
              </Button>
            </Box>

            <Collapse in={showAlertForm}>
              <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} mb={2}>New Alert</Typography>
                <Stack spacing={2}>
                  <TextField fullWidth variant="filled" label="Message" multiline rows={2}
                    value={newAlert.message} onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })} />
                  <TextField fullWidth variant="filled" select label="Severity"
                    value={newAlert.severity} onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value })}>
                    {['info', 'success', 'warning', 'error'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </TextField>
                  <TextField fullWidth variant="filled" label="Expires At (optional)" type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    value={newAlert.expiresAt} onChange={(e) => setNewAlert({ ...newAlert, expiresAt: e.target.value })} />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="contained" onClick={handleCreateAlert} disabled={!newAlert.message.trim()}>Create</Button>
                    <Button onClick={() => setShowAlertForm(false)}>Cancel</Button>
                  </Box>
                </Stack>
              </Paper>
            </Collapse>

            {alerts.length === 0 ? (
              <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>No alerts</Typography>
            ) : (
              alerts.map((item, i) => (
                <ItemCard key={item._id || i} item={item} theme={theme}
                  fields={[
                    { key: 'severity', label: 'Type' },
                    { key: 'isActive', label: 'Active' },
                    { key: 'expiresAt', label: 'Expires' },
                    { key: 'createdAt', label: 'Created' },
                  ]}
                  onEdit={(item) => handleEditClick(item._id, 'alert', item)}
                  onDelete={handleDeleteAlert}
                />
              ))
            )}
          </Box>
        )}

        {/* Edit dialog */}
        <Dialog open={!!editingId} onClose={() => setEditingId(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ textTransform: 'capitalize' }}>Edit {editType}</DialogTitle>
          <DialogContent>
            {(editType === 'cafe' || editType === 'submission') && (
              <CafeEditForm editData={editData} setEditData={setEditData} />
            )}
            {editType === 'tasting' && (
              <Stack spacing={2} sx={{ pt: 1 }}>
                <TextField variant="filled" fullWidth label="Coffee Name" value={editData.coffeeName || ''}
                  onChange={(e) => setEditData({ ...editData, coffeeName: e.target.value })} />
                <TextField variant="filled" fullWidth label="Roaster" value={editData.coffeeRoaster || ''}
                  onChange={(e) => setEditData({ ...editData, coffeeRoaster: e.target.value })} />
                <TextField variant="filled" fullWidth label="Country of Origin" value={editData.coffeeOrigin || ''}
                  onChange={(e) => setEditData({ ...editData, coffeeOrigin: e.target.value })} />
                <TextField variant="filled" fullWidth label="Region" value={editData.coffeeOriginRegion || ''}
                  onChange={(e) => setEditData({ ...editData, coffeeOriginRegion: e.target.value })} />
                <TextField variant="filled" fullWidth select label="Brew Method" value={editData.brewMethod || ''}
                  onChange={(e) => setEditData({ ...editData, brewMethod: e.target.value })}>
                  {['espresso', 'filtered coffee', 'pour over', 'other'].map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </TextField>
                <TextField variant="filled" fullWidth select label="Roast Level" value={editData.roastLevel || ''}
                  onChange={(e) => setEditData({ ...editData, roastLevel: e.target.value })}>
                  <MenuItem value="">—</MenuItem>
                  {['light', 'medium', 'dark'].map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </TextField>
                <TextField variant="filled" fullWidth select label="Acidity" value={editData.acidity || ''}
                  onChange={(e) => setEditData({ ...editData, acidity: e.target.value })}>
                  <MenuItem value="">—</MenuItem>
                  {['light', 'medium', 'high'].map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </TextField>
                <TextField variant="filled" fullWidth select label="Mouth Feel" value={editData.mouthFeel || ''}
                  onChange={(e) => setEditData({ ...editData, mouthFeel: e.target.value })}>
                  <MenuItem value="">—</MenuItem>
                  {['mouth drying', 'metallic', 'oily', 'light', 'medium', 'full', 'other'].map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </TextField>
                <TextField variant="filled" fullWidth label="Tasting Notes (comma separated)"
                  value={(editData.tastingNotes || []).join(', ')}
                  onChange={(e) => setEditData({ ...editData, tastingNotes: e.target.value.split(',').map((n) => n.trim()).filter(Boolean) })} />
                <TextField variant="filled" fullWidth label="Username" value={editData.username || ''}
                  onChange={(e) => setEditData({ ...editData, username: e.target.value })} />
                <TextField variant="filled" fullWidth label="Location" value={editData.location || ''}
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })} />
                <TextField variant="filled" fullWidth multiline rows={3} label="Notes / Recipe" value={editData.notes || ''}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value })} />
              </Stack>
            )}
            {editType === 'alert' && (
              <Stack spacing={2} sx={{ pt: 1 }}>
                <TextField variant="filled" fullWidth multiline rows={2} label="Message" value={editData.message || ''}
                  onChange={(e) => setEditData({ ...editData, message: e.target.value })} />
                <TextField variant="filled" fullWidth select label="Severity" value={editData.severity || 'info'}
                  onChange={(e) => setEditData({ ...editData, severity: e.target.value })}>
                  {['info', 'success', 'warning', 'error'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
                <FormControlLabel
                  control={<Switch checked={!!editData.isActive} onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })} />}
                  label="Active"
                />
                <TextField variant="filled" fullWidth label="Expires At (optional)" type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  value={editData.expiresAt ? new Date(editData.expiresAt).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setEditData({ ...editData, expiresAt: e.target.value || null })} />
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
