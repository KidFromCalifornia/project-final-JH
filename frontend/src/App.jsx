import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, useState, useEffect, lazy } from 'react';
import DesktopNavBar from './components/layout/DesktopNavBar.jsx';
import LoadingLogo from './components/common/LoadingLogo.jsx';
import MobileBottomNav from './components/layout/MobileBottomNav.jsx';
import { AlertProvider } from './context/AlertContext.jsx';
import { Box, useTheme, useMediaQuery } from '@mui/material';

// Lazy load pages for performance
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
  // Global state for authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddCafe, setShowAddCafe] = useState(false);

  // State for search (only used on TastingsPage)
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Check for existing login on app start
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
          sx={{
            // Use padding instead of margin to keep content within viewport
            paddingTop: { xs: 0, sm: '64px' }, // Desktop AppBar height
            paddingLeft: { xs: 0, sm: '72px' }, // Desktop drawer width
            paddingBottom: { xs: '56px', sm: 0 }, // Mobile bottom nav height

            // Adjust dimensions to account for padding
            height: '100vh',
            width: '100vw',

            // Use box-sizing to include padding in dimensions
            boxSizing: 'border-box',

            // Keep your layout styles
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',

            // Prevent overflow
            overflow: 'auto',
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
