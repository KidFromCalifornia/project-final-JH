import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { authAPI } from "../../services/api";
import { useCafeStore } from "../../stores/useCafeStore";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Button,
  Alert,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { showAlert } from "../../styles/SwalAlertStyles";

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
    setError("");

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

        // Decode role from token
        let role = "user";
        try {
          const { jwtDecode } = await import("jwt-decode");
          const decoded = jwtDecode(token);
          role = decoded.role || "user";
        } catch {
          role = "user";
        }

        localStorage.setItem("userRole", role);
        localStorage.setItem("admin", role === "admin" ? "true" : "false");

        setIsLoggedIn(true);
        setCurrentUser({ username: data.user?.username || trimmedIdentifier });
        onClose();
      } else {
        setError(
          data.error ||
            data.message ||
            (isSignup
              ? "Signup failed. Please check your input."
              : "Invalid credentials.")
        );
      }
    } catch (err) {
      console.error("Network error:", err);
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
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" color="text.primary">
          {isSignup ? "Sign Up" : "Login"}
        </Typography>
        <IconButton onClick={onClose} aria-label="Close login form">
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {isSignup && (
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            autoComplete="email"
          />
        )}
        <TextField
          label={isSignup ? "Username" : "Username or Email"}
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          fullWidth
          autoComplete="username"
        />
        <Box sx={{ position: "relative" }}>
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            autoComplete="current-password"
          />
          <IconButton
            aria-label="Toggle password visibility"
            onClick={() => setShowPassword((prev) => !prev)}
            sx={{ position: "absolute", right: 8, top: 8 }}
            size="small"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </IconButton>
        </Box>

        <Button
          type="submit"
          disabled={loading}
          variant="contained"
          sx={{ py: 1.5, mt: 1 }}
        >
          {loading ? <CircularProgress size={24} /> : isSignup ? "Sign Up" : "Login"}
        </Button>
      </form>

      {error && <Alert severity="error">{error}</Alert>}

      <Typography align="center" sx={{ mt: 2 }}>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <Button
          onClick={() => setIsSignup(!isSignup)}
          variant="text"
          size="small"
        >
          {isSignup ? "Login" : "Sign Up"}
        </Button>
      </Typography>
    </Box>
  );
};

export default LoginForm;
