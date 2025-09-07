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

        setIsLoggedIn(true);
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
      console.log('Login error:', err); // Debug log to see the actual error

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

  // Common styles for TextField components
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: theme.palette.common.white,
      minHeight: { xs: 56, sm: 48 },
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
        fontSize: { xs: '16px', sm: '14px' },
      },
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.text.primary,
      '&.Mui-focused': {
        color: theme.palette.primary.main,
      },
    },
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
        backgroundColor: theme.palette.light.main,
        borderRadius: 2,
        boxShadow: 3,
        color: theme.palette.text.primary,
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
        minHeight: 'auto',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography
          variant="h4"
          sx={{ color: theme.palette.text.primary, fontSize: { xs: '1.5rem', sm: '2rem' } }}
        >
          {isSignup ? 'Sign Up' : 'Login'}
        </Typography>
        <IconButton
          onClick={onClose}
          aria-label="Close login form"
          color="inherit"
          sx={{ p: { xs: 1, sm: 1.5 } }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}
      >
        {isSignup && (
          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            autoComplete="email"
            color="primary"
            variant="outlined"
            sx={textFieldStyles}
          />
        )}

        <TextField
          label={isSignup ? 'Username' : 'Username or Email'}
          type="text"
          name="identifier"
          value={formData.identifier}
          onChange={handleChange}
          required
          fullWidth
          autoComplete="username"
          color="primary"
          variant="outlined"
          sx={textFieldStyles}
        />

        <Box sx={{ position: 'relative' }}>
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
            autoComplete="current-password"
            color="primary"
            variant="outlined"
            sx={textFieldStyles}
          />
          <Tooltip title={showPassword ? 'Hide password' : 'Show password'}>
            <IconButton
              aria-label="Toggle password visibility"
              onClick={() => setShowPassword((prev) => !prev)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.text.primary,
                '&:hover': {
                  color: theme.palette.primary.main,
                },
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
            minHeight: { xs: 48, sm: 42 },
            fontSize: { xs: '16px', sm: '14px' },
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
            '&:disabled': {
              backgroundColor: theme.palette.action.disabled,
              color: theme.palette.text.disabled,
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : isSignup ? (
            'Sign Up'
          ) : (
            'Login'
          )}
        </Button>
      </form>

      <Typography align="center" sx={{ mt: 2, color: theme.palette.text.primary }}>
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
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
            },
          }}
        >
          {isSignup ? 'Login' : 'Sign Up'}
        </Button>
      </Typography>
    </Box>
  );
};

export default LoginForm;
