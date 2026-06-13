import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Paper, Stack, Chip, CssBaseline,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Collapse, Switch, FormControlLabel,
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer,
  IconButton, Tooltip, Tabs, Tab, useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LoginForm from '../components/forms/LoginForm.jsx';
import MuiTheme from '../components/layout/MuiTheme.jsx';
import CafeEditForm from '../components/admin/CafeEditForm.jsx';
import AdminDashboard from '../components/admin/AdminDashboard.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const NAV_W = 72; // app's left desktop nav bar
const SIDEBAR_W = 180;

const SidebarNav = ({ tabs, tab, setTab, onRefresh, onLogout, loading }) => (
  <Box sx={{
    width: SIDEBAR_W, minWidth: SIDEBAR_W, bgcolor: '#0f2e4e', color: '#fff',
    display: 'flex', flexDirection: 'column', height: '100vh',
    position: 'fixed', top: 0, left: NAV_W, zIndex: 1100, overflowY: 'auto',
  }}>
    <Box sx={{ px: 2.5, py: 3 }}>
      <Typography variant="subtitle2" fontWeight={800} letterSpacing="0.15em" sx={{ color: 'rgba(255,255,255,0.5)', mb: 2 }}>
        ADMIN
      </Typography>
      <Stack spacing={0.5}>
        {tabs.map((t, i) => (
          <Box key={t.label} onClick={() => setTab(i)} sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            px: 1.5, py: 1, borderRadius: 1.5, cursor: 'pointer',
            bgcolor: tab === i ? 'rgba(255,255,255,0.15)' : 'transparent',
            color: tab === i ? '#fff' : 'rgba(255,255,255,0.6)',
            fontWeight: tab === i ? 700 : 400,
            fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: '#fff' },
            transition: 'all 0.15s',
          }}>
            <span>{t.label}</span>
            {t.badge > 0 && (
              <Chip label={t.badge} size="small" color={i === 1 ? 'error' : 'default'}
                sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, minWidth: 22 }} />
            )}
          </Box>
        ))}
      </Stack>
    </Box>
    <Box sx={{ flex: 1 }} />
    <Box sx={{ px: 2, py: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <Button fullWidth size="small" onClick={onRefresh} disabled={loading}
        sx={{ mb: 1, color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.2)', border: '1px solid', borderRadius: 1.5,
          '&:hover': { borderColor: '#fff', color: '#fff' }, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.08em' }}>
        {loading ? 'Loading…' : 'Refresh'}
      </Button>
      <Button fullWidth size="small" onClick={onLogout}
        sx={{ color: 'rgba(255,255,255,0.7)', bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1.5,
          '&:hover': { bgcolor: 'rgba(255,255,255,0.12)', color: '#fff' }, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.08em' }}>
        Logout
      </Button>
    </Box>
  </Box>
);

const AdminTable = ({ columns, rows, renderActions }) => {
  const [confirmId, setConfirmId] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...rows].sort((a, b) => {
    if (!sortKey) return 0;
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
    return sortDir === 'asc' ? cmp : -cmp;
  });

  return (
    <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2, overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'background.paper' }}>
            {columns.map((c) => (
              <TableCell key={c.key}
                onClick={() => handleSort(c.key)}
                sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', py: 1.5, color: 'text.secondary', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
                  '&:hover': { color: 'text.primary' } }}>
                {c.label} {sortKey === c.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </TableCell>
            ))}
            <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', py: 1.5, color: 'text.secondary' }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                Nothing here yet
              </TableCell>
            </TableRow>
          ) : sorted.map((row) => (
            <TableRow key={row._id} hover sx={{ '&:last-child td': { border: 0 } }}>
              {columns.map((c) => (
                <TableCell key={c.key} sx={{ fontSize: '0.85rem', color: 'text.primary', maxWidth: c.maxWidth || 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.render ? c.render(row) : (row[c.key] ?? '—')}
                </TableCell>
              ))}
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                {confirmId === row._id ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 600 }}>Delete?</Typography>
                    <Button size="small" color="error" variant="contained" sx={{ minWidth: 0, px: 1, py: 0.25, fontSize: '0.7rem' }}
                      onClick={() => { renderActions(row, true); setConfirmId(null); }}>Yes</Button>
                    <Button size="small" sx={{ minWidth: 0, px: 1, py: 0.25, fontSize: '0.7rem' }}
                      onClick={() => setConfirmId(null)}>No</Button>
                  </Box>
                ) : (
                  renderActions(row, false, () => setConfirmId(row._id))
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

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
  const [successMessage, setSuccessMessage] = useState('');
  const [newAlert, setNewAlert] = useState({ message: '', severity: 'info', expiresAt: '' });
  const [showAlertForm, setShowAlertForm] = useState(false);

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
    } catch (error) {
      setErrorMessage(`Failed to load: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (isAdmin) fetchAdminData(); }, [isAdmin]);

  const del = (endpoint, setItems) => async (id) => {
    const res = await fetch(`${API_URL}${endpoint}/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (res.ok) setItems((prev) => prev.filter((i) => i._id !== id));
    else setErrorMessage('Delete failed');
  };

  const handleApprove = async (id) => {
    const submission = submissions.find((s) => s._id === id);
    const res = await fetch(`${API_URL}/cafes/${id}/approve`, { method: 'PUT', headers: getHeaders() });
    if (res.ok) {
      const data = await res.json();
      setSubmissions((prev) => prev.filter((s) => s._id !== id));
      if (submission?.parentCafeId) setCafes((prev) => prev.map((c) => c._id === submission.parentCafeId ? data.data : c));
      else setCafes((prev) => [...prev, data.data]);
      setSuccessMessage('Approved!');
    } else setErrorMessage('Approve failed');
  };

  const openEdit = (type, item) => { setEditType(type); setEditingId(item._id); setEditData({ ...item }); };

  const handleSave = async () => {
    const endpoint = editType === 'tasting' ? `/tastings/${editingId}`
      : editType === 'alert' ? `/alerts/${editingId}`
      : `/cafes/${editingId}`;
    const res = await fetch(`${API_URL}${endpoint}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(editData) });
    if (res.ok) {
      const saved = await res.json();
      const up = (prev) => prev.map((i) => i._id === editingId ? saved.data : i);
      if (editType === 'cafe') setCafes(up);
      else if (editType === 'submission') setSubmissions(up);
      else if (editType === 'tasting') setTastings(up);
      else if (editType === 'alert') setAlerts(up);
      setEditingId(null); setSuccessMessage('Saved!');
    } else setErrorMessage('Save failed');
  };

  const handleCreateAlert = async () => {
    const res = await fetch(`${API_URL}/alerts`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ ...newAlert, expiresAt: newAlert.expiresAt || null }) });
    if (res.ok) {
      const data = await res.json();
      setAlerts((prev) => [data.data, ...prev]);
      setNewAlert({ message: '', severity: 'info', expiresAt: '' });
      setShowAlertForm(false);
      setSuccessMessage('Alert created!');
    } else setErrorMessage('Failed to create alert');
  };

  const handleLogout = () => {
    if (window.confirm('Logout?')) { localStorage.removeItem('admin'); localStorage.removeItem('userToken'); setIsAdmin(false); }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!isAdmin) return <LoginForm setIsAdmin={setIsAdmin} onClose={() => {}} />;
  if (loading) return <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh"><Typography>Loading…</Typography></Box>;

  const TABS = [
    { label: 'Dashboard', badge: null },
    { label: 'Submissions', badge: submissions.length },
    { label: 'Cafes', badge: null },
    { label: 'Tastings', badge: null },
    { label: 'Alerts', badge: alerts.filter((a) => a.isActive).length },
  ];

  const actions = (type, setItems, endpoint, showApprove) => (row, confirmed, onDeleteClick) => (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {showApprove && (
        <Tooltip title="Approve"><IconButton size="small" color="success" onClick={() => handleApprove(row._id)}><CheckCircleIcon fontSize="small" /></IconButton></Tooltip>
      )}
      <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => openEdit(type, row)}><EditIcon fontSize="small" /></IconButton></Tooltip>
      {confirmed
        ? (() => { del(endpoint, setItems)(row._id); return null; })()
        : <Tooltip title="Delete"><IconButton size="small" color="error" onClick={onDeleteClick}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
      }
    </Box>
  );

  return (
    <MuiTheme>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        {!isMobile && <SidebarNav tabs={TABS} tab={tab} setTab={setTab} onRefresh={fetchAdminData} onLogout={handleLogout} loading={loading} />}

        <Box sx={{ flex: 1, overflowY: 'auto', minWidth: 0, ml: isMobile ? 0 : `${SIDEBAR_W}px`, width: isMobile ? '100%' : `calc(100% - ${SIDEBAR_W}px)` }}>

          {/* Mobile top tab bar */}
          {isMobile && (
            <Box sx={{ bgcolor: '#0f2e4e', position: 'sticky', top: 0, zIndex: 100 }}>
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': { color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', minWidth: 72, py: 1.5 },
                  '& .Mui-selected': { color: '#fff' },
                  '& .MuiTabs-indicator': { bgcolor: '#fff' },
                }}
              >
                {TABS.map((t, i) => (
                  <Tab key={t.label} label={t.badge > 0 ? `${t.label} (${t.badge})` : t.label} value={i} />
                ))}
              </Tabs>
              <Box sx={{ display: 'flex', gap: 1, px: 1.5, pb: 1 }}>
                <Button size="small" onClick={fetchAdminData} disabled={loading}
                  sx={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.65rem' }}>
                  {loading ? 'Loading…' : 'Refresh'}
                </Button>
                <Button size="small" onClick={handleLogout}
                  sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem' }}>
                  Logout
                </Button>
              </Box>
            </Box>
          )}

          <Box sx={{ p: { xs: 2, sm: 3 } }}>

          {/* Feedback banners */}
          {errorMessage && (
            <Paper sx={{ p: 1.5, mb: 2, bgcolor: 'error.light', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="error.contrastText">{errorMessage}</Typography>
              <Button size="small" onClick={() => setErrorMessage('')}>Dismiss</Button>
            </Paper>
          )}
          {successMessage && (
            <Paper sx={{ p: 1.5, mb: 2, bgcolor: 'success.light', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="success.contrastText">{successMessage}</Typography>
              <Button size="small" onClick={() => setSuccessMessage('')}>Dismiss</Button>
            </Paper>
          )}

          <Typography variant="h5" fontWeight={700} sx={{ mb: 3, display: { xs: 'none', sm: 'block' } }}>{TABS[tab].label}</Typography>

          {tab === 0 && <AdminDashboard cafes={cafes} tastings={tastings} submissions={submissions} alerts={alerts} />}

          {tab === 1 && (
            <AdminTable
              columns={[
                { key: 'name', label: 'Name', maxWidth: 180 },
                { key: 'category', label: 'Category', maxWidth: 120 },
                { key: 'description', label: 'Description', maxWidth: 260 },
                { key: 'createdAt', label: 'Submitted', render: (r) => new Date(r.createdAt).toLocaleDateString(), maxWidth: 100 },
              ]}
              rows={submissions}
              renderActions={actions('submission', setSubmissions, '/cafes', true)}
            />
          )}

          {tab === 2 && (
            <AdminTable
              columns={[
                { key: 'name', label: 'Name', maxWidth: 180 },
                { key: 'category', label: 'Category', maxWidth: 120 },
                { key: 'locations', label: 'Address', maxWidth: 240, render: (r) => r.locations?.[0]?.address || '—' },
                { key: 'features', label: 'Features', maxWidth: 220, render: (r) => (r.features || []).join(', ') || '—' },
                { key: 'createdAt', label: 'Created', render: (r) => new Date(r.createdAt).toLocaleDateString(), maxWidth: 100 },
              ]}
              rows={cafes}
              renderActions={actions('cafe', setCafes, '/cafes', false)}
            />
          )}

          {tab === 3 && (
            <AdminTable
              columns={[
                { key: 'coffeeName', label: 'Coffee', maxWidth: 160 },
                { key: 'coffeeRoaster', label: 'Roaster', maxWidth: 140 },
                { key: 'username', label: 'By', maxWidth: 120 },
                { key: 'brewMethod', label: 'Brew', maxWidth: 110 },
                { key: 'roastLevel', label: 'Roast', maxWidth: 80 },
                { key: 'tastingNotes', label: 'Notes', maxWidth: 180, render: (r) => (r.tastingNotes || []).join(', ') || '—' },
                { key: 'createdAt', label: 'Date', render: (r) => new Date(r.createdAt).toLocaleDateString(), maxWidth: 90 },
              ]}
              rows={tastings}
              renderActions={actions('tasting', setTastings, '/tastings', false)}
            />
          )}

          {tab === 4 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" size="small" onClick={() => setShowAlertForm((v) => !v)}>
                  {showAlertForm ? 'Cancel' : '+ New Alert'}
                </Button>
              </Box>
              <Collapse in={showAlertForm}>
                <Paper elevation={1} sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} mb={2}>New Alert</Typography>
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
                      <Button variant="contained" size="small" onClick={handleCreateAlert} disabled={!newAlert.message.trim()}>Create</Button>
                      <Button size="small" onClick={() => setShowAlertForm(false)}>Cancel</Button>
                    </Box>
                  </Stack>
                </Paper>
              </Collapse>
              <AdminTable
                columns={[
                  { key: 'message', label: 'Message', maxWidth: 400 },
                  { key: 'severity', label: 'Type', maxWidth: 90 },
                  { key: 'isActive', label: 'Active', maxWidth: 70, render: (r) => r.isActive ? <Chip label="Active" size="small" color="success" /> : <Chip label="Off" size="small" /> },
                  { key: 'expiresAt', label: 'Expires', maxWidth: 100, render: (r) => r.expiresAt ? new Date(r.expiresAt).toLocaleDateString() : '—' },
                  { key: 'createdAt', label: 'Created', render: (r) => new Date(r.createdAt).toLocaleDateString(), maxWidth: 90 },
                ]}
                rows={alerts}
                renderActions={actions('alert', setAlerts, '/alerts', false)}
              />
            </>
          )}
        </Box>

        </Box>

        {/* Edit dialog */}
        <Dialog open={!!editingId} onClose={() => setEditingId(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ textTransform: 'capitalize', fontWeight: 700 }}>Edit {editType}</DialogTitle>
          <DialogContent dividers>
            {(editType === 'cafe' || editType === 'submission') && <CafeEditForm editData={editData} setEditData={setEditData} />}
            {editType === 'tasting' && (
              <Stack spacing={2} sx={{ pt: 1 }}>
                <TextField variant="filled" fullWidth label="Coffee Name" value={editData.coffeeName || ''} onChange={(e) => setEditData({ ...editData, coffeeName: e.target.value })} />
                <TextField variant="filled" fullWidth label="Roaster" value={editData.coffeeRoaster || ''} onChange={(e) => setEditData({ ...editData, coffeeRoaster: e.target.value })} />
                <TextField variant="filled" fullWidth label="Country of Origin" value={editData.coffeeOrigin || ''} onChange={(e) => setEditData({ ...editData, coffeeOrigin: e.target.value })} />
                <TextField variant="filled" fullWidth label="Region" value={editData.coffeeOriginRegion || ''} onChange={(e) => setEditData({ ...editData, coffeeOriginRegion: e.target.value })} />
                <TextField variant="filled" fullWidth select label="Brew Method" value={editData.brewMethod || ''} onChange={(e) => setEditData({ ...editData, brewMethod: e.target.value })}>
                  {['espresso', 'filtered coffee', 'pour over', 'other'].map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </TextField>
                <TextField variant="filled" fullWidth select label="Roast Level" value={editData.roastLevel || ''} onChange={(e) => setEditData({ ...editData, roastLevel: e.target.value })}>
                  <MenuItem value="">—</MenuItem>
                  {['light', 'medium', 'dark'].map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </TextField>
                <TextField variant="filled" fullWidth select label="Acidity" value={editData.acidity || ''} onChange={(e) => setEditData({ ...editData, acidity: e.target.value })}>
                  <MenuItem value="">—</MenuItem>
                  {['light', 'medium', 'high'].map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </TextField>
                <TextField variant="filled" fullWidth select label="Mouth Feel" value={editData.mouthFeel || ''} onChange={(e) => setEditData({ ...editData, mouthFeel: e.target.value })}>
                  <MenuItem value="">—</MenuItem>
                  {['mouth drying', 'metallic', 'oily', 'light', 'medium', 'full', 'other'].map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </TextField>
                <TextField variant="filled" fullWidth label="Tasting Notes (comma separated)"
                  value={(editData.tastingNotes || []).join(', ')}
                  onChange={(e) => setEditData({ ...editData, tastingNotes: e.target.value.split(',').map((n) => n.trim()).filter(Boolean) })} />
                <TextField variant="filled" fullWidth label="Username" value={editData.username || ''} onChange={(e) => setEditData({ ...editData, username: e.target.value })} />
                <TextField variant="filled" fullWidth label="Location" value={editData.location || ''} onChange={(e) => setEditData({ ...editData, location: e.target.value })} />
                <TextField variant="filled" fullWidth multiline rows={3} label="Notes / Recipe" value={editData.notes || ''} onChange={(e) => setEditData({ ...editData, notes: e.target.value })} />
              </Stack>
            )}
            {editType === 'alert' && (
              <Stack spacing={2} sx={{ pt: 1 }}>
                <TextField variant="filled" fullWidth multiline rows={2} label="Message" value={editData.message || ''} onChange={(e) => setEditData({ ...editData, message: e.target.value })} />
                <TextField variant="filled" fullWidth select label="Severity" value={editData.severity || 'info'} onChange={(e) => setEditData({ ...editData, severity: e.target.value })}>
                  {['info', 'success', 'warning', 'error'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
                <FormControlLabel control={<Switch checked={!!editData.isActive} onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })} />} label="Active" />
                <TextField variant="filled" fullWidth label="Expires At (optional)" type="datetime-local" InputLabelProps={{ shrink: true }}
                  value={editData.expiresAt ? new Date(editData.expiresAt).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setEditData({ ...editData, expiresAt: e.target.value || null })} />
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingId(null)}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MuiTheme>
  );
};

export default AdminPage;
