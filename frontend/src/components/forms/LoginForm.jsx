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
  useTheme,
  Paper,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useAlert } from '../../context/AlertContext';
import { handleApiError } from '../../utils/errorHandler';
import { screenReaderOnly } from '../../utils/a11yStyles';

const LoginForm = ({ setIsAdmin, onClose }) => {
  const theme = useTheme();
  const { showSnackbar } = useAlert();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleLogin = async () => {
    // Authenticate user...
    localStorage.setItem('admin', 'true');
    setIsAdmin(true); // Update parent state
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { identifier, password } = formData;
      const trimmedIdentifier = identifier.trim();
      const trimmedPassword = password.trim();

      const payload = {
        username: trimmedIdentifier,
        email: trimmedIdentifier,
        password: trimmedPassword,
      };

      const data = await authAPI.login(payload);

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
          const isAdminUser = role === 'admin' ? 'true' : 'false';
          localStorage.setItem('admin', isAdminUser);
          setIsAdmin(isAdminUser === 'true'); // Only set to true if role is admin
        } catch {
          localStorage.setItem('userRole', 'user');
          localStorage.setItem('admin', 'false');
          setIsAdmin(false);
        }

        // Update login states
        useCafeStore.setState({ isLoggedIn: true }); // Update store state
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
      handleApiError(
        err,
        showSnackbar,
        'Invalid credentials. Please check your username/email and password.'
      );
    }
  };

  return (
    <Box
      sx={{
        width: { xs: '100%', sm: 400 },
        maxWidth: { xs: 'none', sm: 400 },
        p: { xs: 2, sm: 3 },
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        color: theme.palette.light.main,
        borderRadius: 2,
      }}
      role="dialog"
      aria-labelledby="login-form-title"
      aria-describedby="login-form-description"
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography id="login-form-title" color={theme.palette.light.main} variant="h4">
          Login
        </Typography>
      </Box>

      {/* Screen reader only description */}
      <Typography id="login-form-description" variant="body2" sx={{ ...screenReaderOnly }}>
        Enter your credentials to access your account.
      </Typography>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.secondary.main, 0.5)
              : alpha(theme.palette.secondary.main, 0.2),
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
        }}
        aria-labelledby="login-form-title"
      >
        <TextField
          label="Email"
          name="identifier"
          value={formData.identifier}
          onChange={handleChange}
          required
          fullWidth
          autoComplete="username"
          variant="filled"
          aria-label="Email or username for login"
          aria-describedby="identifier-helper"
          helperText="Enter your registered email or username"
          FormHelperTextProps={{
            id: 'identifier-helper',
            sx: { ...screenReaderOnly },
          }}
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
            variant="filled"
            aria-label="Password for authentication"
            aria-describedby="password-helper"
            helperText="Enter your account password"
            FormHelperTextProps={{
              id: 'password-helper',
              sx: { ...screenReaderOnly },
            }}
          />

          <IconButton
            aria-label="Toggle password visibility"
            onClick={() => setShowPassword((prev) => !prev)}
            color={theme.palette.mode === 'dark' ? 'secondary' : 'primary'}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
            size="small"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Box>

        <Button
          type="submit"
          variant="contained"
          aria-label={loading ? 'Processing authentication' : 'Sign in'}
          sx={{
            py: { xs: 1.5, sm: 1.5 },
            px: { xs: 2, sm: 3 },
            mt: 1,
            fontWeight: 'bold',
            backgroundColor: alpha(theme.palette.secondary.main, 0.5),
            border: `1px solid ${theme.palette.primary.main}`,
            minHeight: { xs: 48, sm: 42 },
            '&:hover': {
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.light.main,
              border: `1px solid ${theme.palette.light.main}`,
            },
          }}
        >
          {loading ? <CircularProgress size={24} aria-label="Loading" /> : 'Login'}
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginForm;
