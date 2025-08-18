import CafeSearchBar from "./CafeSearchBar";
import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";

const LoginForm = lazy(() => import("./LoginForm"));
const AddCafeForm = lazy(() => import("./NewCafeForm"));

const NavBar = ({
  searchResults = [],
  setSearchResults = () => {},
  searchQuery = "",
  setSearchQuery = () => {},
  showLogin = false,
  setShowLogin = () => {},
  isLoggedIn = false,
  setIsLoggedIn = () => {},
  setCurrentUser = () => {},
  showAddCafe = false,
  setShowAddCafe = () => {},
}) => {
  // Get admin status from localStorage safely
  let isAdmin = false;
  if (typeof window !== "undefined" && window.localStorage) {
    isAdmin = localStorage.getItem("admin") === "true";
  }

  return (
    <>
      <nav>
        <div className="nav-left">
          <Link style={{ fontWeight: "bold", color: "white" }} to="/">
            {" "}
            Stockholms Coffee Club{" "}
          </Link>
        </div>
        <div className="nav-right">
          <Link to="/">Map</Link>
          <Link to="/tastings">Tastings</Link>
          {searchQuery.trim() !== "" && searchResults.length === 0 && (
            <h4 style={{ display: "flex", padding: "0", margin: "0" }}>
              Not found
            </h4>
          )}

          {isLoggedIn && (
            <>
              <Link to="/cafes">Cafes</Link>
              {!showAddCafe && (
                <button onClick={() => setShowAddCafe(true)}>Add Cafe</button>
              )}
              <Suspense fallback={<div>Loading...</div>}>
                {showAddCafe && (
                  <AddCafeForm onClose={() => setShowAddCafe(false)} />
                )}
              </Suspense>
            </>
          )}
          <CafeSearchBar
            onResults={setSearchResults}
            setQuery={setSearchQuery}
          />
          {!isLoggedIn && (
            <button onClick={() => setShowLogin(true)}>Login</button>
          )}
          {showLogin && (
            <Suspense fallback={<div>Loading...</div>}>
              <LoginForm
                onClose={() => {
                  setShowLogin(false);
                  setIsLoggedIn(!!localStorage.getItem("userToken"));
                  // Set admin status if user is admin (example logic)
                  const userIsAdmin =
                    localStorage.getItem("userRole") === "admin";
                  localStorage.setItem("admin", userIsAdmin ? "true" : "false");
                }}
                setIsLoggedIn={setIsLoggedIn}
                setCurrentUser={setCurrentUser}
              />
            </Suspense>
          )}
          {isLoggedIn && (
            <button
              onClick={() => {
                localStorage.removeItem("userToken");
                localStorage.removeItem("username");
                localStorage.removeItem("admin");
                setIsLoggedIn(false);
                setShowLogin(false);
              }}
            >
              Logout
            </button>
          )}
          {isLoggedIn && isAdmin && <Link to="/admin">Admin</Link>}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
