import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid, Legend, ResponsiveContainer,
} from 'recharts';
import { Box, Typography, Paper, Grid, MenuItem, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState, useEffect } from 'react';

const PALETTE = [
  '#2e7dc8', '#e05c5c', '#2ebc7a', '#f5a623', '#9b59b6',
  '#1abc9c', '#e67e22', '#3498db', '#e91e8c', '#27ae60',
  '#ff5722', '#00bcd4', '#8bc34a', '#ff9800', '#673ab7',
  '#f06292', '#4db6ac', '#ffb300', '#5c6bc0', '#26a69a',
];

// Force light styling regardless of MUI theme mode
const card = { bgcolor: '#fff', borderRadius: 2, p: 2, border: '1px solid #e0e0e0' };
const sectionTitle = { fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', mb: 2 };

const StatCard = ({ label, value, sub, color = '#194f84' }) => (
  <Paper elevation={0} sx={{ ...card, textAlign: 'center', py: 3 }}>
    <Typography sx={{ fontSize: '2.5rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</Typography>
    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#374151', mt: 1 }}>{label}</Typography>
    {sub && <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af', mt: 0.5 }}>{sub}</Typography>}
  </Paper>
);

const ChartCard = ({ title, height = 220, children }) => (
  <Paper elevation={0} sx={{ ...card, mb: 3 }}>
    <Typography sx={sectionTitle}>{title}</Typography>
    {children}
  </Paper>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper elevation={3} sx={{ px: 1.5, py: 1, fontSize: '0.78rem', border: '1px solid #e0e0e0' }}>
      <strong>{label || payload[0]?.name}</strong>: {payload[0]?.value}
    </Paper>
  );
};

const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent, value }) => {
  if (percent < 0.04) return null;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 24;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#374151" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11} fontWeight={600}>
      {name} ({value})
    </text>
  );
};

const countBy = (arr, key) => {
  const map = {};
  arr.forEach((item) => {
    const vals = Array.isArray(item[key]) ? item[key] : item[key] ? [item[key]] : [];
    vals.forEach((v) => { map[v] = (map[v] || 0) + 1; });
  });
  return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
};

const groupByMonth = (arr) => {
  const map = {};
  arr.forEach((item) => {
    const d = new Date(item.createdAt);
    if (isNaN(d)) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([name, value]) => ({ name, value }));
};

const axisStyle = { fontSize: 11, fill: '#6b7280' };
const gridStyle = { stroke: '#f0f0f0' };

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const AdminDashboard = ({ cafes, tastings, submissions, alerts }) => {
  const [tastingChart, setTastingChart] = useState('brewMethod');
  const [trafficDays, setTrafficDays] = useState(30);
  const [traffic, setTraffic] = useState(null);
  const [interest, setInterest] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    fetch(`${API_BASE}/visits/stats?days=${trafficDays}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { if (d.success) setTraffic(d.data); })
      .catch(() => {});
  }, [trafficDays]);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    fetch(`${API_BASE}/favourites/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (d.success) setInterest(d.data); })
      .catch(() => {});
  }, []);

  const tastingOptions = [
    { value: 'brewMethod', label: 'Brew Method' },
    { value: 'roastLevel', label: 'Roast Level' },
    { value: 'acidity', label: 'Acidity' },
    { value: 'mouthFeel', label: 'Mouth Feel' },
    { value: 'tastingNotes', label: 'Tasting Notes' },
    { value: 'coffeeOrigin', label: 'Origin Country' },
    { value: 'username', label: 'Top Contributors' },
  ];

  const tastingsByMonth = groupByMonth(tastings);
  const submissionsByMonth = groupByMonth(submissions);
  const cafesByCat = countBy(cafes, 'category');
  const alertsBySev = countBy(alerts, 'severity');
  const alertsActive = [
    { name: 'Active', value: alerts.filter((a) => a.isActive).length },
    { name: 'Inactive', value: alerts.filter((a) => !a.isActive).length },
  ].filter((d) => d.value > 0);

  const cafeNeigh = (() => {
    const map = {};
    cafes.forEach((c) => { const n = c.locations?.[0]?.neighborhood; if (n) map[n] = (map[n] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  })();

  const selectedData = {
    brewMethod: countBy(tastings, 'brewMethod'),
    roastLevel: countBy(tastings, 'roastLevel'),
    acidity: countBy(tastings, 'acidity'),
    mouthFeel: countBy(tastings, 'mouthFeel'),
    tastingNotes: countBy(tastings, 'tastingNotes').slice(0, 10),
    coffeeOrigin: countBy(tastings, 'coffeeOrigin').slice(0, 10),
    username: countBy(tastings, 'username').slice(0, 10),
  }[tastingChart];

  const isPie = ['brewMethod', 'roastLevel', 'acidity', 'mouthFeel'].includes(tastingChart);

  return (
    <Box sx={{ bgcolor: '#f4f6f9', minHeight: '100%' }}>

      {/* Stat cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Cafes', value: cafes.length, sub: `${cafesByCat[0]?.name || '—'} most common`, color: '#194f84' },
          { label: 'Tastings', value: tastings.length, sub: `${tastingsByMonth.at(-1)?.value ?? 0} this month`, color: '#2e7dc8' },
          { label: 'Pending', value: submissions.length, sub: 'awaiting approval', color: submissions.length > 0 ? '#e57373' : '#66bb6a' },
          { label: 'Active Alerts', value: alerts.filter((a) => a.isActive).length, sub: `${alerts.length} total`, color: '#ffa726' },
        ].map((s) => (
          <Grid item xs={6} md={3} key={s.label}><StatCard {...s} /></Grid>
        ))}
      </Grid>

      {/* Site Traffic */}
      <Paper elevation={0} sx={{ ...card, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={sectionTitle}>Site Traffic</Typography>
          <ToggleButtonGroup size="small" exclusive value={trafficDays} onChange={(_, v) => v && setTrafficDays(v)}
            sx={{ '& .MuiToggleButton-root': { py: 0.25, px: 1.5, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em' } }}>
            {[7, 30, 90].map((d) => <ToggleButton key={d} value={d}>{d}d</ToggleButton>)}
          </ToggleButtonGroup>
        </Box>
        {!traffic ? (
          <Typography sx={{ color: '#9ca3af', textAlign: 'center', py: 3 }}>Loading…</Typography>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography sx={{ ...sectionTitle, mb: 1 }}>Visits Per Day</Typography>
              {traffic.byDay.length === 0 ? (
                <Typography sx={{ color: '#9ca3af', py: 2 }}>No visits recorded yet</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={traffic.byDay} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
                    <XAxis dataKey="name" tick={axisStyle} />
                    <YAxis allowDecimals={false} tick={axisStyle} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="value" stroke="#2e7dc8" strokeWidth={2.5} dot={{ r: 3, fill: '#2e7dc8' }} name="Visits" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ ...sectionTitle, mb: 1 }}>By Device</Typography>
                {traffic.byDevice.length === 0 ? <Typography sx={{ color: '#9ca3af' }}>No data</Typography> : (
                  <ResponsiveContainer width="100%" height={120}>
                    <PieChart>
                      <Pie data={traffic.byDevice} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} labelLine={true} label={<PieLabel />}>
                        {traffic.byDevice.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Box>
              <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 1, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '1.8rem', fontWeight: 800, color: '#194f84', lineHeight: 1 }}>{traffic.total}</Typography>
                <Typography sx={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', mt: 0.5 }}>
                  Total visits ({trafficDays}d)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ ...sectionTitle, mb: 1 }}>Top Pages</Typography>
              {traffic.byPage.length === 0 ? <Typography sx={{ color: '#9ca3af' }}>No data</Typography> : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={traffic.byPage} layout="vertical" margin={{ left: 80, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
                    <XAxis type="number" allowDecimals={false} tick={axisStyle} />
                    <YAxis type="category" dataKey="name" tick={axisStyle} width={80} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Visits" fill="#194f84" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Tastings over time */}
      <ChartCard title="Tastings Over Time">
        {tastingsByMonth.length === 0 ? (
          <Typography sx={{ color: '#9ca3af', py: 4, textAlign: 'center' }}>No data yet</Typography>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={tastingsByMonth} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
              <XAxis dataKey="name" tick={axisStyle} />
              <YAxis allowDecimals={false} tick={axisStyle} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="value" stroke="#194f84" strokeWidth={2.5} dot={{ r: 4, fill: '#194f84' }} name="Tastings" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Interest / Saves */}
      {interest && (
        <Paper elevation={0} sx={{ ...card, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography sx={sectionTitle}>Customer Interest (Saves)</Typography>
            <Box sx={{ px: 1.5, py: 0.5, bgcolor: '#f0f9ff', borderRadius: 1, fontSize: '0.75rem', fontWeight: 700, color: '#194f84' }}>
              {interest.totalSaves} total saves
            </Box>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography sx={{ ...sectionTitle, mb: 1 }}>Most Saved Roasters</Typography>
              {interest.topRoasters.length === 0 ? (
                <Typography sx={{ color: '#9ca3af' }}>No saves yet</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={interest.topRoasters} layout="vertical" margin={{ left: 120, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
                    <XAxis type="number" allowDecimals={false} tick={axisStyle} />
                    <YAxis type="category" dataKey="name" tick={axisStyle} width={120} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Saves" fill="#e57373" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ ...sectionTitle, mb: 1 }}>Most Saved Cafes</Typography>
              {interest.topCafes.length === 0 ? (
                <Typography sx={{ color: '#9ca3af' }}>No saves yet</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={interest.topCafes} layout="vertical" margin={{ left: 120, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
                    <XAxis type="number" allowDecimals={false} tick={axisStyle} />
                    <YAxis type="category" dataKey="name" tick={axisStyle} width={120} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Saves" fill="#194f84" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Tasting breakdown */}
      <Paper elevation={0} sx={{ ...card, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={sectionTitle}>Tasting Breakdown</Typography>
          <TextField select size="small" value={tastingChart} onChange={(e) => setTastingChart(e.target.value)}
            sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { fontSize: '0.8rem' } }}>
            {tastingOptions.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
          </TextField>
        </Box>
        {selectedData.length === 0 ? (
          <Typography sx={{ color: '#9ca3af', py: 4, textAlign: 'center' }}>No data</Typography>
        ) : isPie ? (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={selectedData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={true} label={<PieLabel />}>
                {selectedData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={selectedData} layout="vertical" margin={{ left: 100, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
              <XAxis type="number" allowDecimals={false} tick={axisStyle} />
              <YAxis type="category" dataKey="name" tick={axisStyle} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Count" radius={[0, 4, 4, 0]}>
                {selectedData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Paper>

      {/* Roaster leaderboard */}
      {countBy(tastings, 'coffeeRoaster').length > 0 && (
        <ChartCard title="Roaster Leaderboard — by Tasting Count">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={countBy(tastings, 'coffeeRoaster').slice(0, 10)} layout="vertical" margin={{ left: 120, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
              <XAxis type="number" allowDecimals={false} tick={axisStyle} />
              <YAxis type="category" dataKey="name" tick={axisStyle} width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Tastings" radius={[0, 4, 4, 0]}>
                {countBy(tastings, 'coffeeRoaster').slice(0, 10).map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Cafes */}
      <Typography sx={{ ...sectionTitle, mb: 2 }}>Cafes</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={card}>
            <Typography sx={{ ...sectionTitle }}>By Category</Typography>
            {cafesByCat.length === 0 ? <Typography sx={{ color: '#9ca3af' }}>No data</Typography> : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={cafesByCat} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={true} label={<PieLabel />}>
                    {cafesByCat.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={card}>
            <Typography sx={sectionTitle}>By Neighbourhood</Typography>
            {cafeNeigh.length === 0 ? <Typography sx={{ color: '#9ca3af' }}>No data</Typography> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={cafeNeigh} layout="vertical" margin={{ left: 100, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
                  <XAxis type="number" allowDecimals={false} tick={axisStyle} />
                  <YAxis type="category" dataKey="name" tick={axisStyle} width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Cafes" fill="#194f84" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Submissions over time */}
      {submissionsByMonth.length > 0 && (
        <ChartCard title="Submissions Over Time">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={submissionsByMonth} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
              <XAxis dataKey="name" tick={axisStyle} />
              <YAxis allowDecimals={false} tick={axisStyle} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="value" stroke="#e57373" strokeWidth={2.5} dot={{ r: 4, fill: '#e57373' }} name="Submissions" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Alerts */}
      {alerts.length > 0 && (
        <>
          <Typography sx={{ ...sectionTitle, mb: 2 }}>Alerts</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={card}>
                <Typography sx={sectionTitle}>Active vs Inactive</Typography>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={alertsActive} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} labelLine={true} label={<PieLabel />}>
                      {alertsActive.map((_, i) => <Cell key={i} fill={i === 0 ? '#66bb6a' : '#e0e0e0'} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={card}>
                <Typography sx={sectionTitle}>By Severity</Typography>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={alertsBySev} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
                    <XAxis dataKey="name" tick={axisStyle} />
                    <YAxis allowDecimals={false} tick={axisStyle} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                      {alertsBySev.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default AdminDashboard;
