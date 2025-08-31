const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      'assets/vendor-Cgd6zLZT.js',
      'assets/react-D15UzJOD.js',
      'assets/maplibre-Dtgyks6D.js',
      'assets/maplibre-B4QYLKPJ.css',
      'assets/MapPage-DmLmVasr.js',
      'assets/mui-_CYUd7UL.js',
      'assets/zustand-CdYKwY4d.js',
      'assets/TastingsPage-DqmTlels.js',
      'assets/TastingForm-CB8l_66l.js',
      'assets/CafePage-DyoBHIJG.js',
      'assets/UserPage-Ccxd9qzb.js',
      'assets/AdminPage-HtNz3Jf5.js',
    ])
) => i.map((i) => d[i]);
import {
  g as O,
  j as e,
  L as N,
  r as w,
  u as Qe,
  h as Ve,
  B as qe,
  i as Ge,
  k as Y,
  N as Ke,
  l as Ye,
} from './react-D15UzJOD.js';
import { c as Je } from './zustand-CdYKwY4d.js';
import {
  c as Xe,
  T as Ze,
  C as Le,
  B as b,
  a as Q,
  b as C,
  I,
  D as ze,
  L as Pe,
  S as Me,
  A as et,
  d as se,
  e as v,
  f as L,
  g as z,
  M as Fe,
  h as P,
  R as de,
  i as Ae,
  j as Oe,
  k as _e,
  l as X,
  m as me,
  n as ue,
  o as tt,
  p as G,
  q as We,
  r as Re,
  s as pe,
  t as Ee,
  u as he,
  v as De,
  w as ie,
  x as xe,
  y as F,
  V as rt,
  z as ot,
  E as ne,
  F as at,
  G as J,
  H as st,
  J as nt,
  K as it,
  N as we,
  P as lt,
  O as ct,
  Q as dt,
  U as mt,
  W as ut,
  X as Ne,
  Y as Be,
  Z as ht,
  _ as xt,
  $ as re,
  a0 as oe,
  a1 as pt,
  a2 as ft,
  a3 as Ce,
} from './mui-_CYUd7UL.js';
import { S as gt, m as Z } from './vendor-Cgd6zLZT.js';
import './maplibre-Dtgyks6D.js';
(function () {
  const r = document.createElement('link').relList;
  if (r && r.supports && r.supports('modulepreload')) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) o(s);
  new MutationObserver((s) => {
    for (const l of s)
      if (l.type === 'childList')
        for (const d of l.addedNodes) d.tagName === 'LINK' && d.rel === 'modulepreload' && o(d);
  }).observe(document, { childList: !0, subtree: !0 });
  function a(s) {
    const l = {};
    return (
      s.integrity && (l.integrity = s.integrity),
      s.referrerPolicy && (l.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === 'use-credentials'
        ? (l.credentials = 'include')
        : s.crossOrigin === 'anonymous'
          ? (l.credentials = 'omit')
          : (l.credentials = 'same-origin'),
      l
    );
  }
  function o(s) {
    if (s.ep) return;
    s.ep = !0;
    const l = a(s);
    fetch(s.href, l);
  }
})();
const bt = 'https://sthlmcoffeeclub.onrender.com/api',
  V = async (t, r = {}) => {
    const a = localStorage.getItem('userToken'),
      o = {
        headers: { 'Content-Type': 'application/json', ...(a && { Authorization: `Bearer ${a}` }) },
        ...r,
      };
    try {
      const s = await fetch(`${bt}${t}`, o),
        l = await s.json();
      if (!s.ok) throw new Error(l.error || 'API request failed');
      return l;
    } catch (s) {
      throw (console.error('API Error:', s), s);
    }
  },
  yt = { getAll: () => V('/cafes'), getById: (t) => V(`/cafes/${t}`) },
  ke = {
    getPublic: () => V('/tastings/public'),
    getUserTastings: () => V('/tastings'),
    create: (t) => V('/tastings', { method: 'POST', body: JSON.stringify(t) }),
    search: (t) => V(`/tastings/public/search?query=${encodeURIComponent(t)}`),
  },
  Se = {
    login: (t) => V('/auth/login', { method: 'POST', body: JSON.stringify(t) }),
    register: (t) => V('/auth/register', { method: 'POST', body: JSON.stringify(t) }),
  },
  le = (t, r, a) => {
    if (!t) return [];
    let o = t;
    return (
      r && r !== 'all' && (o = o.filter((s) => s.category === r)),
      a &&
        a !== 'all' &&
        (o = o.filter((s) => {
          var l, d;
          return (
            ((d = (l = s.locations) == null ? void 0 : l[0]) == null ? void 0 : d.neighborhood) ===
            a
          );
        })),
      o
    );
  },
  g = Je((t) => ({
    themeMode: localStorage.getItem('themeMode') || 'light',
    setThemeMode: (r) => {
      (localStorage.setItem('themeMode', r), t({ themeMode: r }));
    },
    cafes: [],
    setCafes: (r) =>
      t((a) => {
        const o =
          a.cafeTypeFilter || a.neighborhoodFilter
            ? le(r, a.cafeTypeFilter, a.neighborhoodFilter)
            : a.filteredCafes;
        return { cafes: r, filteredCafes: o };
      }),
    searchQuery: '',
    setSearchQuery: (r) => t({ searchQuery: r }),
    searchResults: [],
    setSearchResults: (r) => t({ searchResults: r }),
    cafeTypeFilter: '',
    neighborhoodFilter: '',
    filteredCafes: [],
    setCafeTypeFilter: (r) =>
      t((a) => {
        const o = le(a.cafes, r, a.neighborhoodFilter);
        return { cafeTypeFilter: r, filteredCafes: o };
      }),
    setNeighborhoodFilter: (r) =>
      t((a) => {
        const o = le(a.cafes, a.cafeTypeFilter, r);
        return { neighborhoodFilter: r, filteredCafes: o };
      }),
    clearFilters: () => t({ cafeTypeFilter: '', neighborhoodFilter: '', filteredCafes: [] }),
    tastings: [],
    setTastings: (r) => t({ tastings: r }),
    loading: !1,
    setLoading: (r) => t({ loading: r }),
    editingTasting: null,
    setEditingTasting: (r) => t({ editingTasting: r }),
    deletingTasting: null,
    setDeletingTasting: (r) => t({ deletingTasting: r }),
    fetchTastings: async (r) => {
      t({ loading: !0 });
      try {
        let a = [];
        (r
          ? (a = (await ke.getUserTastings()).data || [])
          : (a = (await ke.getPublic()).data || []),
          t({ tastings: a }));
      } catch {
        t({ tastings: [] });
      }
      t({ loading: !1 });
    },
    options: {},
    setOptions: (r) => t({ options: r }),
    user: null,
    setUser: (r) => t({ user: r }),
    username: localStorage.getItem('username') || null,
    setUsername: (r) => t({ username: r }),
    userToken: localStorage.getItem('userToken') || null,
    setUserToken: (r) => t({ userToken: r }),
    isLoggedIn: !!localStorage.getItem('userToken'),
    setIsLoggedIn: (r) => t({ isLoggedIn: r }),
    userSubmissions: [],
    setUserSubmissions: (r) => t({ userSubmissions: r }),
    fetchError: '',
    setFetchError: (r) => t({ fetchError: r }),
    currentPage: 1,
    setCurrentPage: (r) => t({ currentPage: r }),
    tastingsPerPage: 10,
    setTastingsPerPage: (r) => t({ tastingsPerPage: r }),
  })),
  jt = {
    primary: '#2570bb',
    secondary: '#0a1f33',
    accent: '#fde113',
    accentStrong: '#e0b404',
    background: '#ebf2fa',
    paper: '#2570bb',
    light: '#ebf2fa',
    mainText: '#0a1f33',
    versoText: '#ebf2fa',
    textMuted: '#7a8ca3',
    error: '#ef6461',
    success: '#7eb77f',
    info: '#5bc0de',
    warning: '#f5a623',
  },
  wt = {
    primary: '#1a3350',
    secondary: '#0c3054',
    accent: '#fde112',
    accentStrong: '#ffdf00',
    background: '#121c2b',
    paper: '#184777',
    light: '#ebf2fa',
    mainText: '#ebf2fa',
    versoText: '#b0d7ff',
    textMuted: '#a0b0c0',
    error: '#ff7b76',
    success: '#90c68f',
    info: '#5bc0de',
    warning: '#f5a623',
  },
  Ct = {
    main: 'Verdana, Arial, sans-serif',
    heading: "'Stockholm Type', Verdana, Arial, sans-serif",
    size: { sm: 16, md: 24, lg: 32, xl: 40 },
  },
  kt = (t, r) => ({
    fontFamily: t.fonts.main,
    fontSize: 16,
    color: r.mainText,
    h1: {
      fontFamily: t.fonts.heading,
      fontWeight: 800,
      fontSize: t.fonts.size.xl,
      lineHeight: 1.2,
      letterSpacing: '-0.5px',
      '@media (max-width:600px)': { fontSize: t.fonts.size.lg },
    },
    h2: {
      fontFamily: t.fonts.heading,
      fontWeight: 700,
      fontSize: t.fonts.size.lg,
      lineHeight: 1.25,
      '@media (max-width:600px)': { fontSize: t.fonts.size.md },
    },
    h3: {
      fontFamily: t.fonts.heading,
      fontWeight: 700,
      fontSize: t.fonts.size.md,
      lineHeight: 1.3,
      '@media (max-width:600px)': { fontSize: 20 },
    },
    h4: {
      fontWeight: 700,
      fontSize: 20,
      lineHeight: 1.3,
      '@media (max-width:600px)': { fontSize: 18 },
    },
    h5: {
      fontWeight: 600,
      fontSize: 18,
      lineHeight: 1.35,
      '@media (max-width:600px)': { fontSize: 16 },
    },
    h6: {
      fontWeight: 600,
      fontSize: 16,
      lineHeight: 1.4,
      '@media (max-width:600px)': { fontSize: 14 },
    },
    subtitle1: {
      fontFamily: t.fonts.heading,
      fontSize: 19,
      fontWeight: 600,
      letterSpacing: '0.2px',
      '@media (max-width:600px)': { fontSize: 18 },
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: 14,
      letterSpacing: '0.2px',
      '@media (max-width:600px)': { fontSize: 14 },
    },
    body1: { fontSize: 16, lineHeight: 1.6, '@media (max-width:600px)': { fontSize: 14 } },
    body2: { fontSize: 14, lineHeight: 1.55, '@media (max-width:600px)': { fontSize: 13 } },
    button: {
      fontSize: 14,
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.2px',
      '@media (max-width:600px)': { fontSize: 14 },
    },
    overline: {
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      '@media (max-width:600px)': { fontSize: 12 },
    },
  }),
  St = (t) => ({
    MuiCssBaseline: {
      styleOverrides: (r) => {
        var a, o;
        return {
          body: {
            backgroundColor: r.palette.background.default,
            color: r.palette.text.primary,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            scrollBehavior: 'smooth',
          },
          a: {
            color:
              ((a = r.palette.accentStrong) == null ? void 0 : a.main) || r.palette.accent.main,
            textDecorationColor:
              ((o = r.palette.accentStrong) == null ? void 0 : o.main) || r.palette.accent.main,
            transition: 'color 0.2s ease-in-out',
            '&:hover': { color: r.palette.primary.main },
          },
          '.wf-stockholmtype-n7-inactive h1, .wf-stockholmtype-n4-inactive h1': {
            fontFamily: 'Verdana, Arial, sans-serif !important',
          },
          '.wf-stockholmtype-n7-inactive h2, .wf-stockholmtype-n4-inactive h2': {
            fontFamily: 'Verdana, Arial, sans-serif !important',
          },
          '.wf-stockholmtype-n7-inactive h3, .wf-stockholmtype-n4-inactive h3': {
            fontFamily: 'Verdana, Arial, sans-serif !important',
          },
          '.wf-stockholmtype-loading h1, .wf-stockholmtype-loading h2, .wf-stockholmtype-loading h3':
            { fontFamily: 'Verdana, Arial, sans-serif !important' },
          '*::-webkit-scrollbar': { width: '0.5rem' },
          '*::-webkit-scrollbar-track': { backgroundColor: r.palette.background.paper },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: r.palette.primary.main,
            borderRadius: 4,
            '&:hover': { backgroundColor: r.palette.secondary.main },
          },
        };
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme: r, ownerState: a }) => ({
          borderRadius: t.button.borderRadius,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          border: 'none',
          outline: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': { transform: 'translateY(-0.0625rem)', boxShadow: 'none', border: 'none' },
          '&:active': { transform: 'translateY(0)', outline: 'none' },
          '&:focus': { outline: 'none', boxShadow: 'none' },
          ...(a.variant === 'contained' && {
            '&:hover': { backgroundColor: t.button.hover, transform: 'translateY(-0.0625rem)' },
          }),
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme: r }) => ({
          borderRadius: t.borderRadius,
          boxShadow: 'none',
          transition: 'all 0.3s ease-in-out',
          border: 'none',
          '&:hover': { transform: 'translateY(-0.125rem)', boxShadow: 'none' },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme: r }) => ({
          borderRadius: t.borderRadius,
          border: 'none',
          boxShadow: 'none',
        }),
        elevation1: { boxShadow: 'none' },
        elevation2: { boxShadow: 'none' },
        elevation3: { boxShadow: 'none' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme: r }) => {
          var a;
          return {
            border: 'none',
            outline: 'none',
            borderRadius: 0,
            boxShadow: '0 0.125rem 0.5rem rgba(0,0,0,0.08)',
            backdropFilter: 'blur(0.625rem)',
            backgroundColor: `${r.palette.primary.main}cc`,
            borderBottom: `0.0625rem solid ${r.palette.divider}`,
            color: ((a = r.palette.light) == null ? void 0 : a.main) || '#fff',
          };
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme: r }) => {
          var a;
          return {
            borderRight: `0.0625rem solid ${r.palette.divider}`,
            borderRadius: 0,
            backdropFilter: 'blur(0.625rem)',
            backgroundColor: `${r.palette.primary.main}f5`,
            color: ((a = r.palette.light) == null ? void 0 : a.main) || '#fff',
          };
        },
      },
    },
  }),
  vt = {
    button: {
      background: '#2570bb',
      borderRadius: 8,
      shadow: '0 0.125rem 0.5rem rgba(0,0,0,0.08)',
      spacing: '0.5rem',
      hover: '#1c5ea8',
      active: '#0f3f70',
      containerWidths: { sm: '10rem', md: '20rem', lg: '25rem', xl: '50rem' },
    },
    borderRadius: 8,
    shadow: '0 0.125rem 0.5rem rgba(0,0,0,0.08)',
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    containerWidths: { sm: '10rem', md: '20rem', lg: '25rem', xl: '50rem' },
  },
  It = (t, r, a) => {
    const o = t === 'dark',
      s = o ? a : r,
      l = o ? s.main : s.versoText,
      d = s.background,
      p = s.paper || d;
    return {
      mode: t,
      common: { black: '#000000', white: '#ffffff' },
      primary: { main: s.primary, contrastText: '#ebf2fa' },
      secondary: { main: s.secondary, contrastText: '#ebf2fa' },
      light: { main: s.light },
      accent: { main: s.accent, contrastText: '#0a1f33' },
      accentStrong: { main: s.accentStrong, contrastText: '#0a1f33' },
      textMuted: { main: s.textMuted },
      success: { main: s.success, contrastText: '#0a1f33' },
      error: { main: s.error, contrastText: '#ffffff' },
      warning: { main: s.warning, contrastText: '#0a1f33' },
      info: { main: s.info, contrastText: '#0a1f33' },
      background: { default: d, paper: p },
      text: {
        primary: s.mainText,
        secondary: l,
        disabled: t === 'dark' ? 'rgba(95, 155, 223, 0.5)' : 'rgba(3, 33, 62, 0.5)',
      },
      muted: { main: s.textMuted },
      divider: t === 'dark' ? 'rgba(235,242,250,0.06)' : 'rgba(10,31,51,0.08)',
      action: {
        hover: t === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        selected: t === 'dark' ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.08)',
        disabled: t === 'dark' ? '#3b434f4c' : 'rgba(0,0,0,0.26)',
        focus: t === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)',
        active: t === 'dark' ? 'rgba(255,255,255,0.54)' : 'rgba(0,0,0,0.54)',
      },
      tonalOffset: { light: 0.2, main: 0, dark: 0.15 },
    };
  },
  Tt = ({ children: t }) => {
    const r = g((o) => o.themeMode),
      a = O.useMemo(() => {
        const o = { fonts: Ct, ...vt },
          s = It(r, jt, wt),
          l = kt(o, s.text),
          d = St(o);
        return Xe({
          palette: s,
          typography: l,
          components: d,
          icons: { fontSize: '1.25rem' },
          shape: { borderRadius: 8 },
          shadows: [
            'none',
            o.shadow,
            '0 0.25rem 1rem rgba(0,0,0,0.1)',
            '0 0.5rem 1.5rem rgba(0,0,0,0.12)',
            '0 0.75rem 2rem rgba(0,0,0,0.14)',
            ...Array(20).fill('0 1rem 2.5rem rgba(0,0,0,0.16)'),
          ],
          spacing: (p) => `${0.5 * p}rem`,
          breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 } },
          zIndex: { appBar: 1100, drawer: 1200, modal: 1300, snackbar: 1400, tooltip: 1500 },
          transitions: {
            duration: { shortest: 150, shorter: 200, standard: 300, complex: 375 },
            easing: { easeInOut: 'cubic-bezier(0.4,0,0.2,1)' },
          },
          mixins: { toolbar: { minHeight: '3.5rem' } },
          direction: 'ltr',
        });
      }, [r]);
    return e.jsxs(Ze, { theme: a, children: [e.jsx(Le, {}), t] });
  },
  Lt = '/assets/whiteCup_logo-CpuKDxXz.svg',
  zt = ({
    theme: t,
    open: r,
    darkMode: a,
    isLoggedIn: o,
    navIconColor: s,
    handleToggleDarkMode: l,
  }) =>
    e.jsxs(b, {
      sx: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexGrow: 1,
      },
      children: [
        e.jsxs(b, {
          sx: { display: 'flex', alignItems: 'center', gap: 1, paddingLeft: 8 },
          children: [
            e.jsx(N, {
              to: '/',
              'aria-label': 'map',
              style: { display: 'inline-flex', lineHeight: 0 },
              children: e.jsx('img', {
                src: Lt,
                alt: 'SCC Logo',
                style: { height: '1.75rem', width: 'auto', display: 'block' },
              }),
            }),
            e.jsx(Q, {
              variant: 'subtitle1',
              component: 'div',
              noWrap: !0,
              sx: {
                color: t.palette.light.main,
                lineHeight: 1,
                fontFamily: t.typography.subtitle1.fontFamily,
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                fontWeight: t.typography.subtitle1.fontWeight,
                textTransform: 'uppercase',
              },
              children: 'Stockholms Coffee Club',
            }),
          ],
        }),
        e.jsxs(b, {
          sx: { display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: 1 },
          children: [
            e.jsx(C, {
              title: 'Theme',
              arrow: !0,
              children: e.jsx(I, {
                onClick: l,
                sx: { p: 1 },
                children: a
                  ? e.jsx(ze, { sx: { color: s } })
                  : e.jsx(Pe, { sx: { color: t.palette.accent.main } }),
              }),
            }),
            e.jsx(Me, {
              color: 'light',
              checked: a,
              onChange: l,
              inputProps: { 'aria-label': 'toggle dark mode' },
            }),
            o &&
              e.jsx(C, {
                title: 'Profile',
                arrow: !0,
                children: e.jsx(I, {
                  component: N,
                  to: '/user',
                  sx: { p: 1 },
                  'aria-label': 'User Page',
                  children: e.jsx(et, { sx: { color: t.palette.accent.main } }),
                }),
              }),
          ],
        }),
      ],
    }),
  Pt = ({
    isLoggedIn: t,
    isAdmin: r,
    navIconColor: a,
    open: o,
    setShowLogin: s,
    setShowAddCafe: l,
    setIsLoggedIn: d,
  }) => {
    const p = () => {
      (localStorage.removeItem('userToken'),
        localStorage.removeItem('username'),
        localStorage.removeItem('admin'),
        d(!1),
        s(!1));
    };
    return e.jsxs(e.Fragment, {
      children: [
        e.jsxs(se, {
          children: [
            e.jsx(v, {
              disablePadding: !0,
              sx: { display: 'block' },
              children: e.jsx(C, {
                title: 'Map',
                arrow: !0,
                placement: 'right',
                disableHoverListener: o,
                children: e.jsxs(L, {
                  component: N,
                  to: '/',
                  children: [
                    e.jsx(z, { children: e.jsx(Fe, { sx: { color: a } }) }),
                    e.jsx(P, { primary: 'Map' }),
                  ],
                }),
              }),
            }),
            e.jsx(v, {
              disablePadding: !0,
              sx: { display: 'block' },
              children: e.jsx(C, {
                title: 'Tastings',
                arrow: !0,
                placement: 'right',
                disableHoverListener: o,
                children: e.jsxs(L, {
                  component: N,
                  to: '/tastings',
                  children: [
                    e.jsx(z, { children: e.jsx(de, { sx: { color: a } }) }),
                    e.jsx(P, { primary: 'Tastings' }),
                  ],
                }),
              }),
            }),
            t &&
              e.jsx(v, {
                disablePadding: !0,
                sx: { display: 'block' },
                children: e.jsx(C, {
                  title: 'Add Cafe',
                  arrow: !0,
                  placement: 'right',
                  disableHoverListener: o,
                  children: e.jsxs(L, {
                    onClick: () => l(!0),
                    children: [
                      e.jsx(z, { children: e.jsx(Ae, { sx: { color: a } }) }),
                      e.jsx(P, { primary: 'Add Cafe' }),
                    ],
                  }),
                }),
              }),
            t &&
              r &&
              e.jsx(v, {
                disablePadding: !0,
                sx: { display: 'block' },
                children: e.jsx(C, {
                  title: 'Admin',
                  arrow: !0,
                  placement: 'right',
                  disableHoverListener: o,
                  children: e.jsxs(L, {
                    component: N,
                    to: '/admin',
                    children: [
                      e.jsx(z, { children: e.jsx(Oe, { sx: { color: a } }) }),
                      e.jsx(P, { primary: 'Admin' }),
                    ],
                  }),
                }),
              }),
            t &&
              !r &&
              e.jsx(v, {
                disablePadding: !0,
                sx: { display: 'block' },
                children: e.jsx(C, {
                  title: 'Profile',
                  arrow: !0,
                  placement: 'right',
                  disableHoverListener: o,
                  children: e.jsxs(L, {
                    component: N,
                    to: '/user',
                    children: [
                      e.jsx(z, { children: e.jsx(_e, { sx: { color: a } }) }),
                      e.jsx(P, { primary: 'Profile' }),
                    ],
                  }),
                }),
              }),
          ],
        }),
        e.jsx(X, {}),
        e.jsxs(se, {
          children: [
            !t &&
              e.jsx(v, {
                disablePadding: !0,
                sx: { display: 'block' },
                children: e.jsx(C, {
                  title: 'Login',
                  arrow: !0,
                  placement: 'right',
                  disableHoverListener: o,
                  children: e.jsxs(L, {
                    onClick: () => s(!0),
                    children: [
                      e.jsx(z, { children: e.jsx(me, { sx: { color: a } }) }),
                      e.jsx(P, { primary: 'Login' }),
                    ],
                  }),
                }),
              }),
            t &&
              e.jsx(v, {
                disablePadding: !0,
                sx: { display: 'block' },
                children: e.jsx(C, {
                  title: 'Logout',
                  arrow: !0,
                  placement: 'right',
                  disableHoverListener: o,
                  children: e.jsxs(L, {
                    onClick: p,
                    children: [
                      e.jsx(z, { children: e.jsx(ue, { sx: { color: a } }) }),
                      e.jsx(P, { primary: 'Logout' }),
                    ],
                  }),
                }),
              }),
          ],
        }),
      ],
    });
  },
  ve = ({ label: t, options: r, value: a, onChange: o, iconComponent: s }) => {
    const [l, d] = O.useState(null),
      p = !!l,
      i = Array.isArray(r) ? r : [],
      f = () =>
        t.includes('Cafe Type')
          ? 'Filter cafes by category (specialty, roaster, third-wave)'
          : t.includes('neighborhood')
            ? 'Filter cafes by Stockholm neighborhood'
            : `Filter by ${t}`;
    return e.jsxs(e.Fragment, {
      children: [
        e.jsx(v, {
          disablePadding: !0,
          sx: { display: 'block', py: 0 },
          children: e.jsx(C, {
            title: f(),
            arrow: !0,
            placement: 'right',
            children: e.jsxs(L, {
              onClick: (u) => d(u.currentTarget),
              sx: { width: '100%', justifyContent: 'flex-start', minHeight: 48 },
              children: [e.jsx(z, { children: s }), e.jsx(P, { secondary: t })],
            }),
          }),
        }),
        e.jsxs(tt, {
          anchorEl: l,
          open: p,
          onClose: () => d(null),
          anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
          transformOrigin: { vertical: 'top', horizontal: 'left' },
          children: [
            e.jsx(
              G,
              {
                selected: a === '',
                onClick: () => {
                  (o(''), d(null));
                },
                children: 'All',
              },
              'all'
            ),
            i.map((u) =>
              e.jsx(
                G,
                {
                  selected: a === u,
                  onClick: () => {
                    (o(u), d(null));
                  },
                  children: u.charAt(0).toUpperCase() + u.slice(1),
                },
                u
              )
            ),
          ],
        }),
      ],
    });
  },
  Mt = ({
    categories: t,
    neighborhoods: r,
    cafeTypeQuery: a,
    neighborhoodQuery: o,
    setCafeTypeQuery: s,
    setNeighborhoodQuery: l,
    navIconColor: d,
    open: p,
  }) =>
    e.jsxs(e.Fragment, {
      children: [
        e.jsx(X, {}),
        e.jsx(ve, {
          label: 'Filter by Cafe Type',
          options: t,
          value: a,
          onChange: s,
          iconComponent: e.jsx(We, { sx: { color: d } }),
        }),
        e.jsx(ve, {
          label: 'Filter by neighborhood',
          options: r,
          value: o,
          onChange: l,
          iconComponent: e.jsx(Re, { sx: { color: d } }),
        }),
      ],
    }),
  ae = '20rem',
  Ie = (t) => ({
    width: ae,
    transition: t.transitions.create('width', {
      easing: t.transitions.easing.sharp,
      duration: t.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  }),
  Te = (t) => ({
    transition: t.transitions.create('width', {
      easing: t.transitions.easing.sharp,
      duration: t.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: t.spacing(7),
    [t.breakpoints.up('sm')]: { width: t.spacing(8) },
  }),
  Ft = pe('div')(({ theme: t }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: t.spacing(1),
    ...t.mixins.toolbar,
    color: t.palette.text.primary,
  })),
  At = pe(Ee, { shouldForwardProp: (t) => t !== 'open' })(({ theme: t, open: r }) => ({
    zIndex: t.zIndex.drawer - 1,
    background: t.palette.background.default,
    transition: t.transitions.create(['width', 'margin'], {
      easing: t.transitions.easing.sharp,
      duration: t.transitions.duration.leavingScreen,
    }),
    ...(r && {
      marginLeft: ae,
      width: `calc(100% - ${ae})`,
      transition: t.transitions.create(['width', 'margin'], {
        easing: t.transitions.easing.sharp,
        duration: t.transitions.duration.enteringScreen,
      }),
    }),
  })),
  Ot = pe(he, { shouldForwardProp: (t) => t !== 'open' })(({ theme: t, open: r }) => ({
    width: ae,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    zIndex: t.zIndex.drawer + 2,
    ...(r && {
      ...Ie(t),
      '& .MuiDrawer-paper': {
        ...Ie(t),
        borderRight: 'none',
        boxShadow: `0.25rem 0 0.5rem ${t.palette.secondary.main}40`,
        zIndex: t.zIndex.drawer + 2,
      },
    }),
    ...(!r && {
      ...Te(t),
      '& .MuiDrawer-paper': {
        ...Te(t),
        borderRight: 'none',
        boxShadow: `0.25rem 0 0.5rem ${t.palette.secondary.main}40`,
        zIndex: t.zIndex.drawer + 2,
      },
    }),
  })),
  _t = '/assets/spiltCoffeeError-BB_lQR1E.svg',
  Wt = ({ message: t, type: r = 'error' }) =>
    e.jsx(De, { severity: r, sx: { my: 2 }, children: t }),
  He = (t) => {
    var r, a, o, s, l, d, p, i, f, u;
    return gt.fire({
      confirmButtonColor:
        ((a = (r = t == null ? void 0 : t.theme) == null ? void 0 : r.colors) == null
          ? void 0
          : a.primary) || '#3085d6',
      background:
        ((s = (o = t == null ? void 0 : t.theme) == null ? void 0 : o.colors) == null
          ? void 0
          : s.background) || 'white',
      color:
        ((d = (l = t == null ? void 0 : t.theme) == null ? void 0 : l.colors) == null
          ? void 0
          : d.textDark) || 'black',
      fontFamily:
        ((i = (p = t == null ? void 0 : t.theme) == null ? void 0 : p.fonts) == null
          ? void 0
          : i.main) || 'Avenir, sans-serif',
      width:
        ((u = (f = t == null ? void 0 : t.theme) == null ? void 0 : f.containerWidths) == null
          ? void 0
          : u.md) || '20rem',
      heightAuto: !0,
      imageUrl: (t == null ? void 0 : t.imageUrl) || _t,
      imageWidth: (t == null ? void 0 : t.imageWidth) || 200,
      icon: 'error',
      title: (t == null ? void 0 : t.title) || 'Oops! ',
      customClass: {
        popup: 'swal-popup-custom',
        title: 'swal-title-custom',
        confirmButton: 'swal-confirm-custom',
        icon: 'swal-hide-icon',
      },
      ...t,
    });
  },
  Ue = ({ onClose: t, setCurrentUser: r, setIsLoggedIn: a }) => {
    const o = ie(),
      [s, l] = w.useState(''),
      [d, p] = w.useState(''),
      [i, f] = w.useState(!1),
      [u, _] = w.useState(!1),
      [M, R] = w.useState(''),
      B = g((n) => n.fetchError),
      W = g((n) => n.setFetchError),
      E = g((n) => n.loading),
      H = g((n) => n.setLoading),
      D = async (n) => {
        var m, x, k;
        (n.preventDefault(), H(!0), W(''));
        try {
          const j = M.trim(),
            T = d.trim();
          let y;
          if (
            (i
              ? (y = await Se.register({ username: j, email: s.trim(), password: T }))
              : (y = await Se.login({ username: j, email: j, password: T })),
            y.token || y.accessToken)
          ) {
            const A = y.token || y.accessToken;
            (localStorage.setItem('userToken', A),
              localStorage.setItem('userId', y.user.id),
              localStorage.setItem('username', ((m = y.user) == null ? void 0 : m.username) || j));
            let U = 'user';
            try {
              const { jwtDecode: $ } = await Z(
                async () => {
                  const { jwtDecode: S } = await import('./vendor-Cgd6zLZT.js').then((q) => q.o);
                  return { jwtDecode: S };
                },
                __vite__mapDeps([0, 1, 2, 3])
              );
              U = $(A).role || 'user';
            } catch {
              U = 'user';
            }
            (localStorage.setItem('userRole', U),
              localStorage.setItem('admin', U === 'admin' ? 'true' : 'false'),
              a(!0),
              r({ username: ((x = y.user) == null ? void 0 : x.username) || j }),
              t());
          } else
            W(
              y.error ||
                y.message ||
                (i ? 'Signup failed. Please check your input.' : 'Invalid credentials.')
            );
        } catch (j) {
          j.code === 'NETWORK_ERROR' ||
          ((k = j.message) != null && k.includes('fetch')) ||
          !j.response
            ? He({
                title: 'Server Unavailable',
                text: "We couldn't reach the server. Please try again later.",
                icon: 'error',
              })
            : W(i ? 'Signup failed. Please try again.' : 'Login failed. Please try again.');
        } finally {
          H(!1);
        }
      };
    return e.jsxs(b, {
      sx: {
        width: { xs: '100%', sm: 400 },
        maxWidth: { xs: 'none', sm: 400 },
        p: { xs: 2, sm: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        backgroundColor: o.palette.light.main,
        borderRadius: 2,
        boxShadow: 3,
        color: o.palette.text.primary,
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
        minHeight: 'auto',
      },
      children: [
        e.jsxs(b, {
          sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 },
          children: [
            e.jsx(Q, {
              variant: 'h4',
              sx: { color: o.palette.text.primary, fontSize: { xs: '1.5rem', sm: '2rem' } },
              children: i ? 'Sign Up' : 'Login',
            }),
            e.jsx(I, {
              onClick: t,
              'aria-label': 'Close login form',
              color: 'inherit',
              sx: { p: { xs: 1, sm: 1.5 } },
              children: e.jsx(xe, {}),
            }),
          ],
        }),
        e.jsxs('form', {
          onSubmit: D,
          style: { display: 'flex', flexDirection: 'column', gap: 16, width: '100%' },
          children: [
            i &&
              e.jsx(F, {
                label: 'Email',
                type: 'email',
                value: s,
                onChange: (n) => l(n.target.value),
                required: !0,
                fullWidth: !0,
                autoComplete: 'email',
                color: 'primary',
                variant: 'outlined',
                sx: {
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: o.palette.common.white,
                    minHeight: { xs: 56, sm: 48 },
                    '& fieldset': { borderColor: o.palette.text.primary },
                    '&:hover fieldset': { borderColor: o.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: o.palette.primary.main },
                    '& input': {
                      color: o.palette.text.primary,
                      fontSize: { xs: '16px', sm: '14px' },
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: o.palette.text.primary,
                    '&.Mui-focused': { color: o.palette.primary.main },
                  },
                },
              }),
            e.jsx(F, {
              label: i ? 'Username' : 'Username or Email',
              type: 'text',
              value: M,
              onChange: (n) => R(n.target.value),
              required: !0,
              fullWidth: !0,
              autoComplete: 'username',
              color: 'primary',
              variant: 'outlined',
              sx: {
                '& .MuiOutlinedInput-root': {
                  backgroundColor: o.palette.common.white,
                  minHeight: { xs: 56, sm: 48 },
                  '& fieldset': { borderColor: o.palette.text.primary },
                  '&:hover fieldset': { borderColor: o.palette.primary.main },
                  '&.Mui-focused fieldset': { borderColor: o.palette.primary.main },
                  '& input': {
                    color: o.palette.text.primary,
                    fontSize: { xs: '16px', sm: '14px' },
                  },
                },
                '& .MuiInputLabel-root': {
                  color: o.palette.text.primary,
                  '&.Mui-focused': { color: o.palette.primary.main },
                },
              },
            }),
            e.jsxs(b, {
              sx: { position: 'relative' },
              children: [
                e.jsx(F, {
                  label: 'Password',
                  type: u ? 'text' : 'password',
                  value: d,
                  onChange: (n) => p(n.target.value),
                  required: !0,
                  fullWidth: !0,
                  autoComplete: 'current-password',
                  color: 'primary',
                  variant: 'outlined',
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: o.palette.common.white,
                      minHeight: { xs: 56, sm: 48 },
                      '& fieldset': { borderColor: o.palette.text.primary },
                      '&:hover fieldset': { borderColor: o.palette.primary.main },
                      '&.Mui-focused fieldset': { borderColor: o.palette.primary.main },
                      '& input': {
                        color: o.palette.text.primary,
                        fontSize: { xs: '16px', sm: '14px' },
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: o.palette.text.primary,
                      '&.Mui-focused': { color: o.palette.primary.main },
                    },
                  },
                }),
                e.jsx(C, {
                  title: u ? 'Hide password' : 'Show password',
                  children: e.jsx(I, {
                    'aria-label': 'Toggle password visibility',
                    onClick: () => _((n) => !n),
                    sx: {
                      position: 'absolute',
                      right: 8,
                      top: 8,
                      color: o.palette.text.primary,
                      '&:hover': { color: o.palette.primary.main },
                    },
                    size: 'small',
                    children: u ? e.jsx(rt, {}) : e.jsx(ot, {}),
                  }),
                }),
              ],
            }),
            e.jsx(ne, {
              type: 'submit',
              disabled: E,
              variant: 'contained',
              color: 'primary',
              sx: {
                py: { xs: 1.5, sm: 1.5 },
                px: { xs: 2, sm: 3 },
                mt: 1,
                minHeight: { xs: 48, sm: 42 },
                fontSize: { xs: '16px', sm: '14px' },
                backgroundColor: o.palette.primary.main,
                color: o.palette.primary.contrastText,
                '&:hover': { backgroundColor: o.palette.primary.dark },
                '&:disabled': {
                  backgroundColor: o.palette.action.disabled,
                  color: o.palette.text.disabled,
                },
              },
              children: E ? e.jsx(at, { size: 24, color: 'inherit' }) : i ? 'Sign Up' : 'Login',
            }),
          ],
        }),
        B && e.jsx(De, { severity: 'error', children: B }),
        e.jsxs(Q, {
          align: 'center',
          sx: { mt: 2, color: o.palette.text.primary },
          children: [
            i ? 'Already have an account?' : "Don't have an account?",
            ' ',
            e.jsx(ne, {
              onClick: () => f(!i),
              variant: 'text',
              size: 'small',
              color: 'primary',
              sx: {
                textDecoration: 'underline',
                backgroundColor: 'transparent',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': { transform: 'scale(1.05)', boxShadow: 'none' },
              },
              children: i ? 'Login' : 'Sign Up',
            }),
          ],
        }),
      ],
    });
  },
  Rt = ['specialty', 'roaster', 'thirdwave'],
  Et = [
    'outdoor_seating',
    'wheelchair_accessible',
    'lunch',
    'pour_over',
    'takeaway',
    'vegan_options',
    'breakfast',
    'iced_drinks',
    'pastries',
    'multi_roaster',
    'decaf',
    'no_coffee_bar',
    'limited_sitting',
    'roaster_only',
  ],
  $e = ({ onClose: t }) => {
    var H, D;
    const r = ie(),
      a = {
        '& .MuiOutlinedInput-root': {
          backgroundColor: r.palette.common.white,
          minHeight: { xs: 56, sm: 48 },
          '& fieldset': { borderColor: r.palette.text.primary },
          '&:hover fieldset': { borderColor: r.palette.primary.main },
          '&.Mui-focused fieldset': { borderColor: r.palette.primary.main },
          '& input': { color: r.palette.text.primary, fontSize: { xs: '16px', sm: '14px' } },
          '& textarea': { color: r.palette.text.primary, fontSize: { xs: '16px', sm: '14px' } },
        },
        '& .MuiInputLabel-root': {
          color: r.palette.text.primary,
          '&.Mui-focused': { color: r.palette.primary.main },
        },
      },
      [o, s] = w.useState({
        name: '',
        website: '',
        description: '',
        category: '',
        hasMultipleLocations: !1,
        features: [],
        images: [''],
        locations: [{ address: '', neighborhood: '', locationNote: '', isMainLocation: !0 }],
      }),
      [l, d] = w.useState(''),
      [p, i] = w.useState(''),
      f = (n) =>
        ({
          outdoor_seating: 'Has outdoor seating available',
          wheelchair_accessible: 'Accessible for wheelchair users',
          lunch: 'Serves lunch options',
          pour_over: 'Offers pour-over brewing methods',
          takeaway: 'Offers takeaway/to-go options',
          vegan_options: 'Has vegan food and drink options',
          breakfast: 'Serves breakfast items',
          iced_drinks: 'Offers cold/iced beverages',
          pastries: 'Serves pastries and other baked goods',
          multi_roaster: 'Features coffee from multiple roasters',
          decaf: 'Offers decaffeinated coffee options',
          no_coffee_bar: 'No on-site coffee bar (retail, office or roastery)',
          limited_sitting: 'Limited seating available',
          roaster_only: 'Roastery without public seating',
        })[n] || `Feature: ${n.replace(/_/g, ' ')}`,
      u = (n) => {
        const { name: m, value: x, type: k, checked: j } = n.target;
        s((T) => ({ ...T, [m]: k === 'checkbox' ? j : x }));
      },
      _ = (n) => {
        s((m) => ({
          ...m,
          features: m.features.includes(n) ? m.features.filter((x) => x !== n) : [...m.features, n],
        }));
      },
      M = (n, m) => {
        const { name: x, value: k, type: j, checked: T } = n.target;
        s((y) => {
          const A = [...y.locations];
          return ((A[m][x] = j === 'checkbox' ? T : k), { ...y, locations: A });
        });
      },
      R = async (n) => {
        const m = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(n)}`,
          k = await (await fetch(m)).json();
        return k && k[0] ? { lat: parseFloat(k[0].lat), lon: parseFloat(k[0].lon) } : null;
      },
      B = () => {
        s((n) => ({
          ...n,
          locations: [
            ...n.locations,
            { address: '', neighborhood: '', locationNote: '', isMainLocation: !1 },
          ],
        }));
      },
      W = (n) => {
        s((m) => ({ ...m, locations: m.locations.filter((x, k) => k !== n) }));
      },
      E = async (n) => {
        var m;
        (n.preventDefault(), d(''));
        try {
          const x = await Promise.all(
              o.locations.map(async (T) => {
                const y = await R(T.address);
                return {
                  ...T,
                  coordinates: y ? { type: 'Point', coordinates: [y.lon, y.lat] } : void 0,
                };
              })
            ),
            k = { ...o, locations: x };
          console.log(k);
          const j = await yt.submitCafe(k);
          j.success
            ? (i('success'),
              d('Cafe added!'),
              s({
                name: '',
                website: '',
                description: '',
                category: '',
                hasMultipleLocations: !1,
                features: [],
                images: [''],
                locations: [
                  { address: '', neighborhood: '', locationNote: '', isMainLocation: !0 },
                ],
              }))
            : (i('error'), d(j.error || "We couldn't add this cafe. Please check and try again."));
        } catch (x) {
          x.code === 'NETWORK_ERROR' ||
          ((m = x.message) != null && m.includes('fetch')) ||
          !x.response
            ? He({
                title: 'Server Unavailable',
                text: "We couldn't reach the server. Please try again later.",
                icon: 'error',
              })
            : (d("We couldn't submit your suggestion. Please try again."), i('error'));
        }
      };
    return e.jsxs(b, {
      component: 'form',
      onSubmit: E,
      sx: {
        width: { xs: '100%', sm: 640 },
        maxWidth: { xs: 'none', sm: 640 },
        p: { xs: 2, sm: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        backgroundColor: r.palette.light.main,
        borderRadius: 2,
        boxShadow: 3,
        color: r.palette.text.primary,
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
        minHeight: 'auto',
      },
      children: [
        e.jsxs(b, {
          sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 },
          children: [
            e.jsx(Q, {
              variant: 'h4',
              sx: { color: r.palette.text.primary, fontSize: { xs: '1.5rem', sm: '2rem' } },
              children: 'Suggest a Cafe',
            }),
            e.jsx(I, {
              onClick: t,
              'aria-label': 'Close add cafe form',
              color: 'inherit',
              sx: { p: { xs: 1, sm: 1.5 } },
              children: e.jsx(xe, {}),
            }),
          ],
        }),
        l && e.jsx(b, { sx: { mb: 2 }, children: e.jsx(Wt, { message: l, type: p }) }),
        e.jsxs(J, {
          container: !0,
          spacing: { xs: 1.5, sm: 2 },
          sx: { mb: 2 },
          children: [
            e.jsx(J, {
              item: !0,
              xs: 12,
              sm: 8,
              children: e.jsx(F, {
                label: 'Cafe Name',
                name: 'name',
                value: o.name,
                onChange: u,
                required: !0,
                fullWidth: !0,
                size: 'small',
                sx: a,
              }),
            }),
            e.jsx(J, {
              item: !0,
              xs: 12,
              sm: 4,
              children: e.jsxs(st, {
                fullWidth: !0,
                required: !0,
                size: 'small',
                children: [
                  e.jsx(nt, { id: 'category-label', children: 'Category' }),
                  e.jsx(it, {
                    labelId: 'category-label',
                    name: 'category',
                    value: o.category,
                    label: 'Category',
                    onChange: u,
                    children: Rt.map((n) =>
                      e.jsx(G, { value: n, children: n.charAt(0).toUpperCase() + n.slice(1) }, n)
                    ),
                  }),
                ],
              }),
            }),
            e.jsx(J, {
              item: !0,
              xs: 12,
              children: e.jsx(F, {
                label: 'Primary Address',
                name: 'address',
                value: ((H = o.locations[0]) == null ? void 0 : H.address) || '',
                onChange: (n) => M(n, 0),
                required: !0,
                fullWidth: !0,
                size: 'small',
                placeholder: 'Street address, city',
                sx: a,
              }),
            }),
            e.jsx(J, {
              item: !0,
              xs: 12,
              sm: 6,
              children: e.jsx(F, {
                label: 'Neighborhood',
                name: 'neighborhood',
                value: ((D = o.locations[0]) == null ? void 0 : D.neighborhood) || '',
                onChange: (n) => M(n, 0),
                fullWidth: !0,
                size: 'small',
                sx: a,
              }),
            }),
            e.jsx(J, {
              item: !0,
              xs: 12,
              sm: 6,
              children: e.jsx(F, {
                label: 'Website (optional)',
                name: 'website',
                value: o.website,
                onChange: u,
                fullWidth: !0,
                size: 'small',
                placeholder: 'https://...',
                sx: a,
              }),
            }),
          ],
        }),
        e.jsx(X, {
          sx: { my: 2 },
          children: e.jsx(Q, {
            variant: 'subtitle2',
            sx: { color: 'inherit' },
            children: 'Location',
          }),
        }),
        e.jsxs(we, {
          spacing: { xs: 1.5, sm: 2 },
          children: [
            o.locations.map((n, m) =>
              e.jsxs(
                lt,
                {
                  variant: 'outlined',
                  sx: (x) => ({
                    p: { xs: 1.5, sm: 2 },
                    position: 'relative',
                    backgroundColor: x.palette.background.paper,
                    borderColor: x.palette.divider,
                    borderRadius: 1,
                  }),
                  children: [
                    o.locations.length > 1 &&
                      e.jsx(I, {
                        'aria-label': 'Remove this location',
                        onClick: () => W(m),
                        size: 'small',
                        color: 'inherit',
                        sx: { position: 'absolute', top: 8, right: 8 },
                        children: e.jsx(xe, { fontSize: 'small' }),
                      }),
                    e.jsxs(we, {
                      spacing: { xs: 1.5, sm: 2 },
                      children: [
                        e.jsx(F, {
                          label: 'Address',
                          name: 'address',
                          value: n.address,
                          onChange: (x) => M(x, m),
                          required: !0,
                          fullWidth: !0,
                          size: 'small',
                          sx: a,
                        }),
                        e.jsx(F, {
                          label: 'Neighborhood',
                          name: 'neighborhood',
                          value: n.neighborhood,
                          onChange: (x) => M(x, m),
                          fullWidth: !0,
                          size: 'small',
                          sx: a,
                        }),
                        e.jsx(F, {
                          label: 'Location Note',
                          name: 'locationNote',
                          value: n.locationNote,
                          onChange: (x) => M(x, m),
                          fullWidth: !0,
                          size: 'small',
                          sx: a,
                        }),
                      ],
                    }),
                  ],
                },
                m
              )
            ),
            e.jsx(C, {
              title: 'Add another location for this cafe',
              arrow: !0,
              children: e.jsx(ne, {
                type: 'button',
                onClick: B,
                startIcon: e.jsx(ct, {}),
                variant: 'text',
                sx: { alignSelf: 'flex-start' },
                children: 'Add Another Location',
              }),
            }),
          ],
        }),
        e.jsx(X, {
          sx: { my: 2 },
          children: e.jsx(Q, {
            variant: 'subtitle2',
            sx: { color: 'inherit' },
            children: 'Features',
          }),
        }),
        e.jsx(dt, {
          row: !0,
          sx: {
            rowGap: { xs: 0.5, sm: 1 },
            columnGap: { xs: 1, sm: 2 },
            '& .MuiFormControlLabel-root': {
              minWidth: { xs: '45%', sm: 'auto' },
              mb: { xs: 0.5, sm: 0 },
            },
          },
          children: Et.map((n) =>
            e.jsx(
              C,
              {
                title: f(n),
                arrow: !0,
                children: e.jsx(mt, {
                  control: e.jsx(ut, {
                    size: 'small',
                    name: n,
                    checked: o.features.includes(n),
                    onChange: () => _(n),
                  }),
                  label: e.jsx(Q, {
                    variant: 'body2',
                    sx: { fontSize: { xs: '0.8rem', sm: '0.875rem' }, lineHeight: 1.2 },
                    children: n.replace(/_/g, ' '),
                  }),
                  sx: (m) => ({ color: m.palette.text.primary }),
                }),
              },
              n
            )
          ),
        }),
        e.jsx(ne, {
          type: 'submit',
          variant: 'contained',
          color: 'primary',
          fullWidth: !0,
          sx: {
            py: { xs: 1.5, sm: 1.5 },
            px: { xs: 2, sm: 3 },
            mt: 3,
            minHeight: { xs: 48, sm: 42 },
            fontSize: { xs: '16px', sm: '14px' },
            backgroundColor: r.palette.primary.main,
            color: r.palette.primary.contrastText,
            '&:hover': { backgroundColor: r.palette.primary.dark },
            '&:disabled': {
              backgroundColor: r.palette.action.disabled,
              color: r.palette.text.disabled,
            },
          },
          children: 'Add Cafe',
        }),
      ],
    });
  },
  Dt = ({
    searchResults: t = [],
    showLogin: r = !1,
    setShowLogin: a = () => {},
    isLoggedIn: o = !1,
    setIsLoggedIn: s = () => {},
    setCurrentUser: l = () => {},
    showAddCafe: d = !1,
    setShowAddCafe: p = () => {},
    onFilteredCafes: i = () => {},
  }) => {
    var S, q;
    const f = ie(),
      [u, _] = O.useState(!1),
      M = g((h) => h.themeMode),
      R = g((h) => h.setThemeMode),
      B = M === 'dark',
      W = ((S = f.palette.light) == null ? void 0 : S.main) || '#fff',
      E = g((h) => h.cafes),
      H = g((h) => h.cafeTypeFilter),
      D = g((h) => h.neighborhoodFilter),
      n = g((h) => h.setCafeTypeFilter),
      m = g((h) => h.setNeighborhoodFilter),
      x = g((h) => h.filteredCafes),
      k = g((h) => h.clearFilters),
      j = t.length > 0 ? t : E,
      T = Array.from(new Set(j.map((h) => h.category).filter(Boolean))),
      y = Array.from(
        new Set(
          j
            .map((h) => {
              var ee, te;
              return (te = (ee = h.locations) == null ? void 0 : ee[0]) == null
                ? void 0
                : te.neighborhood;
            })
            .filter(Boolean)
        )
      );
    let A = !1;
    typeof window < 'u' && window.localStorage && (A = localStorage.getItem('admin') === 'true');
    const U = () => {
        R(B ? 'light' : 'dark');
      },
      $ = () => {
        _(!0);
      },
      K = () => {
        _(!1);
      };
    return (
      O.useEffect(() => {
        i(x);
      }, [x, i]),
      e.jsxs(b, {
        sx: { display: { xs: 'none', sm: 'flex' } },
        children: [
          e.jsx(Le, {}),
          e.jsx(At, {
            position: 'fixed',
            open: u,
            color: 'transparent',
            children: e.jsx(Ne, {
              sx: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: f.palette.primary.main,
                boxShadow: `0 0.125rem 0.5rem ${f.palette.secondary.main}40`,
                color: ((q = f.palette.light) == null ? void 0 : q.main) || '#fff',
              },
              children: e.jsx(zt, {
                theme: f,
                open: u,
                darkMode: B,
                isLoggedIn: o,
                navIconColor: W,
                handleToggleDarkMode: U,
              }),
            }),
          }),
          e.jsxs(Ot, {
            variant: 'permanent',
            open: u,
            children: [
              e.jsxs(Ft, {
                children: [
                  e.jsx(C, {
                    title: 'Menu',
                    arrow: !0,
                    children: e.jsx(I, {
                      onClick: $,
                      tabIndex: 0,
                      onKeyDown: (h) => {
                        (h.key === 'Enter' || h.key === ' ') && (h.preventDefault(), $());
                      },
                      sx: {
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 1,
                        visibility: u ? 'hidden' : 'visible',
                      },
                      children: e.jsx(Be, { sx: { color: f.palette.accent.main } }),
                    }),
                  }),
                  e.jsx(C, {
                    title: 'Close Menu',
                    arrow: !0,
                    children: e.jsx(I, {
                      onClick: K,
                      tabIndex: 0,
                      onKeyDown: (h) => {
                        (h.key === 'Enter' || h.key === ' ') && (h.preventDefault(), K());
                      },
                      sx: { alignItems: 'center', justifyContent: 'center', p: 1 },
                      children:
                        f.direction === 'rtl'
                          ? e.jsx(ht, { sx: { color: f.palette.accent.main } })
                          : e.jsx(xt, { sx: { color: f.palette.accent.main } }),
                    }),
                  }),
                ],
              }),
              e.jsx(Pt, {
                isLoggedIn: o,
                isAdmin: A,
                navIconColor: W,
                open: u,
                setShowLogin: a,
                setShowAddCafe: p,
                setIsLoggedIn: s,
              }),
              e.jsx(Mt, {
                categories: T,
                neighborhoods: y,
                cafeTypeQuery: H,
                neighborhoodQuery: D,
                setCafeTypeQuery: n,
                setNeighborhoodQuery: m,
                clearFilters: k,
                navIconColor: W,
                open: u,
              }),
            ],
          }),
          e.jsx(re, {
            open: r,
            onClose: () => a(!1),
            maxWidth: 'xs',
            fullWidth: !0,
            sx: {
              '& .MuiDialog-container': {
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
              },
              '& .MuiDialog-paper': {
                margin: { xs: 1, sm: 2 },
                width: { xs: 'calc(100vw - 2rem)', sm: 'auto' },
                maxWidth: { xs: 'none', sm: '25rem' },
              },
            },
            children: e.jsx(oe, {
              sx: { p: 0 },
              children: e.jsx(Ue, { onClose: () => a(!1), setCurrentUser: l, setIsLoggedIn: s }),
            }),
          }),
          e.jsx(re, {
            open: d,
            onClose: () => p(!1),
            maxWidth: 'sm',
            fullWidth: !0,
            sx: {
              '& .MuiDialog-container': { alignItems: 'flex-start', justifyContent: 'flex-start' },
            },
            PaperProps: {
              sx: {
                position: 'absolute',
                top: '5.5rem',
                left: u ? `calc(${ae} + 1.5rem)` : '5.5rem',
              },
            },
            children: e.jsx(oe, { sx: { p: 0 }, children: e.jsx($e, { onClose: () => p(!1) }) }),
          }),
        ],
      })
    );
  },
  Nt = {
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  },
  Bt = '#222',
  Ht = (t, r) => {
    var a, o;
    return e.jsxs(b, {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      children: [
        e.jsxs(b, {
          sx: {
            position: 'relative',
            width: 300,
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...Nt,
          },
          children: [
            e.jsx(b, {
              component: 'img',
              src: '/src/assets/images/scc_logo_text.svg',
              alt: 'Logo Text',
              sx: {
                position: 'absolute',
                top: -10,
                left: 0,
                width: 300,
                height: 300,
                animation: 'spin 4.5s linear infinite',
                filter: r === 'dark' ? 'brightness(0.8)' : void 0,
                color:
                  r === 'dark'
                    ? (o = (a = t == null ? void 0 : t.palette) == null ? void 0 : a.common) == null
                      ? void 0
                      : o.light
                    : Bt,
                '&:hover': { animationPlayState: 'paused' },
              },
            }),
            e.jsx(b, {
              component: 'img',
              src: '/src/assets/images/scc_shield.svg',
              alt: 'Logo Shield',
              sx: { position: 'absolute', width: 150, height: 150 },
            }),
          ],
        }),
        e.jsx(Q, { color: 'text.primary', variant: 'h2', mt: 2, children: 'Currently Brewing...' }),
      ],
    });
  },
  ce = 56,
  Ut = () => {
    var te, fe, ge, be;
    const t = ie(),
      r = Qe();
    Ve();
    const a = g((c) => c.isLoggedIn),
      o = g((c) => c.setIsLoggedIn),
      s = g((c) => c.cafes),
      l = g((c) => c.themeMode),
      d = g((c) => c.setThemeMode),
      p = l === 'dark',
      i = ((te = t.palette.light) == null ? void 0 : te.main) || '#fff',
      f = g((c) => c.cafeTypeFilter),
      u = g((c) => c.neighborhoodFilter),
      _ = g((c) => c.setCafeTypeFilter),
      M = g((c) => c.setNeighborhoodFilter),
      R = g((c) => c.clearFilters),
      B = Array.from(new Set(s.map((c) => c.category).filter(Boolean))),
      W = Array.from(
        new Set(
          s
            .map((c) => {
              var ye, je;
              return (je = (ye = c.locations) == null ? void 0 : ye[0]) == null
                ? void 0
                : je.neighborhood;
            })
            .filter(Boolean)
        )
      );
    let E = !1;
    typeof window < 'u' && window.localStorage && (E = localStorage.getItem('admin') === 'true');
    const [H, D] = O.useState(!1),
      [n, m] = O.useState(!1),
      [x, k] = O.useState(''),
      [j, T] = O.useState(!1),
      [y, A] = O.useState(!1),
      [U, $] = O.useState(!1),
      K = (c) => {
        (c === 'main' ? ($(!1), D(!0)) : c === 'filter' && (D(!1), $(!0)),
          window.dispatchEvent(new CustomEvent('drawerStateChange', { detail: { isOpen: !0 } })));
      },
      S = () => {
        (D(!1),
          $(!1),
          window.dispatchEvent(new CustomEvent('drawerStateChange', { detail: { isOpen: !1 } })));
      },
      q = (c) => {
        (r(c), S());
      },
      h = () => {
        d(p ? 'light' : 'dark');
      },
      ee = {
        sx: {
          width: '100%',
          maxHeight: 'calc(50vh)',
          height: 'auto',
          overflowY: 'auto',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          bottom: ce,
          position: 'fixed',
          backgroundColor: t.palette.primary.main,
          color: ((fe = t.palette.light) == null ? void 0 : fe.main) || '#fff',
          boxShadow: '0px -4px 8px rgba(0,0,0,0.1)',
        },
      };
    return e.jsxs(O.Fragment, {
      children: [
        e.jsx(Ee, {
          position: 'fixed',
          sx: {
            top: 'auto',
            bottom: 0,
            width: '100vw',
            height: ce,
            display: { xs: 'flex', sm: 'none' },
            zIndex: 1200,
            borderRadius: 0,
          },
          children: e.jsxs(Ne, {
            sx: {
              minHeight: ce,
              px: 1,
              justifyContent: 'space-between',
              alignItems: 'center',
              overflowX: 'auto',
              gap: 0.5,
            },
            children: [
              e.jsxs(b, {
                sx: { display: 'flex', alignItems: 'center' },
                children: [
                  e.jsx(C, {
                    title: 'Main Menu',
                    arrow: !0,
                    children: e.jsx(I, {
                      color: 'inherit',
                      size: 'large',
                      sx: { p: 1 },
                      onClick: () => K('main'),
                      children: e.jsx(Be, { fontSize: 'medium', sx: { color: i } }),
                    }),
                  }),
                  e.jsx(C, {
                    title: 'Coffee Tastings',
                    arrow: !0,
                    children: e.jsx(I, {
                      color: 'inherit',
                      size: 'large',
                      sx: { p: 1 },
                      onClick: () => q('/tastings'),
                      children: e.jsx(de, { fontSize: 'medium', sx: { color: i } }),
                    }),
                  }),
                ],
              }),
              e.jsxs(b, {
                sx: { display: 'flex', alignItems: 'center' },
                children: [
                  e.jsx(C, {
                    title: 'Search Cafes',
                    arrow: !0,
                    children: e.jsx(I, {
                      color: 'inherit',
                      size: 'large',
                      sx: { p: 1 },
                      onClick: () => m(!0),
                      children: e.jsx(pt, { fontSize: 'medium', sx: { color: i } }),
                    }),
                  }),
                  e.jsx(C, {
                    title: 'Filter Options',
                    arrow: !0,
                    children: e.jsx(I, {
                      color: 'inherit',
                      size: 'large',
                      sx: { p: 1 },
                      onClick: () => K('filter'),
                      children: e.jsx(ft, { fontSize: 'medium', sx: { color: i } }),
                    }),
                  }),
                  a
                    ? e.jsx(C, {
                        title: 'Logout',
                        arrow: !0,
                        children: e.jsx(I, {
                          color: 'inherit',
                          size: 'large',
                          sx: { p: 1 },
                          onClick: () => {
                            (localStorage.removeItem('userToken'),
                              localStorage.removeItem('username'),
                              localStorage.removeItem('admin'),
                              o(!1),
                              q('/'));
                          },
                          children: e.jsx(ue, { fontSize: 'medium', sx: { color: i } }),
                        }),
                      })
                    : e.jsx(C, {
                        title: 'Login',
                        arrow: !0,
                        children: e.jsx(I, {
                          color: 'inherit',
                          size: 'large',
                          sx: { p: 1 },
                          onClick: () => r('/login'),
                          children: e.jsx(me, { fontSize: 'medium', sx: { color: i } }),
                        }),
                      }),
                ],
              }),
            ],
          }),
        }),
        e.jsx(he, {
          anchor: 'bottom',
          open: H,
          onClose: S,
          hideBackdrop: !1,
          PaperProps: ee,
          sx: { '& .MuiBackdrop-root': { backgroundColor: 'rgba(0, 0, 0, 0.5)' }, zIndex: 1199 },
          children: e.jsxs(se, {
            sx: { pt: 0 },
            children: [
              e.jsxs(v, {
                disablePadding: !0,
                sx: {
                  backgroundColor: t.palette.primary.dark,
                  display: 'flex',
                  justifyContent: 'space-between',
                  pl: 2,
                  pr: 1,
                  py: 0.5,
                },
                children: [
                  e.jsx(b, {
                    component: 'span',
                    sx: { fontWeight: 500, fontSize: '1.2rem', color: i },
                    children: 'Menu',
                  }),
                  e.jsx(I, { onClick: S, children: e.jsx(Ce, { sx: { color: i } }) }),
                ],
              }),
              e.jsx(v, {
                disablePadding: !0,
                children: e.jsxs(L, {
                  component: N,
                  to: '/',
                  onClick: S,
                  children: [
                    e.jsx(z, { children: e.jsx(Fe, { sx: { color: i } }) }),
                    e.jsx(P, { primary: 'Map' }),
                  ],
                }),
              }),
              e.jsx(v, {
                disablePadding: !0,
                children: e.jsxs(L, {
                  component: N,
                  to: '/tastings',
                  onClick: S,
                  children: [
                    e.jsx(z, { children: e.jsx(de, { sx: { color: i } }) }),
                    e.jsx(P, { primary: 'Tastings' }),
                  ],
                }),
              }),
              a &&
                e.jsx(v, {
                  disablePadding: !0,
                  children: e.jsxs(L, {
                    onClick: () => {
                      (A(!0), S());
                    },
                    children: [
                      e.jsx(z, { children: e.jsx(Ae, { sx: { color: i } }) }),
                      e.jsx(P, { primary: 'Add Cafe' }),
                    ],
                  }),
                }),
              a &&
                E &&
                e.jsx(v, {
                  disablePadding: !0,
                  children: e.jsxs(L, {
                    component: N,
                    to: '/admin',
                    onClick: S,
                    children: [
                      e.jsx(z, { children: e.jsx(Oe, { sx: { color: i } }) }),
                      e.jsx(P, { primary: 'Admin' }),
                    ],
                  }),
                }),
              a &&
                !E &&
                e.jsx(v, {
                  disablePadding: !0,
                  children: e.jsxs(L, {
                    component: N,
                    to: '/user',
                    onClick: S,
                    children: [
                      e.jsx(z, { children: e.jsx(_e, { sx: { color: i } }) }),
                      e.jsx(P, { primary: 'Userpage' }),
                    ],
                  }),
                }),
              e.jsx(X, { sx: { my: 1, borderColor: 'rgba(255,255,255,0.1)' } }),
              a
                ? e.jsx(v, {
                    disablePadding: !0,
                    children: e.jsxs(L, {
                      onClick: () => {
                        (localStorage.removeItem('userToken'),
                          localStorage.removeItem('username'),
                          localStorage.removeItem('admin'),
                          o(!1),
                          S(),
                          r('/'));
                      },
                      children: [
                        e.jsx(z, { children: e.jsx(ue, { sx: { color: i } }) }),
                        e.jsx(P, { primary: 'Logout' }),
                      ],
                    }),
                  })
                : e.jsx(v, {
                    disablePadding: !0,
                    children: e.jsxs(L, {
                      onClick: () => {
                        (T(!0), S());
                      },
                      children: [
                        e.jsx(z, { children: e.jsx(me, { sx: { color: i } }) }),
                        e.jsx(P, { primary: 'Login' }),
                      ],
                    }),
                  }),
              e.jsx(X, { sx: { my: 1, borderColor: 'rgba(255,255,255,0.1)' } }),
              e.jsx(v, {
                children: e.jsxs(b, {
                  sx: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  },
                  children: [
                    e.jsxs(b, {
                      sx: { display: 'flex', alignItems: 'center', gap: 1 },
                      children: [
                        p ? e.jsx(ze, { sx: { color: i } }) : e.jsx(Pe, { sx: { color: i } }),
                        e.jsx(b, { component: 'span', sx: { color: i }, children: 'Theme' }),
                      ],
                    }),
                    e.jsx(Me, {
                      checked: p,
                      onChange: h,
                      inputProps: { 'aria-label': 'toggle dark mode' },
                      sx: {
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: (ge = t.palette.light) == null ? void 0 : ge.main,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: (be = t.palette.accent) == null ? void 0 : be.main,
                        },
                      },
                    }),
                  ],
                }),
              }),
            ],
          }),
        }),
        e.jsxs(he, {
          anchor: 'bottom',
          open: U,
          onClose: S,
          hideBackdrop: !1,
          PaperProps: ee,
          sx: { '& .MuiBackdrop-root': { backgroundColor: 'rgba(0, 0, 0, 0.5)' }, zIndex: 1199 },
          children: [
            e.jsx(se, {
              sx: { pt: 0 },
              children: e.jsxs(v, {
                disablePadding: !0,
                sx: {
                  backgroundColor: t.palette.primary.dark,
                  display: 'flex',
                  justifyContent: 'space-between',
                  pl: 2,
                  pr: 1,
                  py: 0.5,
                },
                children: [
                  e.jsx(b, {
                    component: 'span',
                    sx: { fontWeight: 500, fontSize: '1.2rem', color: i },
                    children: 'Filter Cafes',
                  }),
                  e.jsx(I, { onClick: S, children: e.jsx(Ce, { sx: { color: i } }) }),
                ],
              }),
            }),
            e.jsxs(b, {
              sx: { px: 2, py: 2 },
              children: [
                e.jsxs(F, {
                  select: !0,
                  fullWidth: !0,
                  label: 'Filter by Cafe Type',
                  value: f,
                  onChange: (c) => {
                    _(c.target.value);
                  },
                  sx: {
                    mb: 2,
                    '& .MuiOutlinedInput-root': { color: 'inherit' },
                    '& .MuiInputLabel-root': { color: 'inherit' },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                  InputProps: { startAdornment: e.jsx(We, { sx: { color: i, mr: 1 } }) },
                  children: [
                    e.jsx(G, { value: '', children: 'All Types' }),
                    B.map((c) =>
                      e.jsx(G, { value: c, children: c.charAt(0).toUpperCase() + c.slice(1) }, c)
                    ),
                  ],
                }),
                e.jsxs(F, {
                  select: !0,
                  fullWidth: !0,
                  label: 'Filter by Neighborhood',
                  value: u,
                  onChange: (c) => {
                    M(c.target.value);
                  },
                  sx: {
                    mb: 2,
                    '& .MuiOutlinedInput-root': { color: 'inherit' },
                    '& .MuiInputLabel-root': { color: 'inherit' },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                  InputProps: { startAdornment: e.jsx(Re, { sx: { color: i, mr: 1 } }) },
                  children: [
                    e.jsx(G, { value: '', children: 'All Neighborhoods' }),
                    W.map((c) =>
                      e.jsx(G, { value: c, children: c.charAt(0).toUpperCase() + c.slice(1) }, c)
                    ),
                  ],
                }),
                (f || u) &&
                  e.jsx(b, {
                    sx: { display: 'flex', justifyContent: 'center' },
                    children: e.jsx(I, {
                      onClick: () => {
                        (R(), S());
                      },
                      sx: {
                        color: i,
                        border: `1px solid ${i}`,
                        borderRadius: 1,
                        px: 2,
                        fontSize: '0.875rem',
                      },
                      children: 'Clear Filters',
                    }),
                  }),
              ],
            }),
          ],
        }),
        e.jsx(re, {
          open: j,
          onClose: () => T(!1),
          maxWidth: 'xs',
          fullWidth: !0,
          children: e.jsx(oe, {
            sx: { p: 0 },
            children: e.jsx(Ue, { onClose: () => T(!1), setIsLoggedIn: o }),
          }),
        }),
        e.jsx(re, {
          open: y,
          onClose: () => A(!1),
          maxWidth: 'sm',
          fullWidth: !0,
          sx: {
            '& .MuiDialog-container': { alignItems: 'flex-start', justifyContent: 'flex-start' },
          },
          PaperProps: {
            sx: {
              position: 'absolute',
              top: 88,
              left: 24,
              width: { xs: 'calc(100% - 48px)', sm: 600 },
            },
          },
          children: e.jsx(oe, { sx: { p: 0 }, children: e.jsx($e, { onClose: () => A(!1) }) }),
        }),
        e.jsx(re, {
          open: n,
          onClose: () => m(!1),
          maxWidth: 'xs',
          fullWidth: !0,
          children: e.jsx(oe, {
            children: e.jsx(F, {
              autoFocus: !0,
              margin: 'dense',
              label: 'Search Cafes',
              type: 'text',
              fullWidth: !0,
              variant: 'outlined',
              value: x,
              onChange: (c) => k(c.target.value),
            }),
          }),
        }),
      ],
    });
  },
  $t = w.lazy(() =>
    Z(() => import('./MapPage-DmLmVasr.js'), __vite__mapDeps([4, 0, 1, 2, 3, 5, 6]))
  ),
  Qt = w.lazy(() =>
    Z(() => import('./TastingsPage-DqmTlels.js'), __vite__mapDeps([7, 1, 0, 2, 3, 8, 5, 6]))
  ),
  Vt = w.lazy(() =>
    Z(() => import('./CafePage-DyoBHIJG.js'), __vite__mapDeps([9, 1, 0, 2, 3, 5, 6]))
  ),
  qt = w.lazy(() =>
    Z(() => import('./UserPage-Ccxd9qzb.js'), __vite__mapDeps([10, 1, 0, 2, 3, 8, 5, 6]))
  ),
  Gt = w.lazy(() =>
    Z(() => import('./AdminPage-HtNz3Jf5.js'), __vite__mapDeps([11, 1, 0, 2, 3, 5]))
  ),
  Kt = () => {
    const [t, r] = w.useState(!1),
      [a, o] = w.useState(null),
      [s, l] = w.useState(!1),
      [d, p] = w.useState(!1),
      [i, f] = w.useState([]),
      [u, _] = w.useState('');
    return (
      w.useEffect(() => {
        const M = localStorage.getItem('userToken'),
          R = localStorage.getItem('username');
        M && R && (r(!0), o({ username: R }));
      }, []),
      e.jsxs(qe, {
        children: [
          e.jsx('header', {
            children: e.jsx(Dt, {
              searchResults: i,
              setSearchResults: f,
              searchQuery: u,
              setSearchQuery: _,
              showLogin: s,
              setShowLogin: l,
              isLoggedIn: t,
              setIsLoggedIn: r,
              setCurrentUser: o,
              showAddCafe: d,
              setShowAddCafe: p,
              style: { flex: 1 },
            }),
          }),
          e.jsx('main', {
            style: { flex: 1 },
            children: e.jsx(w.Suspense, {
              fallback: e.jsx(Ht, {}),
              children: e.jsxs(Ge, {
                children: [
                  e.jsx(Y, { path: '/', element: e.jsx($t, {}) }),
                  e.jsx(Y, {
                    path: '/tastings',
                    element: e.jsx(Qt, {
                      searchResults: i,
                      setSearchResults: f,
                      searchQuery: u,
                      setSearchQuery: _,
                    }),
                  }),
                  e.jsx(Y, { path: '/cafes/:cafeId', element: e.jsx(Vt, {}) }),
                  e.jsx(Y, { path: '/user', element: e.jsx(qt, { isLoggedIn: t }) }),
                  e.jsx(Y, {
                    path: '/admin',
                    element: e.jsx(Gt, { isLoggedIn: t, currentUser: a }),
                  }),
                  e.jsx(Y, { path: '*', element: e.jsx(Ke, { to: '/', replace: !0 }) }),
                ],
              }),
            }),
          }),
          e.jsx(Ut, {}),
          e.jsxs('footer', {
            hidden: !0,
            children: [
              e.jsx('p', { children: '© 2025 Stockholm Coffee Club by Jonny Hicks' }),
              e.jsx('div', {
                children: e.jsxs('ul', {
                  className: 'footer-right',
                  children: [
                    e.jsx('li', {
                      children: e.jsx('a', {
                        href: 'https://github.com/KidFromCalifornia',
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        className: 'Github',
                        'aria-label': 'Link to Github',
                        children: 'Github',
                      }),
                    }),
                    e.jsx('li', {
                      children: e.jsx('a', {
                        href: 'https://www.linkedin.com/in/jonathanwhicks/',
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        className: 'linkedin',
                        'aria-label': 'Link to LinkedIn',
                        children: 'LinkedIn',
                      }),
                    }),
                    e.jsx('li', {
                      children: e.jsx('a', {
                        href: 'https://www.instagram.com/thekidfromcalifornia',
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        className: 'instagram',
                        'aria-label': 'Link to Instagram',
                        children: 'Instagram',
                      }),
                    }),
                  ],
                }),
              }),
            ],
          }),
        ],
      })
    );
  },
  Yt = () => {
    if (
      document.querySelector('link[href*="stockholm-type"]') ||
      document.querySelector('style[data-font="stockholm-type"]')
    )
      return;
    const t = () => {
      const r = document.createElement('link');
      ((r.rel = 'stylesheet'),
        (r.href = '//font.stockholm.se/css/stockholm-type.css'),
        r.setAttribute('data-font', 'stockholm-type'),
        (r.onload = () => {
          (document.documentElement.classList.add('wf-stockholmtype-active'),
            document.documentElement.classList.add('wf-stockholmtype-n4-active'),
            document.documentElement.classList.add('wf-stockholmtype-n7-active'),
            document.documentElement.classList.add('wf-active'),
            console.log('Stockholm Type font loaded successfully'));
        }),
        (r.onerror = () => {
          (document.documentElement.classList.add('wf-stockholmtype-inactive'),
            document.documentElement.classList.add('wf-stockholmtype-n4-inactive'),
            document.documentElement.classList.add('wf-stockholmtype-n7-inactive'),
            console.warn(
              'Stockholm Type font failed to load - using Verdana fallback as per Stockholm guidelines'
            ));
        }),
        document.head.appendChild(r));
    };
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', t) : t();
  };
Yt();
const Jt = document.getElementById('root'),
  Xt = Ye.createRoot(Jt);
Xt.render(e.jsx(O.StrictMode, { children: e.jsx(Tt, { children: e.jsx(Kt, {}) }) }));
export { Wt as S, V as a, yt as c, He as s, ke as t, g as u };
