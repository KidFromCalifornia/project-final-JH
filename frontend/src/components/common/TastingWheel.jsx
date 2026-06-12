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

const CX = 175;
const CY = 175;
const INNER_R = 50;
const CAT_R = 85;
const OUTER_R = 162;
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

const TastingWheel = ({ selected = [], onChange, size = 400 }) => {
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

  const toTitleCase = (str) => str.replace(/\b\w/g, (c) => c.toUpperCase());
  const centerLabel = hovered
    ? toTitleCase(hovered)
    : selected.length > 0
    ? `${selected.length} Selected`
    : 'Tap To Select';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderRadius: 2,
        p: 2,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 350 350" style={{ display: 'block', maxWidth: size, maxHeight: size }}>
        {/* Outer note segments */}
        {noteSegments.map(({ note, cat, start, end, mid }) => {
          const isSelected = selected.includes(note);
          const isHovered = hovered === note;
          const fill = isSelected
            ? cat.color
            : isDark
            ? `${cat.color}50`
            : `${cat.color}30`;
          const isRightHalf = mid <= 180;
          const labelPos = polarToCart(isRightHalf ? CAT_R + 4 : OUTER_R - 4, mid);
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
                textAnchor={isRightHalf ? 'start' : 'end'}
                dominantBaseline="middle"
                fontSize="12"
                fontWeight={isSelected ? 700 : 400}
                fill="rgba(255,255,255,0.85)"
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
          y={CY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="20"
          fontWeight={700}
          fill="rgba(255,255,255,0.6)"
        >
          {selected.length > 0 ? selected.length : ''}
        </text>
      </svg>

    </Box>
  );
};

export default TastingWheel;
