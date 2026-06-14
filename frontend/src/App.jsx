import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, useState, useEffect, lazy } from 'react';
import usePageTracking from './hooks/usePageTracking.js';
import ConsentBanner from './components/common/ConsentBanner.jsx';
import DesktopNavBar from './components/layout/DesktopNavBar.jsx';
import LoadingLogo from './components/common/LoadingLogo.jsx';
import MobileBottomNav from './components/layout/MobileBottomNav.jsx';
import { AlertProvider } from './context/AlertContext.jsx';
import { Box, Alert, IconButton, useTheme, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCafeStore } from './stores/useCafeStore.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const MapPage = lazy(() => import('./pages/MapPage.jsx'));
const TastingsPage = lazy(() => import('./pages/TastingsPage.jsx'));
const CafePage = lazy(() => import('./pages/CafePage.jsx'));
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));
const AboutMePage = lazy(() => import('./pages/AboutMePage.jsx'));

const PageTracker = () => { usePageTracking(); return null; };

const App = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddCafe, setShowAddCafe] = useState(false);
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [dismissedAlerts, setDismissedAlerts] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('dismissedAlerts') || '{}');
      const now = Date.now();
      const threeDays = 3 * 24 * 60 * 60 * 1000;
      return Object.fromEntries(Object.entries(stored).filter(([, ts]) => now - ts < threeDays));
    } catch { return {}; }
  });

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const setCafes = useCafeStore((state) => state.setCafes);
  const cafes = useCafeStore((state) => state.cafes);

  useEffect(() => {
    if (cafes.length === 0) {
      fetch(`${API_BASE}/cafes`).then((r) => r.json()).then((d) => { if (d?.data) setCafes(d.data); }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const username = localStorage.getItem('username');
    if (token && username) {
      setIsLoggedIn(true);
      setCurrentUser({ username });
    }
  }, []);

  useEffect(() => {
    const fetchAlerts = () => {
      fetch(`${API_BASE}/alerts`)
        .then((r) => r.json())
        .then((d) => { if (d?.data) setLiveAlerts(d.data); })
        .catch(() => {});
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const visibleAlerts = liveAlerts.filter((a) => !dismissedAlerts[a._id]);

  const dismissAlert = (id) => {
    const updated = { ...dismissedAlerts, [id]: Date.now() };
    setDismissedAlerts(updated);
    try { localStorage.setItem('dismissedAlerts', JSON.stringify(updated)); } catch {}
  };

  return (
    <AlertProvider>
      <Router>
        <PageTracker />
        <ConsentBanner />
        {visibleAlerts.length > 0 && (
          <Box sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2000,
            width: '80%',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}>
            {visibleAlerts.map((a) => (
              <Alert
                key={a._id}
                severity={a.severity || 'info'}
                variant="outlined"
                action={
                  <IconButton size="small" onClick={() => dismissAlert(a._id)}>
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{
                  borderWidth: 2,
                  borderRadius: 2,
                  backdropFilter: 'blur(6px)',
                  backgroundColor: 'background.paper',
                  '& .MuiAlert-message': { fontWeight: 700, fontSize: '1rem' },
                }}
              >
                {a.message}
              </Alert>
            ))}
          </Box>
        )}
        {isDesktop && (
          <Box component="header">
            <DesktopNavBar
              component="nav"
              searchResults={searchResults}
              setSearchResults={setSearchResults}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              showLogin={showLogin}
              setShowLogin={setShowLogin}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
              showAddCafe={showAddCafe}
              setShowAddCafe={setShowAddCafe}
              style={{ flex: 1 }}
            />
          </Box>
        )}

        <Box
          component="main"
          role="main"
          aria-label="Main content"
          sx={{
            paddingTop: { xs: 0, sm: '64px' },
            paddingLeft: { xs: 0, sm: '72px' },
            paddingBottom: { xs: '56px', sm: 0 },
            height: '100vh',
            width: '100vw',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'auto',
          }}
          tabIndex={-1}
          onKeyDown={(e) => {
            const container = e.currentTarget;
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              container.scrollTop -= 50;
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              container.scrollTop += 50;
            } else if (e.key === 'PageUp') {
              e.preventDefault();
              container.scrollTop -= container.clientHeight;
            } else if (e.key === 'PageDown') {
              e.preventDefault();
              container.scrollTop += container.clientHeight;
            } else if (e.key === 'Home') {
              e.preventDefault();
              container.scrollTop = 0;
            } else if (e.key === 'End') {
              e.preventDefault();
              container.scrollTop = container.scrollHeight;
            }
          }}
        >
          <Suspense fallback={<LoadingLogo />}>
            <Routes>
              <Route path="/" element={<MapPage />} />
              <Route
                path="/tastings"
                element={
                  <TastingsPage
                    searchResults={searchResults}
                    setSearchResults={setSearchResults}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                }
              />
              <Route path="/cafes/:cafeId" element={<CafePage />} />
              <Route
                path="/admin"
                element={<AdminPage isLoggedIn={isLoggedIn} currentUser={currentUser} />}
              />
              <Route path="/about" element={<AboutMePage />} />
              {/* Catch-all route for unmatched paths */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Box>
        {isMobile && (
          <footer>
            <MobileBottomNav />
          </footer>
        )}
      </Router>
    </AlertProvider>
  );
};

export default App;
