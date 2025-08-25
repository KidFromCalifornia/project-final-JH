import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { authAPI } from "../services/api";
import { useCafeStore } from "../useCafeStore";
import {
  Box,
  Alert,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";

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
    <Box
      bgcolor="inherited"
      sx={{
        position: "fixed",
        width: { xs: "90vw", sm: 400 },
        top: 0,
        left: 0,
        zIndex: 1300,
        backgroundColor: "light",
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
      <Box component="form" onSubmit={handleSubmit}>
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
        <Box sx={{ position: "relative" }}>
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
            sx={{}}
          />
          <IconButton
            aria-label="Toggle password visibility"
            onClick={() => setShowPassword((prev) => !prev)}
            sx={{ position: "absolute", right: 8, top: 32 }}
            size="small"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </IconButton>
        </Box>
        <Button
          type="submit"
          disabled={loading}
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            mb: 1,
            minHeight: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: "secondary.main" }} />
          ) : null}
          {!loading && (isSignup ? "Sign Up" : "Login")}
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Typography align="center" sx={{ mt: 2 }}>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <Button
          aria-label="Toggle between login and signup"
          type="button"
          onClick={() => setIsSignup(!isSignup)}
          variant="text"
          color="primary"
        >
          {isSignup ? "Login" : "Sign Up"}
        </Button>
      </Typography>
    </Box>
  );
};

export default LoginForm;
