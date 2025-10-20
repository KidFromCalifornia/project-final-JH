import { useState } from 'react';
import { useCafeStore } from '../../stores/useCafeStore';
import { apiCall } from '../../services/api';
import { useAlert } from '../../context/AlertContext';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  Tooltip,
  useTheme,
  Alert,
  MenuItem,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { alpha } from '@mui/material/styles';

const CATEGORY_OPTIONS = ['specialty', 'roaster', 'thirdwave'];

const NewCafeForm = ({ onClose, onSuccess }) => {
  const theme = useTheme();
  const { showSnackbar } = useAlert();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    neighborhood: '',
    category: '',
    website: '',
    phone: '',
    hours: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Cafe name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.category) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await apiCall('/cafes', 'POST', formData);
      showSnackbar('Cafe added successfully!', 'success');
      onSuccess?.(response);
      onClose();
    } catch (err) {
      console.log('Add cafe error:', err);

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
        // Server errors (validation errors, duplicate entries, etc.)
        const errorMessage = err.message || 'Failed to add cafe. Please try again.';
        showSnackbar(errorMessage, 'error');
      }
    }
  };

  return (
    <Paper
      anchor="top"
      elevation={6}
      sx={{
        width: '100%',
        height: '100%',
        maxWidth: { xs: '100%', md: '800px' },
        p: { xs: 1, sm: 2 },
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        align="center"
        gutterBottom
        color={theme.palette.light}
        sx={{
          mb: 3,
          fontSize: { xs: '1.5rem', sm: '2.125rem' },
        }}
      >
        Add New Cafe
      </Typography>

      <form onSubmit={handleSubmit} aria-label="Add New Cafe Form">
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* Basic Information Section */}
          <Grid item xs={12} md={6}>
            <Box
              color={theme.palette.primary.main}
              sx={{
                p: 2,
                boxShadow: theme.shadows[2],
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.secondary.main, 0.2),
              }}
            >
              <Typography color={theme.palette.light} variant="h6">
                Basic Information
              </Typography>

              <Tooltip title="Enter the name of the cafe." placement="top" arrow>
                <TextField
                  label="Cafe Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name}
                  aria-label="Cafe Name"
                />
              </Tooltip>

              <Tooltip title="Enter the full address of the cafe." placement="top" arrow>
                <TextField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={!!errors.address}
                  helperText={errors.address}
                  aria-label="Cafe Address"
                />
              </Tooltip>

              <Tooltip
                title="Enter the neighborhood where the cafe is located."
                placement="top"
                arrow
              >
                <TextField
                  label="Neighborhood"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  aria-label="Cafe Neighborhood"
                />
              </Tooltip>

              <Tooltip
                title="Select the category that best describes this cafe."
                placement="top"
                arrow
              >
                <TextField
                  select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={!!errors.category}
                  helperText={errors.category}
                  aria-label="Cafe Category"
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Tooltip>
            </Box>
          </Grid>

          {/* Contact Information Section */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2,
                boxShadow: theme.shadows[2],
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.secondary.main, 0.2),
              }}
            >
              <Typography variant="h6">Contact Information</Typography>

              <Tooltip title="Enter the cafe's website URL." placement="top" arrow>
                <TextField
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  aria-label="Cafe Website"
                  placeholder="https://example.com"
                />
              </Tooltip>

              <Tooltip title="Enter the cafe's phone number." placement="top" arrow>
                <TextField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  aria-label="Cafe Phone"
                  placeholder="+46 123 456 789"
                />
              </Tooltip>

              <Tooltip title="Enter the cafe's operating hours." placement="top" arrow>
                <TextField
                  label="Hours"
                  name="hours"
                  value={formData.hours}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  aria-label="Cafe Hours"
                  placeholder="Mon-Fri 8AM-6PM, Sat-Sun 9AM-5PM"
                />
              </Tooltip>
            </Box>
          </Grid>

          {/* Description Section */}
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2,
                boxShadow: theme.shadows[2],
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.secondary.main, 0.2),
              }}
            >
              <Typography variant="h6">Description</Typography>

              <Tooltip title="Provide a description of the cafe." placement="top" arrow>
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  aria-label="Cafe Description"
                  placeholder="Tell us about this cafe's atmosphere, specialties, or unique features..."
                />
              </Tooltip>
            </Box>
          </Grid>

          {/* Actions Section */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
              }}
            >
              <Button
                onClick={onClose}
                variant="outlined"
                size="large"
                sx={{
                  minWidth: '8rem',
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  boxShadow: theme.shadows[2],
                  backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                  color: theme.palette.light.main,
                }}
                aria-label="Cancel"
              >
                Cancel
              </Button>
              <Tooltip
                title={
                  !formData.name.trim() || !formData.address.trim() || !formData.category
                    ? 'Please fill in all required fields'
                    : 'Add this cafe to the database.'
                }
                placement="top"
                arrow
              >
                <span>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={
                      !formData.name.trim() || !formData.address.trim() || !formData.category
                    }
                    sx={{
                      minWidth: '10rem',
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      backgroundColor: theme.palette.secondary.dark,
                    }}
                    aria-label="Add Cafe"
                  >
                    Add Cafe
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default NewCafeForm;
