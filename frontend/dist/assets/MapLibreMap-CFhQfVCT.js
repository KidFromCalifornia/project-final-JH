import { j as o } from './react-D15UzJOD.js';
import { M as g, n as h, P as u } from './vendor-Cgd6zLZT.js';
import { b as j } from './maplibre-Dtgyks6D.js';
import { w as v, B as k, a } from './mui-_CYUd7UL.js';
const w =
    'https://api.maptiler.com/maps/0198dc89-072a-795c-919e-84fefe62bc97/style.json?key=a82bxq3OIw2AzmMU9SKn',
  A =
    'https://api.maptiler.com/maps/0198e5d4-8cc5-75f0-9e4c-2866e2424173/style.json?key=a82bxq3OIw2AzmMU9SKn';
function W({
  cafesToShow: b,
  showUserPin: y,
  userLocation: l,
  themeMode: c,
  selectedCafe: t,
  setSelectedCafe: p,
  getCustomIcon: m,
}) {
  const i = v();
  return o.jsxs(g, {
    mapLib: j,
    initialViewState: { longitude: 18.0686, latitude: 59.3293, zoom: 12 },
    style: { width: '100vw', height: '100vh' },
    mapStyle: c === 'dark' ? A : w,
    children: [
      b.flatMap((e) => {
        var r;
        return (
          ((r = e.locations) == null
            ? void 0
            : r
                .map((s, d) => {
                  var x;
                  const n = (x = s.coordinates) == null ? void 0 : x.coordinates;
                  return Array.isArray(n) && n.length === 2 && n.every(Number.isFinite)
                    ? o.jsx(
                        h,
                        {
                          longitude: n[0],
                          latitude: n[1],
                          onClick: () => p({ ...e, selectedLocationIndex: d }),
                          sx: { boxShadow: 3 },
                          children: m(e.category, i, c),
                        },
                        `${e._id}-${d}`
                      )
                    : null;
                })
                .filter(Boolean)) || []
        );
      }),
      y &&
        l &&
        Number.isFinite(l.lng) &&
        Number.isFinite(l.lat) &&
        o.jsx(h, { longitude: l.lng, latitude: l.lat, children: m('geotag', i, c) }),
      t &&
        (() => {
          var d, n;
          const e = t.selectedLocationIndex || 0,
            r = (d = t.locations) == null ? void 0 : d[e],
            s = (n = r == null ? void 0 : r.coordinates) == null ? void 0 : n.coordinates;
          return Array.isArray(s) && s.length === 2
            ? o.jsx(u, {
                longitude: s[0],
                latitude: s[1],
                onClose: () => p(null),
                closeOnClick: !1,
                children: o.jsxs(k, {
                  sx: {
                    minWidth: 200,
                    maxWidth: 300,
                    backgroundColor: i.palette.light.main,
                    borderRadius: 2,
                    p: 2,
                    boxShadow: 3,
                    border: `1px solid ${i.palette.divider}`,
                  },
                  children: [
                    o.jsx(a, {
                      variant: 'h6',
                      fontWeight: 'bold',
                      sx: { mb: 1, color: i.palette.text.primary },
                      children: t.name,
                    }),
                    t.category &&
                      o.jsx(a, {
                        variant: 'caption',
                        sx: {
                          backgroundColor: i.palette.primary.main,
                          color: i.palette.primary.contrastText,
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          textTransform: 'capitalize',
                          display: 'inline-block',
                          mb: 1,
                        },
                        children: t.category,
                      }),
                    t.hasMultipleLocations &&
                      r.locationNote &&
                      o.jsx(a, {
                        variant: 'body2',
                        color: 'primary',
                        fontWeight: '500',
                        sx: { mb: 1 },
                        children: r.locationNote,
                      }),
                    o.jsx(a, {
                      variant: 'body2',
                      color: 'text.secondary',
                      sx: { mb: 0.5 },
                      children: r.address,
                    }),
                    r.neighborhood &&
                      o.jsx(a, {
                        variant: 'body2',
                        color: 'text.secondary',
                        sx: { mb: 1 },
                        children: r.neighborhood,
                      }),
                    r.openingTimes &&
                      o.jsx(a, {
                        variant: 'body2',
                        color: 'text.secondary',
                        sx: { mb: 1 },
                        children: r.openingTimes,
                      }),
                    t.website &&
                      o.jsx(a, {
                        variant: 'body2',
                        sx: { mt: 1 },
                        children: o.jsx('a', {
                          href: t.website,
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          style: {
                            color: i.palette.primary.main,
                            textDecoration: 'none',
                            fontWeight: 500,
                          },
                          children: 'Visit Website',
                        }),
                      }),
                  ],
                }),
              })
            : null;
        })(),
    ],
  });
}
export { W as default };
