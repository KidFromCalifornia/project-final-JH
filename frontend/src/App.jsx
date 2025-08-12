import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, useState, useEffect, lazy } from "react";
import NavBar from "./components/NavBar";

// Lazy load pages for performance
const HomePage = lazy(() => import("./pages/Homepages.jsx"));
const TastingsPage = lazy(() => import("./pages/TastingsPage.jsx"));
const CafePage = lazy(() => import("./pages/CafePage.jsx"));
const UserPage = lazy(() => import("./pages/UserPage.jsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.jsx"));

export const App = () => {
  // Global state for authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

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
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
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
          />
        </header>

        <main style={{ flex: 1 }}>
          <Suspense
            fallback={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "50vh",
                  fontSize: "1.2rem",
                }}
              >
                Loading... ☕
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
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
              <Route path="/cafes" element={<CafePage />} />
              <Route
                path="/user"
                element={<UserPage isLoggedIn={isLoggedIn} />}
              />
              <Route
                path="/admin"
                element={
                  <AdminPage
                    isLoggedIn={isLoggedIn}
                    currentUser={currentUser}
                  />
                }
              />
            </Routes>
          </Suspense>
        </main>

        <footer
          style={{
            padding: "1rem",
            textAlign: "center",
            backgroundColor: "#f5f5f5",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <p style={{ margin: 0, color: "#666" }}>
            © 2024 Stockholm Coffee Club ☕
          </p>
        </footer>
      </div>
    </Router>
  );
};
