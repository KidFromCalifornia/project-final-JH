import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid, Legend, ResponsiveContainer,
} from 'recharts';
import { Box, Typography, Paper, MenuItem, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState, useEffect } from 'react';

const PALETTE = [
  '#2e7dc8', '#e05c5c', '#2ebc7a', '#f5a623', '#9b59b6',
  '#1abc9c', '#e67e22', '#e91e8c', '#27ae60', '#ff5722',
  '#00bcd4', '#8bc34a', '#ff9800', '#673ab7', '#f06292',
  '#4db6ac', '#ffb300', '#5c6bc0', '#26a69a', '#ef5350',
];

const C = { bg: '#fff', border: '1px solid #e8edf2', radius: 2, p: 2.5 };
const label = { fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8', mb: 1.5, display: 'block' };
const axis = { fontSize: 11, fill: '#94a3b8' };
const grid = { stroke: '#f1f5f9' };

const StatCard = ({ title, value, sub, color }) => (
  <Paper elevation={0} sx={{ ...C, flex: 1, minWidth: 0, borderTop: `3px solid ${color}` }}>
    <Typography sx={label}>{title}</Typography>
    <Typography sx={{ fontSize: '2.2rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</Typography>
    {sub && <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', mt: 0.75 }}>{sub}</Typography>}
  </Paper>
);

const Section = ({ title, children, action }) => (
  <Paper elevation={0} sx={{ ...C, mb: 2.5, width: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Typography sx={{ ...label, mb: 0 }}>{title}</Typography>
      {action}
    </Box>
    {children}
  </Paper>
);

const Tip = ({ active, payload, label: l }) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper elevation={4} sx={{ px: 1.5, py: 1, fontSize: '0.78rem', bgcolor: '#1e293b', color: '#fff', borderRadius: 1 }}>
      <strong>{l || payload[0]?.name}</strong>: {payload[0]?.value}
    </Paper>
  );
};

const OuterLabel = ({ cx, cy, midAngle, outerRadius, name, percent, value }) => {
  if (percent < 0.04) return null;
  const r = outerRadius + 28;
  const x = cx + r * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + r * Math.sin(-midAngle * Math.PI / 180);
  return (
    <text x={x} y={y} fill="#475569" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11} fontWeight={600}>
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
  arr.forEach(({ createdAt }) => {
    const d = new Date(createdAt);
    if (isNaN(d)) return;
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    map[k] = (map[k] || 0) + 1;
  });
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([name, value]) => ({ name, value }));
};

const HBar = ({ data, height = 220 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
      <CartesianGrid strokeDasharray="3 3" {...grid} horizontal={false} />
      <XAxis type="number" allowDecimals={false} tick={axis} axisLine={false} tickLine={false} />
      <YAxis type="category" dataKey="name" tick={axis} width={130} axisLine={false} tickLine={false} />
      <Tooltip content={<Tip />} cursor={{ fill: '#f8fafc' }} />
      <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={22}>
        {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

const VBar = ({ data, height = 200, color = '#2e7dc8' }) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
      <CartesianGrid strokeDasharray="3 3" {...grid} vertical={false} />
      <XAxis dataKey="name" tick={axis} axisLine={false} tickLine={false} />
      <YAxis allowDecimals={false} tick={axis} axisLine={false} tickLine={false} />
      <Tooltip content={<Tip />} cursor={{ fill: '#f8fafc' }} />
      <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
        {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

const Donut = ({ data, height = 240 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <PieChart margin={{ top: 20, bottom: 20, left: 40, right: 40 }}>
      <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
        innerRadius={55} outerRadius={90} labelLine label={<OuterLabel />}>
        {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
      </Pie>
      <Tooltip content={<Tip />} />
    </PieChart>
  </ResponsiveContainer>
);

const Trend = ({ data, color, height = 200 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
      <CartesianGrid strokeDasharray="3 3" {...grid} vertical={false} />
      <XAxis dataKey="name" tick={axis} axisLine={false} tickLine={false} />
      <YAxis allowDecimals={false} tick={axis} axisLine={false} tickLine={false} />
      <Tooltip content={<Tip />} />
      <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={{ r: 4, fill: color, strokeWidth: 0 }} />
    </LineChart>
  </ResponsiveContainer>
);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const AdminDashboard = ({ cafes, tastings, submissions, alerts }) => {
  const [tastingChart, setTastingChart] = useState('brewMethod');
  const [trafficDays, setTrafficDays] = useState(30);
  const [traffic, setTraffic] = useState(null);
  const [interest, setInterest] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    fetch(`${API_BASE}/visits/stats?days=${trafficDays}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then((d) => { if (d.success) setTraffic(d.data); }).catch(() => {});
  }, [trafficDays]);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    fetch(`${API_BASE}/favourites/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then((d) => { if (d.success) setInterest(d.data); }).catch(() => {});
  }, []);

  const tastingOptions = [
    { value: 'brewMethod', label: 'Brew Method' },
    { value: 'roastLevel', label: 'Roast Level' },
    { value: 'acidity', label: 'Acidity' },
    { value: 'mouthFeel', label: 'Mouth Feel' },
    { value: 'tastingNotes', label: 'Tasting Notes' },
    { value: 'coffeeOrigin', label: 'Origin Country' },
    { value: 'username', label: 'Top Contributors' },
    { value: 'coffeeRoaster', label: 'Roasters' },
  ];

  const byMonth = groupByMonth(tastings);
  const subByMonth = groupByMonth(submissions);
  const byCat = countBy(cafes, 'category');
  const byNeigh = (() => {
    const m = {};
    cafes.forEach((c) => { const n = c.locations?.[0]?.neighborhood; if (n) m[n] = (m[n] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10);
  })();

  const isPie = ['brewMethod', 'roastLevel', 'acidity', 'mouthFeel'].includes(tastingChart);
  const selectedData = countBy(tastings, tastingChart).slice(0, 12);

  return (
    <Box sx={{ width: '100%' }}>

      {/* Stat row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
        <StatCard title="Cafes" value={cafes.length} sub={`${byCat[0]?.name || '—'} most common`} color="#2e7dc8" />
        <StatCard title="Tastings" value={tastings.length} sub={`${byMonth.at(-1)?.value ?? 0} this month`} color="#2ebc7a" />
        <StatCard title="Pending" value={submissions.length} sub="awaiting approval" color={submissions.length > 0 ? '#e05c5c' : '#2ebc7a'} />
        <StatCard title="Active Alerts" value={alerts.filter((a) => a.isActive).length} sub={`${alerts.length} total`} color="#f5a623" />
        {interest && <StatCard title="Total Saves" value={interest.totalSaves} sub="roasters + cafes" color="#9b59b6" />}
        {traffic && <StatCard title={`Visits (${trafficDays}d)`} value={traffic.total} sub="excl. admin" color="#1abc9c" />}
      </Box>

      {/* Traffic + top pages side by side */}
      <Section title="Site Traffic"
        action={
          <ToggleButtonGroup size="small" exclusive value={trafficDays} onChange={(_, v) => v && setTrafficDays(v)}
            sx={{ '& .MuiToggleButton-root': { py: 0.25, px: 1.5, fontSize: '0.7rem' } }}>
            {[7, 30, 90].map((d) => <ToggleButton key={d} value={d}>{d}d</ToggleButton>)}
          </ToggleButtonGroup>
        }
      >
        {!traffic ? <Typography sx={{ color: '#94a3b8', py: 3, textAlign: 'center' }}>Loading…</Typography> : (
          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 2 }}>
            <Box>
              <Typography sx={label}>Visits per Day</Typography>
              {traffic.byDay.length === 0
                ? <Typography sx={{ color: '#94a3b8' }}>No data yet</Typography>
                : <Trend data={traffic.byDay} color="#2e7dc8" height={180} />}
            </Box>
            <Box>
              <Typography sx={label}>Top Pages</Typography>
              <HBar data={traffic.byPage} height={180} />
            </Box>
            <Box>
              <Typography sx={label}>By Device</Typography>
              <Donut data={traffic.byDevice} height={180} />
            </Box>
          </Box>
        )}
      </Section>

      {/* Interest / saves */}
      {interest && (interest.topRoasters.length > 0 || interest.topCafes.length > 0) && (
        <Section title="Customer Interest — Saves">
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography sx={label}>Most Saved Roasters</Typography>
              {interest.topRoasters.length === 0
                ? <Typography sx={{ color: '#94a3b8' }}>No saves yet</Typography>
                : <HBar data={interest.topRoasters} height={200} />}
            </Box>
            <Box>
              <Typography sx={label}>Most Saved Cafes</Typography>
              {interest.topCafes.length === 0
                ? <Typography sx={{ color: '#94a3b8' }}>No saves yet</Typography>
                : <HBar data={interest.topCafes} height={200} />}
            </Box>
          </Box>
        </Section>
      )}

      {/* Tasting breakdown */}
      <Section title="Tasting Breakdown"
        action={
          <TextField select size="small" value={tastingChart} onChange={(e) => setTastingChart(e.target.value)}
            sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { fontSize: '0.8rem' } }}>
            {tastingOptions.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
          </TextField>
        }
      >
        {selectedData.length === 0
          ? <Typography sx={{ color: '#94a3b8', py: 3, textAlign: 'center' }}>No data</Typography>
          : isPie
            ? <Donut data={selectedData} height={280} />
            : <HBar data={selectedData} height={Math.max(200, selectedData.length * 32)} />}
      </Section>

      {/* Tastings over time + Cafes side by side */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2.5 }}>
        <Section title="Tastings Over Time">
          {byMonth.length === 0
            ? <Typography sx={{ color: '#94a3b8' }}>No data yet</Typography>
            : <Trend data={byMonth} color="#2e7dc8" height={180} />}
        </Section>
        <Section title="Cafes by Category">
          {byCat.length === 0
            ? <Typography sx={{ color: '#94a3b8' }}>No data</Typography>
            : <Donut data={byCat} height={220} />}
        </Section>
      </Box>

      {/* Neighbourhood + submissions side by side */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2.5 }}>
        <Section title="Cafes by Neighbourhood">
          {byNeigh.length === 0
            ? <Typography sx={{ color: '#94a3b8' }}>No data</Typography>
            : <HBar data={byNeigh} height={Math.max(200, byNeigh.length * 30)} />}
        </Section>
        {subByMonth.length > 0 && (
          <Section title="Submissions Over Time">
            <Trend data={subByMonth} color="#e05c5c" height={200} />
          </Section>
        )}
      </Box>

    </Box>
  );
};

export default AdminDashboard;
