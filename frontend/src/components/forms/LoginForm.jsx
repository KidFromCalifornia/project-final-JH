import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
  Tooltip,
  useTheme,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { showAlert } from "../../styles/SwalAlertStyles";

const LoginForm = ({ onClose, setCurrentUser, setIsLoggedIn }) => {
  const theme = useTheme();
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
      // Only show sweet alert if server is completely down (network error)
      if (err.code === 'NETWORK_ERROR' || err.message?.includes('fetch') || !err.response) {
        showAlert({
          title: "Server Unavailable",
          text: "We couldn't reach the server. Please try again later.",
          icon: "error",
        });
      } else {
        // For other errors, just set the error state for inline display
        setError(isSignup ? "Signup failed. Please try again." : "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: 400 },
        maxWidth: { xs: "none", sm: 400 },
        p: { xs: 2, sm: 3 },
        display: "flex",
        flexDirection: "column",
        gap: 2,
        backgroundColor: theme.palette.light.main,
        borderRadius: 2,
        boxShadow: 3,
        color: theme.palette.text.primary,
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
        minHeight: "auto",
      }}
    >
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        mb: 1,
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: theme.palette.text.primary,
            fontSize: { xs: "1.5rem", sm: "2rem" },
          }}
        >
          {isSignup ? "Sign Up" : "Login"}
        </Typography>
        <IconButton 
          onClick={onClose} 
          aria-label="Close login form" 
          color="inherit"
          sx={{ 
            p: { xs: 1, sm: 1.5 },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit} style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 16,
        width: "100%",
      }}>
        {isSignup && (
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            autoComplete="email"
            color="primary"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.common.white,
                minHeight: { xs: 56, sm: 48 }, // Larger touch targets on mobile
                '& fieldset': {
                  borderColor: theme.palette.text.primary,
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '& input': {
                  color: theme.palette.text.primary,
                  fontSize: { xs: "16px", sm: "14px" }, // Prevents zoom on iOS
                },
              },
              '& .MuiInputLabel-root': {
                color: theme.palette.text.primary,
                '&.Mui-focused': {
                  color: theme.palette.primary.main,
                },
              },
            }}
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
          color="primary"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: theme.palette.common.white,
              minHeight: { xs: 56, sm: 48 }, // Larger touch targets on mobile
              '& fieldset': {
                borderColor: theme.palette.text.primary,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '& input': {
                color: theme.palette.text.primary,
                fontSize: { xs: "16px", sm: "14px" }, // Prevents zoom on iOS
              },
            },
            '& .MuiInputLabel-root': {
              color: theme.palette.text.primary,
              '&.Mui-focused': {
                color: theme.palette.primary.main,
              },
            },
          }}
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
            color="primary"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.common.white,
                minHeight: { xs: 56, sm: 48 }, // Larger touch targets on mobile
                '& fieldset': {
                  borderColor: theme.palette.text.primary,
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '& input': {
                  color: theme.palette.text.primary,
                  fontSize: { xs: "16px", sm: "14px" }, // Prevents zoom on iOS
                },
              },
              '& .MuiInputLabel-root': {
                color: theme.palette.text.primary,
                '&.Mui-focused': {
                  color: theme.palette.primary.main,
                },
              },
            }}
          />
          <Tooltip title={showPassword ? "Hide password" : "Show password"}>
            <IconButton
              aria-label="Toggle password visibility"
              onClick={() => setShowPassword((prev) => !prev)}
              sx={{ 
                position: "absolute", 
                right: 8, 
                top: 8,
                color: theme.palette.text.primary,
                "&:hover": {
                  color: theme.palette.primary.main,
                }
              }}
              size="small"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Tooltip>
        </Box>
        <Button
          type="submit"
          disabled={loading}
          variant="contained"
          color="primary"
          sx={{ 
            py: { xs: 1.5, sm: 1.5 },
            px: { xs: 2, sm: 3 },
            mt: 1,
            minHeight: { xs: 48, sm: 42 }, // Better touch targets
            fontSize: { xs: "16px", sm: "14px" },
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
            '&:disabled': {
              backgroundColor: theme.palette.action.disabled,
              color: theme.palette.text.disabled,
            }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : isSignup ? "Sign Up" : "Login"}
        </Button>
    </form>

      {error && <Alert severity="error">{error}</Alert>}

      <Typography align="center" sx={{ mt: 2, color: theme.palette.text.primary }}>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <Button
          onClick={() => setIsSignup(!isSignup)}
          variant="text"
          size="small"
          color="primary"
          sx={{
            textDecoration: 'underline',
            backgroundColor: 'transparent',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              transform: 'scale(1.05)',
boxShadow: 'none',
            }
          }}
        >
          {isSignup ? "Login" : "Sign Up"}
        </Button>
      </Typography>
    </Box>
  );
};

export default LoginForm;
