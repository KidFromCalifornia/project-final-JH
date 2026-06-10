import React from 'react';
import { Box, Chip, Typography, useTheme } from '@mui/material';

const CATEGORIES = [
  { label: 'Fruity',   color: '#e91e8c', notes: ['fruity', 'floral'] },
  { label: 'Green',    color: '#4caf50', notes: ['green'] },
  { label: 'Sour',     color: '#fdd835', notes: ['sour', 'alcohol'] },
  { label: 'Roasted',  color: '#6d4c41', notes: ['roasted', 'cereal', 'cocoa', 'nutty'] },
  { label: 'Spicy',    color: '#ff7043', notes: ['spices'] },
  { label: 'Sweet',    color: '#ab47bc', notes: ['sweet'] },
  { label: 'Other',    color: '#78909c', notes: ['earthy', 'chemical', 'stale', 'other'] },
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

const TastingWheel = ({ selected = [], onChange }) => {
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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
      <svg width="300" height="300" viewBox="0 0 300 300" style={{ overflow: 'visible' }}>
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

        {/* Inner category segments */}
        {catSegments.map(({ cat, start, end, mid }) => {
          const labelPos = polarToCart((INNER_R + CAT_R) / 2, mid);
          let rot = mid - 90;
          if (mid > 180) rot += 180;
          return (
            <g key={cat.label}>
              <path
                d={arcPath(INNER_R, CAT_R, start, end)}
                fill={`${cat.color}cc`}
                style={{ pointerEvents: 'none' }}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="7"
                fontWeight={700}
                fill="#fff"
                transform={`rotate(${rot},${labelPos.x},${labelPos.y})`}
                style={{ pointerEvents: 'none' }}
              >
                {cat.label}
              </text>
            </g>
          );
        })}

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

      {/* Selected chips */}
      {selected.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center', maxWidth: 320 }}>
          {selected.map((note) => {
            const cat = CATEGORIES.find((c) => c.notes.includes(note));
            return (
              <Chip
                key={note}
                label={note}
                size="small"
                onDelete={() => toggle(note)}
                sx={{
                  backgroundColor: cat?.color,
                  color: '#fff',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  '& .MuiChip-deleteIcon': { color: 'rgba(255,255,255,0.75)' },
                }}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default TastingWheel;
