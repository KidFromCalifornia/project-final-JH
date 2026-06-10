import React from 'react';
import { Box, useTheme } from '@mui/material';

const CATEGORIES = [
  { label: 'Floral',        color: '#f06292', notes: ['floral'] },
  { label: 'Fruity',        color: '#e53935', notes: ['fruity'] },
  { label: 'Sour/Ferm.',    color: '#c6d400', notes: ['sour', 'alcohol'] },
  { label: 'Green/Veg.',    color: '#43a047', notes: ['green'] },
  { label: 'Other',         color: '#607d8b', notes: ['stale', 'earthy', 'other'] },
  { label: 'Chemical',      color: '#78909c', notes: ['chemical'] },
  { label: 'Roasted',       color: '#4e342e', notes: ['roasted', 'cereal'] },
  { label: 'Spices',        color: '#8d4e2a', notes: ['spices'] },
  { label: 'Nutty/Cocoa',   color: '#a1887f', notes: ['nutty', 'cocoa'] },
  { label: 'Sweet',         color: '#d4856a', notes: ['sweet'] },
];

const CX = 150;
const CY = 150;
const INNER_R = 45;
const CAT_R = 82;
const OUTER_R = 142;
const GAP = 1.5;

const toRad = (deg) => ((deg - 90) * Math.PI) / 180;

const polarToCart = (r, angleDeg) => ({
  x: CX + r * Math.cos(toRad(angleDeg)),
  y: CY + r * Math.sin(toRad(angleDeg)),
});

const arcPath = (innerR, outerR, start, end) => {
  const s1 = polarToCart(outerR, start + GAP / 2);
  const e1 = polarToCart(outerR, end - GAP / 2);
  const s2 = polarToCart(innerR, end - GAP / 2);
  const e2 = polarToCart(innerR, start + GAP / 2);
  const large = end - start > 180 ? 1 : 0;
  return `M${s1.x},${s1.y} A${outerR},${outerR} 0 ${large} 1 ${e1.x},${e1.y} L${s2.x},${s2.y} A${innerR},${innerR} 0 ${large} 0 ${e2.x},${e2.y} Z`;
};

const TastingWheel = ({ selected = [], onChange, size = 360 }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [hovered, setHovered] = React.useState(null);

  const totalNotes = CATEGORIES.reduce((sum, c) => sum + c.notes.length, 0);
  const degPerNote = 360 / totalNotes;

  const noteSegments = [];
  const catSegments = [];
  let angle = 0;

  CATEGORIES.forEach((cat) => {
    const catStart = angle;

    cat.notes.forEach((note) => {
      const start = angle;
      const end = angle + degPerNote;
      const mid = (start + end) / 2;
      noteSegments.push({ note, cat, start, end, mid });
      angle += degPerNote;
    });

    catSegments.push({ cat, start: catStart, end: angle, mid: (catStart + angle) / 2 });
  });

  const toggle = (note) =>
    onChange(selected.includes(note) ? selected.filter((n) => n !== note) : [...selected, note]);

  const centerLabel = hovered
    ? hovered
    : selected.length > 0
    ? `${selected.length} selected`
    : 'tap to select';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderRadius: 2,
        p: 1.5,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 300 300" style={{ overflow: 'visible', display: 'block', maxWidth: size, maxHeight: size }}>
        {/* Outer note segments */}
        {noteSegments.map(({ note, cat, start, end, mid }) => {
          const isSelected = selected.includes(note);
          const isHovered = hovered === note;
          const fill = isSelected
            ? cat.color
            : isDark
            ? `${cat.color}50`
            : `${cat.color}30`;
          const labelPos = polarToCart(OUTER_R - 20, mid);
          let rot = mid - 90;
          if (mid > 180) rot += 180;

          return (
            <g key={note}>
              <path
                d={arcPath(CAT_R, OUTER_R, start, end)}
                fill={fill}
                stroke={isSelected || isHovered ? cat.color : 'transparent'}
                strokeWidth={isSelected ? 2 : 1}
                style={{
                  cursor: 'pointer',
                  transition: 'fill 150ms ease, opacity 150ms ease',
                  opacity: isHovered && !isSelected ? 0.8 : 1,
                }}
                onClick={() => toggle(note)}
                onMouseEnter={() => setHovered(note)}
                onMouseLeave={() => setHovered(null)}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="7.5"
                fontWeight={isSelected ? 700 : 400}
                fill={isSelected ? '#fff' : isDark ? 'rgba(255,255,255,0.85)' : '#333'}
                transform={`rotate(${rot},${labelPos.x},${labelPos.y})`}
                style={{ pointerEvents: 'none', textTransform: 'capitalize' }}
              >
                {note}
              </text>
            </g>
          );
        })}

        {/* Inner category segments — colour only, no text */}
        {catSegments.map(({ cat, start, end }) => (
          <path
            key={cat.label}
            d={arcPath(INNER_R, CAT_R, start, end)}
            fill={`${cat.color}cc`}
            style={{ pointerEvents: 'none' }}
          />
        ))}

        {/* Centre */}
        <circle
          cx={CX}
          cy={CY}
          r={INNER_R - 2}
          fill={theme.palette.background.paper}
          stroke={theme.palette.divider}
          strokeWidth={1}
        />
        <text
          x={CX}
          y={CY - 6}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fontWeight={700}
          fill={theme.palette.text.primary}
        >
          {selected.length > 0 ? selected.length : ''}
        </text>
        <text
          x={CX}
          y={CY + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="7.5"
          fill={theme.palette.text.secondary}
        >
          {centerLabel}
        </text>
      </svg>

    </Box>
  );
};

export default TastingWheel;
