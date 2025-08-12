const LoginForm = lazy(() => import("./LoginForm"));
import CafeSearchBar from "./CafeSearchBar";
import { Link } from "react-router-dom";
import { Suspense } from "react";

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
}) => {
  return (
    <>
      <nav>
        <div>
          <h1> Stockholms Coffee Club </h1>
        </div>
        <div>
          <Link to="/">Home</Link>
          <Link to="/cafes">Cafes</Link>
          <button onClick={() => setShowAddCafe(true)}>Add Cafe</button>
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
