import CafeSearchBar from "./CafeSearchBar";
import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";
import styled from "styled-components";
import { ButtonDark, ButtonLight } from "./ButtonStyles";

const LoginForm = lazy(() => import("./LoginForm"));
const AddCafeForm = lazy(() => import("./NewCafeForm"));

const NavBarContainer = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.navbarBackground};
  width: ${({ theme }) => theme.containerWidths.large};
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 500;
`;

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
              {!showAddCafe && (
                <ButtonLight onClick={() => setShowAddCafe(true)}>
                  Add Cafe
                </ButtonLight>
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
            <ButtonLight onClick={() => setShowLogin(true)}>Login</ButtonLight>
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
