import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, useState, useEffect, lazy } from 'react';
import DesktopNavBar from './components/layout/DesktopNavBar.jsx';
import LoadingLogo from './components/common/LoadingLogo.jsx';
import MobileBottomNav from './components/layout/MobileBottomNav.jsx';
import { AlertProvider } from './context/AlertContext.jsx';
import { Box, useTheme, useMediaQuery } from '@mui/material';

const MapPage = lazy(() => import('./pages/MapPage.jsx'));
const TastingsPage = lazy(() => import('./pages/TastingsPage.jsx'));
const CafePage = lazy(() => import('./pages/CafePage.jsx'));
const UserPage = lazy(() => import('./pages/UserPage.jsx'));
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));
const AboutMePage = lazy(() => import('./pages/AboutMePage.jsx'));

const App = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddCafe, setShowAddCafe] = useState(false);

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const username = localStorage.getItem('username');
    if (token && username) {
      setIsLoggedIn(true);
      setCurrentUser({ username });
    }
  }, []);

  return (
    <AlertProvider>
      <Router>
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
              <Route path="/user" element={<UserPage isLoggedIn={isLoggedIn} />} />
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
