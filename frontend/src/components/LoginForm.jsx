import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const LoginForm = ({ onClose, setIsLoggedIn, setCurrentUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isSignup ? "/auth/register" : "/auth/login";
      const trimmedIdentifier = identifier.trim();
      const trimmedPassword = password.trim();
      const body = isSignup
        ? {
            username: trimmedIdentifier,
            email: email.trim(),
            password: trimmedPassword,
          }
        : {
            username: trimmedIdentifier,
            email: trimmedIdentifier,
            password: trimmedPassword,
          };
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && (data.token || data.accessToken)) {
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
    <div
      style={{
        position: "fixed",
        backgroundColor: "white",
        padding: "1rem",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        width: "200px",
        top: "0",
        right: "0",
        color: "#170351",
      }}
    >
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
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="email"
            />
            <br />
          </>
        )}
        <input
          type="text"
          placeholder={isSignup ? "Username" : "Username or Email"}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          aria-label="username-or-email"
        />
        <br />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.2rem",
          }}
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="password"
            style={{ flex: 1 }}
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
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <br />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: loading ? "#ccc" : "#170351",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            width: "100%",
          }}
        >
          {loading
            ? isSignup
              ? "Signing Up..."
              : "Logging In..."
            : isSignup
            ? "Sign Up"
            : "Login"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          aria-label="Toggle between login and signup"
          type="button"
          onClick={() => setIsSignup(!isSignup)}
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            color: "#170351",
            textDecoration: "underline",
          }}
        >
          {isSignup ? "Login" : "Sign Up"}
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
