import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, useState, useEffect, lazy } from "react";
import NavBar from "./components/NavBar";
import LoadingLogo from "./components/LoadingLogo.jsx";

// Lazy load pages for performance
const MapPage = lazy(() => import("./pages/MapPage.jsx"));
const TastingsPage = lazy(() => import("./pages/TastingsPage.jsx"));
const CafePage = lazy(() => import("./pages/CafePage.jsx"));
const UserPage = lazy(() => import("./pages/UserPage.jsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.jsx"));

export const App = () => {
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
    if (token && username) {
      setIsLoggedIn(true);
      setCurrentUser({ username });
    }
  }, []);

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
      </main>

      <footer hidden>
        <p>© 2025 Stockholm Coffee Club by Jonny Hicks</p>
        <div>
          <ul className="footer-right">
            <li>
              <a
                href="https://github.com/KidFromCalifornia"
                target="_blank"
                className="Github"
                alt=" Link to Github"
              ></a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/jonathanwhicks/"
                target="_blank"
                className="linkedin"
                alt=" Link to linkdin"
              ></a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/thekidfromcalifornia"
                target="_blank"
                className="instagram"
                alt=" Link to instagram"
              ></a>
            </li>
          </ul>
        </div>
      </footer>
    </Router>
  );
};
