import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { authAPI } from "../services/api";
import { SwalAlertStyles } from "./SwalAlertStyles";
import { useCafeStore } from "../useCafeStore";

import styled from "styled-components";
import TextInput from "./TextInput";

const LoginForm = ({ onClose, setCurrentUser, setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const error = useCafeStore((state) => state.fetchError);
  const setError = useCafeStore((state) => state.setFetchError);
  const loading = useCafeStore((state) => state.loading);
  const setLoading = useCafeStore((state) => state.setLoading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const trimmedIdentifier = identifier.trim();
      const trimmedPassword = password.trim();
      let data;
      if (isSignup) {
        data = await authAPI.register({
          username: trimmedIdentifier,
          email: email.trim(),
          password: trimmedPassword,
        });
      } else {
        data = await authAPI.login({
          username: trimmedIdentifier,
          email: trimmedIdentifier,
          password: trimmedPassword,
        });
      }

      if (data.token || data.accessToken) {
        const token = data.token || data.accessToken;
        localStorage.setItem("userToken", token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem(
          "username",
          data.user?.username || trimmedIdentifier
        );
        // Decode token to get role
        let role = "user";
        try {
          // Use jwtDecode for ESM import
          const { jwtDecode } = await import("jwt-decode");
          const decoded = jwtDecode(token);
          role = decoded.role || "user";
        } catch (err) {
          // fallback if decode fails
          role = "user";
        }
        localStorage.setItem("userRole", role);
        localStorage.setItem("admin", role === "admin" ? "true" : "false");

        setIsLoggedIn(true);
        setCurrentUser({ username: data.user?.username || trimmedIdentifier });
        setError("");
        onClose();
      } else {
        setError(
          data.error ||
            data.message ||
            (isSignup ? "Signup failed. Try again." : "Invalid credentials")
        );
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError(isSignup ? "Signup failed. Try again." : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginFormContainer>
      <button
        type="button"
        aria-label="Close login form"
        onClick={onClose}
        style={{
          float: "right",
          cursor: "pointer",
          background: "none",
          border: "none",
          fontSize: "1.5rem",
        }}
      >
        ×
      </button>

      <h2>{isSignup ? "Sign Up" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <TextInput
            label="Email:"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            aria-label="email"
          />
        )}
        <TextInput
          label={isSignup ? "Username:" : "Username or Email:"}
          name="identifier"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          type="text"
          aria-label="username-or-email"
        />
        <TextInput
          label="Password:"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          type={showPassword ? "text" : "password"}
          aria-label="password"
        />
        <button
          aria-label="Toggle password visibility"
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            fontSize: "1rem",
            color: "#666",
            padding: "0.25rem",
            marginBottom: "1rem",
          }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
        <button type="submit" disabled={loading} className="login-submit-btn">
          {loading
            ? isSignup
              ? "Signing Up..."
              : "Logging In..."
            : isSignup
            ? "Sign Up"
            : "Login"}
        </button>
      </form>
      {error && <SwalAlertStyles message={error} type="error" />}
      <LoginToggleText>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          aria-label="Toggle between login and signup"
          type="button"
          onClick={() => setIsSignup(!isSignup)}
          className="login-toggle-btn"
        >
          {isSignup ? "Login" : "Sign Up"}
        </button>
      </LoginToggleText>
    </LoginFormContainer>
  );
};

export default LoginForm;

const LoginFormContainer = styled.div`
  position: fixed;
  background-color: white;
  padding: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: ${({ theme }) => theme.containerWidths.md};
  top: 0;
  left: 0;
  color: ${({ theme }) => theme.colors.textDark};

  .login-submit-btn {
    padding: 0.5rem 1rem;
    background-color: #170351;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
    margin-top: 1rem;
    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
  .login-toggle-btn {
    cursor: pointer;
    background: none;
    border: none;
    color: #170351;
    text-decoration: underline;
    font-size: 1rem;
  }
`;

const LoginToggleText = styled.p`
  text-align: center;
  margin-top: 1rem;
`;
