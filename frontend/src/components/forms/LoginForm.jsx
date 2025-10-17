import { useState } from 'react';
import { Visibility, VisibilityOff, Close as CloseIcon } from '@mui/icons-material';
import { authAPI } from '../../services/api';
import { useCafeStore } from '../../stores/useCafeStore';
import {
  Box,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Button,
  Tooltip,
  useTheme,
  Paper,
} from '@mui/material';
import { useAlert } from '../../context/AlertContext';

const LoginForm = ({ onClose, setCurrentUser, setIsLoggedIn }) => {
  const theme = useTheme();
  const { showSnackbar } = useAlert();
  const [formData, setFormData] = useState({
    email: '',
    identifier: '',
    password: '',
  });
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const loading = useCafeStore((state) => state.loading);
  const setLoading = useCafeStore((state) => state.setLoading);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { identifier, email, password } = formData;
      const trimmedIdentifier = identifier.trim();
      const trimmedPassword = password.trim();

      const payload = isSignup
        ? { username: trimmedIdentifier, email: email.trim(), password: trimmedPassword }
        : { username: trimmedIdentifier, email: trimmedIdentifier, password: trimmedPassword };

      const data = isSignup ? await authAPI.register(payload) : await authAPI.login(payload);

      if (data.token || data.accessToken) {
        // Success case - user exists and credentials are correct
        const token = data.token || data.accessToken;
        // Update localStorage
        localStorage.setItem('userToken', token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('username', data.user?.username || trimmedIdentifier);

        // Get user role from token
        try {
          const { jwtDecode } = await import('jwt-decode');
          const decoded = jwtDecode(token);
          const role = decoded.role || 'user';
          localStorage.setItem('userRole', role);
          localStorage.setItem('admin', role === 'admin' ? 'true' : 'false');
        } catch {
          localStorage.setItem('userRole', 'user');
          localStorage.setItem('admin', 'false');
        }

        // Update both local state and store state
        const setStoreIsLoggedIn = useCafeStore.getState().setIsLoggedIn;
        setStoreIsLoggedIn(true); // Update store first
        setIsLoggedIn(true); // Then update local state
        setCurrentUser({ username: data.user?.username || trimmedIdentifier });
        onClose();
      } else {
        // Server returned success but no token - likely authentication error
        const errorMessage =
          data.error ||
          data.message ||
          'Invalid credentials. Please check your username/email and password.';
        showSnackbar(errorMessage, 'error');
      }
    } catch (err) {
      console.log('Login error:', err);

      // Check for actual network connectivity issues
      if (
        (err.name === 'TypeError' && err.message.includes('fetch')) ||
        err.message.includes('NetworkError') ||
        err.message.includes('Failed to fetch') ||
        !navigator.onLine
      ) {
        // True network error - no internet or server unreachable
        showSnackbar(
          "We couldn't reach the server. Please check your internet connection and try again.",
          'error'
        );
      } else if (err.message.includes('timeout') || err.message.includes('Request timeout')) {
        // Request timeout
        showSnackbar('Request timed out. Please try again.', 'error');
      } else {
        // Authentication or other server errors (invalid credentials, user doesn't exist, etc.)
        const errorMessage =
          err.message ||
          (isSignup
            ? 'Signup failed. Please try again.'
            : 'Invalid credentials. Please check your username/email and password.');
        showSnackbar(errorMessage, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Screen reader only styles
  const screenReaderOnly = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  };

  return (
    <Box
      sx={{
        width: { xs: '100%', sm: 400 },
        maxWidth: { xs: 'none', sm: 400 },
        p: { xs: 2, sm: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
      role="dialog"
      aria-labelledby="login-form-title"
      aria-describedby="login-form-description"
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography id="login-form-title" color={theme.palette.background.default} variant="h4">
          {isSignup ? 'Sign Up' : 'Login'}
        </Typography>
        <Tooltip title="Close login form">
          <IconButton onClick={onClose} aria-label="Close login form">
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Screen reader only description */}
      <Typography id="login-form-description" variant="body2" sx={{ ...screenReaderOnly }}>
        {isSignup
          ? 'Create your account to start exploring coffee cafes and tastings.'
          : 'Enter your credentials to access your account.'}
      </Typography>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        backgroundColor={'transparent'}
        style={{
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          width: '100%',
          backgroundColor: 'transparent',
        }}
        aria-labelledby="login-form-title"
      >
        {isSignup && (
          <Tooltip title="Enter your email address for account registration and notifications">
            <TextField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="email"
              variant="outlined"
              aria-label="Email address for registration"
              aria-describedby="email-helper"
              helperText="We'll use this for account verification and updates"
              FormHelperTextProps={{
                id: 'email-helper',
                sx: { ...screenReaderOnly },
              }}
            />
          </Tooltip>
        )}

        <Tooltip
          title={
            isSignup
              ? 'Choose a unique username for your account'
              : 'Enter your username or email address'
          }
        >
          <TextField
            label={isSignup ? 'Username' : 'Email'}
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            required
            fullWidth
            autoComplete="username"
            variant="outlined"
            aria-label={isSignup ? 'Username for registration' : 'Email or username for login'}
            aria-describedby="identifier-helper"
            helperText={
              isSignup
                ? 'This will be your display name'
                : 'Enter your registered email or username'
            }
            FormHelperTextProps={{
              id: 'identifier-helper',
              sx: { ...screenReaderOnly },
            }}
          />
        </Tooltip>

        <Box sx={{ position: 'relative' }}>
          <Tooltip title="Enter your password (minimum 6 characters)">
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="current-password"
              variant="outlined"
              aria-label="Password for authentication"
              aria-describedby="password-helper"
              helperText={
                isSignup
                  ? 'Choose a strong password for your account'
                  : 'Enter your account password'
              }
              FormHelperTextProps={{
                id: 'password-helper',
                sx: { ...screenReaderOnly },
              }}
            />
          </Tooltip>
          <Tooltip title={showPassword ? 'Hide password' : 'Show password'}>
            <IconButton
              aria-label="Toggle password visibility"
              onClick={() => setShowPassword((prev) => !prev)}
              color={theme.palette.mode === 'dark' ? 'secondary' : 'default'}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
              size="small"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Tooltip>
        </Box>

        <Tooltip title={isSignup ? 'Create your new account' : 'Sign in to your account'}>
          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            aria-label={
              loading ? 'Processing authentication' : isSignup ? 'Create account' : 'Sign in'
            }
            sx={{
              py: { xs: 1.5, sm: 1.5 },
              px: { xs: 2, sm: 3 },
              mt: 1,
              minHeight: { xs: 48, sm: 42 },
              '&:hover': {
                backgroundColor: theme.palette.muted.main,
                color: theme.palette.secondary.main,
                fontWeight: 600,
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} aria-label="Loading" />
            ) : isSignup ? (
              'Sign Up'
            ) : (
              'Login'
            )}
          </Button>
        </Tooltip>
      </Paper>

      <Typography
        align="center"
        variant="body2"
        sx={{
          mt: 2,
        }}
      >
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
        <Tooltip title={isSignup ? 'Switch to login form' : 'Switch to signup form'}>
          <Button
            onClick={() => setIsSignup(!isSignup)}
            variant="text"
            size="small"
            aria-label={isSignup ? 'Switch to login form' : 'Switch to signup form'}
            sx={{
              ml: 1,
              fontWeight: 'bold',
              '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
            }}
          >
            {isSignup ? 'Login' : 'Sign Up'}
          </Button>
        </Tooltip>
      </Typography>
    </Box>
  );
};

export default LoginForm;
