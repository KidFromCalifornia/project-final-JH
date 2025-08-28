import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, useState, useEffect, lazy } from "react";
import NavBar from "./components/layout/NavBar";
import LoadingLogo from "./components/common/LoadingLogo.jsx";
import MobileBottomNav from "./components/layout/MobileBottomNav.jsx";

// Lazy load pages for performance
const MapPage = lazy(() => import("./pages/MapPage.jsx"));
const TastingsPage = lazy(() => import("./pages/TastingsPage.jsx"));
const CafePage = lazy(() => import("./pages/CafePage.jsx"));
const UserPage = lazy(() => import("./pages/UserPage.jsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.jsx"));

const App = () => {
  // Global state for authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddCafe, setShowAddCafe] = useState(false);

  // State for search (only used on TastingsPage)
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Check for existing login on app start
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const username = localStorage.getItem("username");
    console.log("App loading - token:", !!token, "username:", username); // Debug log
    if (token && username) {
      setIsLoggedIn(true);
      setCurrentUser({ username });
    }
  }, []);

  console.log("App render - showLogin:", showLogin, "isLoggedIn:", isLoggedIn); // Debug log

  return (
    <Router>
      <header>
        <NavBar
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
      </header>

      <main style={{ flex: 1 }}>
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
              path="/user"
              element={<UserPage isLoggedIn={isLoggedIn} />}
            />
            <Route
              path="/admin"
              element={
                <AdminPage isLoggedIn={isLoggedIn} currentUser={currentUser} />
              }
            />
          </Routes>
        </Suspense>
        {/* Debug info */}
        <div style={{ position: 'fixed', bottom: 10, right: 10, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '5px', fontSize: '12px', zIndex: 9999 }}>
          Login: {showLogin ? 'true' : 'false'} | LoggedIn: {isLoggedIn ? 'true' : 'false'}
        </div>
      </main>

      <MobileBottomNav />

      <footer hidden>
        <p>© 2025 Stockholm Coffee Club by Jonny Hicks</p>
        <div>
          <ul className="footer-right">
            <li>
              <a
                href="https://github.com/KidFromCalifornia"
                target="_blank"
                rel="noopener noreferrer"
                className="Github"
                aria-label="Link to Github"
              >
                Github
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/jonathanwhicks/"
                target="_blank"
                rel="noopener noreferrer"
                className="linkedin"
                aria-label="Link to LinkedIn"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/thekidfromcalifornia"
                target="_blank"
                rel="noopener noreferrer"
                className="instagram"
                aria-label="Link to Instagram"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </Router>
  );
};

export default App;
