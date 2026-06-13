import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid, Legend, ResponsiveContainer,
} from 'recharts';
import { Box, Typography, Paper, Grid, MenuItem, TextField, useTheme } from '@mui/material';
import { useState } from 'react';

const COLORS = ['#194f84', '#2e7dc8', '#e57373', '#81c784', '#ffb74d', '#ba68c8', '#4dd0e1', '#f06292', '#aed581', '#ff8a65'];

const StatCard = ({ label, value, sub }) => (
  <Paper elevation={2} sx={{ p: 2.5, borderRadius: 2, textAlign: 'center' }}>
    <Typography variant="h3" fontWeight={700} color="primary.main">{value}</Typography>
    <Typography variant="body2" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mt: 0.5 }}>{label}</Typography>
    {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
  </Paper>
);

const SectionTitle = ({ children }) => (
  <Typography variant="h6" fontWeight={700} sx={{ mt: 4, mb: 2, borderBottom: '2px solid', borderColor: 'divider', pb: 1 }}>
    {children}
  </Typography>
);

const countBy = (arr, key) => {
  const map = {};
  arr.forEach((item) => {
    const val = item[key];
    if (!val) return;
    const vals = Array.isArray(val) ? val : [val];
    vals.forEach((v) => { map[v] = (map[v] || 0) + 1; });
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

const countByNested = (arr, key1, key2) => {
  const map = {};
  arr.forEach((item) => {
    const val = item[key1]?.[key2];
    if (!val) return;
    map[val] = (map[val] || 0) + 1;
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

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper sx={{ p: 1.5, fontSize: '0.8rem' }}>
      <strong>{label || payload[0].name}</strong>: {payload[0].value}
    </Paper>
  );
};

const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
  if (percent < 0.05) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + r * Math.sin(-midAngle * Math.PI / 180);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {name}
    </text>
  );
};

const AdminDashboard = ({ cafes, tastings, submissions, alerts }) => {
  const theme = useTheme();
  const [tastingChart, setTastingChart] = useState('brewMethod');

  const tastingChartOptions = [
    { value: 'brewMethod', label: 'Brew Method' },
    { value: 'roastLevel', label: 'Roast Level' },
    { value: 'acidity', label: 'Acidity' },
    { value: 'mouthFeel', label: 'Mouth Feel' },
    { value: 'tastingNotes', label: 'Tasting Notes' },
    { value: 'coffeeOrigin', label: 'Origin Country' },
    { value: 'username', label: 'Top Contributors' },
  ];

  const brewData = countBy(tastings, 'brewMethod');
  const roastData = countBy(tastings, 'roastLevel');
  const acidityData = countBy(tastings, 'acidity');
  const mouthFeelData = countBy(tastings, 'mouthFeel');
  const notesData = countBy(tastings, 'tastingNotes').slice(0, 10);
  const originsData = countBy(tastings, 'coffeeOrigin').slice(0, 10);
  const contributorsData = countBy(tastings, 'username').slice(0, 10);
  const tastingsByMonth = groupByMonth(tastings);
  const submissionsByMonth = groupByMonth(submissions);

  const cafesByNeighbourhood = countByNested(cafes, 'locations', '0')
    .slice(0, 10);
  const cafeNeighData = (() => {
    const map = {};
    cafes.forEach((c) => {
      const n = c.locations?.[0]?.neighborhood;
      if (n) map[n] = (map[n] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  })();

  const cafesByCat = countBy(cafes, 'category');
  const alertsBySeverity = countBy(alerts, 'severity');
  const alertsActiveData = [
    { name: 'Active', value: alerts.filter((a) => a.isActive).length },
    { name: 'Inactive', value: alerts.filter((a) => !a.isActive).length },
  ].filter((d) => d.value > 0);

  const selectedTastingData = {
    brewMethod: brewData,
    roastLevel: roastData,
    acidity: acidityData,
    mouthFeel: mouthFeelData,
    tastingNotes: notesData,
    coffeeOrigin: originsData,
    username: contributorsData,
  }[tastingChart];

  const isPie = ['brewMethod', 'roastLevel', 'acidity', 'mouthFeel'].includes(tastingChart);

  return (
    <Box>
      {/* Stat cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          { label: 'Cafes', value: cafes.length, sub: `${cafesByCat[0]?.name || ''} most common` },
          { label: 'Tastings', value: tastings.length, sub: `${tastingsByMonth.at(-1)?.value || 0} this month` },
          { label: 'Pending', value: submissions.length, sub: 'awaiting approval' },
          { label: 'Active Alerts', value: alerts.filter((a) => a.isActive).length, sub: `${alerts.length} total` },
        ].map((s) => (
          <Grid item xs={6} md={3} key={s.label}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      {/* Tastings over time */}
      <SectionTitle>Tastings Over Time</SectionTitle>
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        {tastingsByMonth.length === 0 ? (
          <Typography color="text.secondary">No data yet</Typography>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={tastingsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="value" stroke={theme.palette.primary.main} strokeWidth={2} dot={{ r: 3 }} name="Tastings" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Paper>

      {/* Tastings breakdown */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, mt: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ borderBottom: '2px solid', borderColor: 'divider', pb: 1, flex: 1 }}>
          Tasting Breakdown
        </Typography>
        <TextField select size="small" value={tastingChart} onChange={(e) => setTastingChart(e.target.value)}
          sx={{ ml: 2, minWidth: 160 }}>
          {tastingChartOptions.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
        </TextField>
      </Box>
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        {selectedTastingData.length === 0 ? (
          <Typography color="text.secondary">No data</Typography>
        ) : isPie ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={selectedTastingData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                outerRadius={110} labelLine={false} label={<PieLabel />}>
                {selectedTastingData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={selectedTastingData} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Count" radius={[0, 4, 4, 0]}>
                {selectedTastingData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Paper>

      {/* Cafes */}
      <SectionTitle>Cafes</SectionTitle>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} mb={1}>By Category</Typography>
            {cafesByCat.length === 0 ? <Typography color="text.secondary">No data</Typography> : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={cafesByCat} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    outerRadius={80} labelLine={false} label={<PieLabel />}>
                    {cafesByCat.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} mb={1}>By Neighbourhood</Typography>
            {cafeNeighData.length === 0 ? <Typography color="text.secondary">No data</Typography> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={cafeNeighData} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Cafes" fill={theme.palette.primary.main} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Submissions over time */}
      {submissionsByMonth.length > 0 && (
        <>
          <SectionTitle>Submissions Over Time</SectionTitle>
          <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={submissionsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" stroke={COLORS[2]} strokeWidth={2} dot={{ r: 3 }} name="Submissions" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </>
      )}

      {/* Alerts */}
      {alerts.length > 0 && (
        <>
          <SectionTitle>Alerts</SectionTitle>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} mb={1}>Active vs Inactive</Typography>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={alertsActiveData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                      outerRadius={70} labelLine={false} label={<PieLabel />}>
                      {alertsActiveData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} mb={1}>By Severity</Typography>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={alertsBySeverity}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                      {alertsBySeverity.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
