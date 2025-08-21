import CafeSearchBar from "./CafeSearchBar";
import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";
import styled from "styled-components";
import { ButtonDark, ButtonLight, NavButton } from "./ButtonStyles";

const LoginForm = lazy(() => import("./LoginForm"));
const AddCafeForm = lazy(() => import("./NewCafeForm"));

const NavBarContainer = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.secondary};
  width: ${({ theme }) => theme.containerWidths.large};
  height: 25dvh;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 0;

  @media screen and (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.secondary};
    width: ${({ theme }) => theme.containerWidths.large};
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;
  }
`;

const NavTop = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.sm};
`;

const NavBottom = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: ${({ theme }) => theme.spacing.sm};
`;

const NavLink = styled(ButtonDark)`
  color: ${({ theme }) => theme.colors.textLight};
  text-decoration: none;
  font-weight: bold;
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
      <NavBarContainer>
        <NavTop>
          <NavLink style={{ fontWeight: "bold", color: "white" }} to="/">
            {" "}
            Stockholms Coffee Club{" "}
          </NavLink>
        </NavTop>
        <NavBottom>
          <NavLink to="/">Map</NavLink>
          <NavLink to="/tastings">Tastings</NavLink>
          {searchQuery.trim() !== "" && searchResults.length === 0 && (
            <h4 style={{ display: "flex", padding: "0", margin: "0" }}>
              Not found
            </h4>
          )}

          {isLoggedIn && (
            <>
              {!showAddCafe && (
                <NavButton onClick={() => setShowAddCafe(true)}>
                  Add Cafe
                </NavButton>
              )}
              <Suspense fallback={<div>Loading...</div>}>
                {showAddCafe && (
                  <AddCafeForm onClose={() => setShowAddCafe(false)} />
                )}
              </Suspense>
            </>
          )}

          {!isLoggedIn && (
            <NavButton onClick={() => setShowLogin(true)}>Login</NavButton>
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
            <NavButton
              onClick={() => {
                localStorage.removeItem("userToken");
                localStorage.removeItem("username");
                localStorage.removeItem("admin");
                setIsLoggedIn(false);
                setShowLogin(false);
              }}
            >
              Logout
            </NavButton>
          )}
          {isLoggedIn && isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </NavBottom>
      </NavBarContainer>
    </>
  );
};

export default NavBar;
