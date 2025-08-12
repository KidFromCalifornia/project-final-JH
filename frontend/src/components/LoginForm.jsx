import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const LoginForm = ({ onClose, setIsLoggedIn, setCurrentUser }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    try {
      const endpoint = isSignup ? "/auth/register" : "/auth/login";
      const body = isSignup
        ? {
            username: trimmedUsername,
            email: trimmedEmail,
            password: trimmedPassword,
          }
        : {
            email: trimmedEmail || trimmedUsername, // Use email for login, fallback to username
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
        localStorage.setItem(
          "username",
          data.user?.username || trimmedUsername
        );
        setIsLoggedIn(true);
        setCurrentUser({ username: data.user?.username || trimmedUsername });
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
    <div>
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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          aria-label="username"
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
            backgroundColor: loading ? "#ccc" : "#8B4513",
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
            color: "#8B4513",
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
