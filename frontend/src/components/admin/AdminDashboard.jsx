import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid, Legend, ResponsiveContainer,
} from 'recharts';
import { Box, Typography, Paper, MenuItem, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';

const PALETTE = [
  '#1565c0', '#c62828', '#2e7d32', '#e65100', '#6a1b9a',
  '#00838f', '#f9a825', '#ad1457', '#558b2f', '#4527a0',
  '#0277bd', '#6d4c41', '#00695c', '#d84315', '#283593',
  '#37474f', '#880e4f', '#1b5e20', '#bf360c', '#4a148c',
];

const useChartTheme = () => {
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';
  return {
    border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e8edf2',
    labelColor: dark ? '#94a3b8' : '#64748b',
    axisColor: dark ? '#94a3b8' : '#64748b',
    gridColor: dark ? '#2d3748' : '#f1f5f9',
    pieLabel: dark ? '#e2e8f0' : '#1e293b',
    subColor: dark ? '#94a3b8' : '#64748b',
    paperBg: dark ? '#1a2744' : '#ffffff',
    tooltipCursor: dark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
  };
};

const StatCard = ({ title, value, sub, color }) => {
  const { labelColor, subColor, paperBg, border } = useChartTheme();
  return (
    <Paper elevation={0} sx={{ border, bgcolor: paperBg, borderRadius: 2, p: 3.5, borderTop: `3px solid ${color}` }}>
      <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: labelColor, mb: 1.5, display: 'block' }}>{title}</Typography>
      <Typography sx={{ fontSize: '2.2rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</Typography>
      {sub && <Typography sx={{ fontSize: '0.72rem', color: subColor, mt: 0.75 }}>{sub}</Typography>}
    </Paper>
  );
};

const Section = ({ title, children, action }) => {
  const { labelColor, paperBg, border } = useChartTheme();
  return (
    <Paper elevation={0} sx={{ border, bgcolor: paperBg, borderRadius: 2, p: 2.5, mb: 2.5, width: '100%', overflow: 'hidden', minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: labelColor, mb: 0, display: 'block' }}>{title}</Typography>
        {action}
      </Box>
      {children}
    </Paper>
  );
};

const Tip = ({ active, payload, label: l }) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper elevation={4} sx={{ px: 1.5, py: 1, fontSize: '0.78rem', bgcolor: '#0f172a', color: '#f1f5f9', borderRadius: 1 }}>
      <strong>{l || payload[0]?.name}</strong>: {payload[0]?.value}
    </Paper>
  );
};

const OuterLabel = ({ cx, cy, midAngle, outerRadius, name, percent, value, fill }) => {
  if (percent < 0.04) return null;
  const r = outerRadius + 28;
  const x = cx + r * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + r * Math.sin(-midAngle * Math.PI / 180);
  return (
    <text x={x} y={y} fill={fill || '#1e293b'} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11} fontWeight={700}>
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

const HBar = ({ data, height = 220 }) => {
  const { axisColor, gridColor, tooltipCursor } = useChartTheme();
  const tick = { fontSize: 11, fill: axisColor };
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={tick} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={tick} width={130} axisLine={false} tickLine={false} />
        <Tooltip content={<Tip />} cursor={{ fill: tooltipCursor }} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={22}>
          {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const VBar = ({ data, height = 200 }) => {
  const { axisColor, gridColor, tooltipCursor } = useChartTheme();
  const tick = { fontSize: 11, fill: axisColor };
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="name" tick={tick} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={tick} axisLine={false} tickLine={false} />
        <Tooltip content={<Tip />} cursor={{ fill: tooltipCursor }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
          {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const Donut = ({ data, height = 240 }) => {
  const { labelColor } = useChartTheme();
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'center' }, gap: 3, minWidth: 0 }}>
      <Box sx={{ width: { xs: '100%', sm: height }, flexShrink: 0 }}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
            innerRadius={55} outerRadius={90} labelLine={false} label={false}>
            {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
          </Pie>
          <Tooltip content={<Tip />} />
        </PieChart>
      </ResponsiveContainer>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, minWidth: 0, flex: 1 }}>
        {data.map((entry, i) => (
          <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, bgcolor: PALETTE[i % PALETTE.length] }} />
            <Typography noWrap sx={{ fontSize: '0.78rem', color: labelColor, flex: 1 }}>{entry.name}</Typography>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, flexShrink: 0 }}>{entry.value}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const Trend = ({ data, color, height = 200 }) => {
  const { axisColor, gridColor } = useChartTheme();
  const tick = { fontSize: 11, fill: axisColor };
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="name" tick={tick} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={tick} axisLine={false} tickLine={false} />
        <Tooltip content={<Tip />} />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={{ r: 4, fill: color, strokeWidth: 0 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const AdminDashboard = ({ cafes, tastings, submissions, alerts }) => {
  const theme = useTheme();
  const muted = theme.palette.text.secondary;
  const labelSx = { fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: muted, mb: 1.5, display: 'block' };

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

  const isPie = false;
  const selectedData = countBy(tastings, tastingChart).slice(0, 12);

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden', px: { xs: 1, sm: 0 } }}>

      {/* Stat row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(7, 1fr)' }, gap: 2, mb: 2.5 }}>
        <StatCard title="Cafes" value={cafes.length} sub={`${byCat[0]?.name || '—'} most common`} color="#2e7dc8" />
        <StatCard title="Tastings" value={tastings.length} sub={`${byMonth.at(-1)?.value ?? 0} this month`} color="#2ebc7a" />
        <StatCard title="Pending" value={submissions.length} sub="awaiting approval" color={submissions.length > 0 ? '#e05c5c' : '#2ebc7a'} />
        <StatCard title="Active Alerts" value={alerts.filter((a) => a.isActive).length} sub={`${alerts.length} total`} color="#f5a623" />
        {interest && <StatCard title="Total Saves" value={interest.totalSaves} sub="roasters + cafes" color="#9b59b6" />}
        {traffic && <StatCard title={`Visits (${trafficDays}d)`} value={traffic.total} sub="excl. admin" color="#1abc9c" />}
        {traffic && <StatCard title={`Unique Visitors (${trafficDays}d)`} value={traffic.uniqueVisitors} sub="by device ID" color="#3498db" />}
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
        {!traffic ? <Typography sx={{ color: muted, py: 3, textAlign: 'center' }}>Loading…</Typography> : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, gap: 2, minWidth: 0 }}>
            <Box>
              <Typography sx={labelSx}>Visits per Day</Typography>
              {traffic.byDay.length === 0
                ? <Typography sx={{ color: muted }}>No data yet</Typography>
                : <Trend data={traffic.byDay} color="#2e7dc8" height={180} />}
            </Box>
            <Box>
              <Typography sx={labelSx}>Top Pages</Typography>
              <HBar data={traffic.byPage} height={180} />
            </Box>
            <Box>
              <Typography sx={labelSx}>By Device</Typography>
              <Donut data={traffic.byDevice} height={180} />
            </Box>
          </Box>
        )}
      </Section>

      {/* Interest / saves */}
      {interest && (interest.topRoasters.length > 0 || interest.topCafes.length > 0) && (
        <Section title="Customer Interest — Saves">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography sx={labelSx}>Most Saved Roasters</Typography>
              {interest.topRoasters.length === 0
                ? <Typography sx={{ color: muted }}>No saves yet</Typography>
                : <HBar data={interest.topRoasters} height={200} />}
            </Box>
            <Box>
              <Typography sx={labelSx}>Most Saved Cafes</Typography>
              {interest.topCafes.length === 0
                ? <Typography sx={{ color: muted }}>No saves yet</Typography>
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
          ? <Typography sx={{ color: muted, py: 3, textAlign: 'center' }}>No data</Typography>
          : isPie
            ? <Donut data={selectedData} height={280} />
            : <HBar data={selectedData} height={Math.max(200, selectedData.length * 32)} />}
      </Section>

      {/* Tastings over time + Cafes side by side */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2.5, minWidth: 0 }}>
        <Section title="Tastings Over Time">
          {byMonth.length === 0
            ? <Typography sx={{ color: muted }}>No data yet</Typography>
            : <Trend data={byMonth} color="#2e7dc8" height={180} />}
        </Section>
        <Section title="Cafes by Category">
          {byCat.length === 0
            ? <Typography sx={{ color: muted }}>No data</Typography>
            : <Donut data={byCat} height={220} />}
        </Section>
      </Box>

      {/* Neighbourhood + submissions side by side */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2.5, minWidth: 0 }}>
        <Section title="Cafes by Neighbourhood">
          {byNeigh.length === 0
            ? <Typography sx={{ color: muted }}>No data</Typography>
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
