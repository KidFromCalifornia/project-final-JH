import { r as n, j as e } from './react-D15UzJOD.js';
import { B as i, a as t, P as d, l, E as r } from './mui-_CYUd7UL.js';
import './vendor-Cgd6zLZT.js';
import './maplibre-Dtgyks6D.js';
const c = 'https://sthlmcoffeeclub.onrender.com/api',
  k = () => {
    const [m, h] = n.useState([]),
      [x, u] = n.useState([]),
      [j, b] = n.useState([]),
      [p, v] = n.useState(!0),
      a = typeof window < 'u' && window.localStorage && localStorage.getItem('admin') === 'true';
    if (
      (n.useEffect(() => {
        a &&
          Promise.all([
            fetch(`${c}/cafes`).then((s) => s.json()),
            fetch(`${c}/cafeSubmissions`).then((s) => s.json()),
            fetch(`${c}/tastings/public`).then((s) => s.json()),
          ]).then(([s, o, E]) => {
            (h(s.data || []), u(o.data || []), b(E.data || []), v(!1));
          });
      }, [a]),
      !a)
    )
      return e.jsx(i, {
        textAlign: 'center',
        mt: 4,
        children: e.jsx(t, {
          variant: 'h6',
          color: 'error',
          children: 'Access denied. Admins only.',
        }),
      });
    if (p)
      return e.jsx(i, {
        textAlign: 'center',
        mt: 4,
        children: e.jsx(t, { variant: 'h6', children: 'Loading Approval data...' }),
      });
    const f = (s) => {},
      g = (s) => {},
      C = (s) => {},
      A = (s) => {},
      S = (s) => {},
      y = (s) => {};
    return e.jsxs(i, {
      maxWidth: 'md',
      mx: 'auto',
      mt: 4,
      children: [
        e.jsx(t, { variant: 'h4', gutterBottom: !0, children: 'Admin Dashboard' }),
        e.jsxs(d, {
          elevation: 2,
          sx: { p: 3, mb: 4 },
          children: [
            e.jsx(t, { variant: 'h5', gutterBottom: !0, children: 'Edit Cafes' }),
            e.jsx(l, { sx: { mb: 2 } }),
            m.map((s) => {
              var o;
              return e.jsxs(
                i,
                {
                  mb: 2,
                  p: 2,
                  border: 1,
                  borderColor: 'grey.200',
                  borderRadius: 2,
                  children: [
                    e.jsx(t, { variant: 'subtitle1', fontWeight: 'bold', children: s.name }),
                    e.jsx(t, { variant: 'body2', children: s.address }),
                    e.jsx(t, { variant: 'body2', children: s.description }),
                    e.jsx(t, {
                      variant: 'body2',
                      children: (o = s.features) == null ? void 0 : o.join(', '),
                    }),
                    e.jsxs(i, {
                      mt: 1,
                      children: [
                        e.jsx(r, {
                          variant: 'outlined',
                          size: 'small',
                          sx: { mr: 1 },
                          onClick: () => f(s._id),
                          children: 'Edit',
                        }),
                        e.jsx(r, {
                          variant: 'outlined',
                          color: 'error',
                          size: 'small',
                          onClick: () => g(s._id),
                          children: 'Delete',
                        }),
                      ],
                    }),
                  ],
                },
                s._id
              );
            }),
          ],
        }),
        e.jsxs(d, {
          elevation: 2,
          sx: { p: 3, mb: 4 },
          children: [
            e.jsx(t, {
              variant: 'h5',
              gutterBottom: !0,
              children: 'Approve/Edit Cafe Submissions',
            }),
            e.jsx(l, { sx: { mb: 2 } }),
            x.map((s) =>
              e.jsxs(
                i,
                {
                  mb: 2,
                  p: 2,
                  border: 1,
                  borderColor: 'grey.200',
                  borderRadius: 2,
                  children: [
                    e.jsx(t, { variant: 'subtitle1', fontWeight: 'bold', children: s.name }),
                    e.jsxs(i, {
                      mt: 1,
                      children: [
                        e.jsx(r, {
                          variant: 'contained',
                          color: 'success',
                          size: 'small',
                          sx: { mr: 1 },
                          onClick: () => C(s._id),
                          children: 'Approve',
                        }),
                        e.jsx(r, {
                          variant: 'outlined',
                          size: 'small',
                          sx: { mr: 1 },
                          onClick: () => A(s._id),
                          children: 'Edit',
                        }),
                        e.jsx(r, {
                          variant: 'outlined',
                          color: 'error',
                          size: 'small',
                          onClick: () => S(s._id),
                          children: 'Delete',
                        }),
                      ],
                    }),
                  ],
                },
                s._id
              )
            ),
          ],
        }),
        e.jsxs(d, {
          elevation: 2,
          sx: { p: 3 },
          children: [
            e.jsx(t, { variant: 'h5', gutterBottom: !0, children: 'Delete Tasting Notes' }),
            e.jsx(l, { sx: { mb: 2 } }),
            j.map((s) =>
              e.jsxs(
                i,
                {
                  mb: 2,
                  p: 2,
                  border: 1,
                  borderColor: 'grey.200',
                  borderRadius: 2,
                  children: [
                    e.jsx(t, { variant: 'subtitle1', fontWeight: 'bold', children: s.cafeName }),
                    e.jsx(t, { variant: 'body2', children: s.note }),
                    e.jsx(i, {
                      mt: 1,
                      children: e.jsx(r, {
                        variant: 'outlined',
                        color: 'error',
                        size: 'small',
                        onClick: () => y(s._id),
                        children: 'Delete',
                      }),
                    }),
                  ],
                },
                s._id
              )
            ),
          ],
        }),
      ],
    });
  };
export { k as default };
