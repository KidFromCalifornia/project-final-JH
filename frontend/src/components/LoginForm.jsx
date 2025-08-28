import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { authAPI } from "../services/api";
import { useCafeStore } from "../useCafeStore";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import { showAlert } from "./SwalAlertStyles";

const LoginForm = ({ onClose, setCurrentUser, setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const error = useCafeStore((state) => state.fetchError); // Ensure error handling is correct
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
        const message =
          data.error ||
          data.message ||
          (isSignup ? "Signup failed. Try again." : "Invalid credentials");
        // User-caused error → show inline MUI alert
        setError(message);
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError("");
      showAlert({
        title: isSignup ? "Unable to sign up" : "Unable to log in",
        text: "We couldn't reach the server. Please try again.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: { xs: "90vw", sm: 400 },
        top: 0,
        left: 0,

        bgcolor: (theme) => theme.palette.background.paper,
      }}
    >
      <IconButton
        aria-label="Close login form"
        onClick={onClose}
        sx={{ float: "right", fontSize: "1.5rem", bgcolor: "transparent" }}
      >
        ×
      </IconButton>
      <Typography variant="h2" sx={{ mb: 2 }}>
        {isSignup ? "Sign Up" : "Login"}
      </Typography>
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <TextField
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            fullWidth
            margin="normal"
            autoComplete="email"
          />
        )}
        <TextField
          label={isSignup ? "Username" : "Username or Email"}
          name="identifier"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          type="text"
          fullWidth
          margin="normal"
          autoComplete="username"
        />
        <div style={{ position: "relative" }}>
          <TextField
            label="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            autoComplete="current-password"
          />
          <IconButton
            aria-label="Toggle password visibility"
            onClick={() => setShowPassword((prev) => !prev)}
            sx={{ position: "absolute", right: 8, top: 32 }}
            size="small"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </IconButton>
        </div>
        <Button
          type="submit"
          disabled={loading}
          sx={{
            mt: 2,
            mb: 1,
            minHeight: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
            boxShadow: 2,
          }}
        >
          {loading ? (
            <CircularProgress
              size={20}
              sx={{ color: (theme) => theme.palette.secondary.main }}
            />
          ) : null}
          {!loading && (isSignup ? "Sign Up" : "Login")}
        </Button>
      </form>
      {error && (
        <Box sx={{ mt: 2 }}>
          <Typography color={(theme) => theme.palette.error.main}>
            {error}
          </Typography>
        </Box>
      )}
      <Typography align="center" sx={{ mt: 2 }}>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <Button
          aria-label="Toggle between login and signup"
          type="button"
          onClick={() => setIsSignup(!isSignup)}
          variant="text"
          sx={{ padding: 3 }}
        >
          {isSignup ? "Login" : "Sign Up"}
        </Button>
      </Typography>
    </Box>
  );
};
export default LoginForm;
