import CafeSearchBar from "./CafeSearchBar";
import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";

const LoginForm = lazy(() => import("./LoginForm"));
const AddCafeForm = lazy(() => import("./NewCafeForm"));

const NavBar = ({
  searchResults,
  setSearchResults,
  searchQuery,
  setSearchQuery,
  showLogin,
  setShowLogin,
  isLoggedIn,
  setIsLoggedIn,
  setCurrentUser,
  showAddCafe,
  setShowAddCafe,
}) => {
  return (
    <>
      <nav>
        <div className="nav-left">
          <h1> Stockholms Coffee Club </h1>
        </div>
        <div className="nav-right">
          <Link to="/">Map</Link>
          <Link to="/cafes">Cafes</Link>
          {isLoggedIn && (
            <>
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

          <Link to="/tastings">Tastings</Link>
          {searchQuery.trim() !== "" && searchResults.length === 0 && (
            <h4 style={{ display: "flex", padding: "0", margin: "0" }}>
              Not found
            </h4>
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
                setIsLoggedIn(false);
                setShowLogin(false);
              }}
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
