import { useState } from 'react';
import { cafeAPI } from '../../services/api';
import { useAlert } from '../../context/AlertContext';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Tooltip,
  IconButton,
  Paper,
  useTheme,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const CATEGORY_OPTIONS = ['specialty', 'roaster', 'thirdwave'];
const FEATURE_OPTIONS = [
  'outdoor_seating',
  'wheelchair_accessible',
  'lunch',
  'pour_over',
  'takeaway',
  'vegan_options',
  'breakfast',
  'iced_drinks',
  'pastries',
  'multi_roaster',
  'decaf',
  'no_coffee_bar',
  'limited_sitting',
  'roaster_only',
];

const NewCafeForm = ({ onClose }) => {
  const theme = useTheme();
  const { showSnackbar } = useAlert();

  // Reusable TextField styling to match TastingForm
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor:
        theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.common.white,
      minHeight: { xs: 56, sm: 48 },
      '& fieldset': { borderColor: theme.palette.text.primary },
      '&:hover fieldset': { borderColor: theme.palette.primary.main },
      '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
      '& input': {
        color: theme.palette.text.secondary,
        fontSize: { xs: '18px', sm: '16px' },
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'normal',
        '&::placeholder': {
          color: theme.palette.text.secondary,
          opacity: 0.7,
        },
      },
      '& textarea': {
        color: theme.palette.text.secondary,
        fontSize: { xs: '18px', sm: '16px' },
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        '&::placeholder': {
          color: theme.palette.text.secondary,
          opacity: 0.7,
        },
      },
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.text.secondary,
      '&.Mui-focused': { color: theme.palette.primary.main },
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
    },
    '& .MuiInputBase-input::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.7,
    },
    '& .MuiSelect-select': {
      color: theme.palette.text.secondary,
      fontSize: { xs: '18px', sm: '16px' },
    },
  };

  // Select menu styling for better contrast
  const selectMenuStyles = {
    PaperProps: {
      sx: {
        backgroundColor: theme.palette.background.default,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[8],
        '& .MuiMenuItem-root': {
          color: theme.palette.text.secondary,
          fontSize: { xs: '18px', sm: '16px' },
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
          '&.Mui-selected': {
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          },
        },
      },
    },
  };

  // Section styling for better visual hierarchy - matching TastingForm
  const sectionStyles = {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.background.paper
        : theme.palette.background.default,
    borderRadius: 2,
    p: 3,
    mb: 2,
    boxShadow: theme.shadows[2],
    border: `1px solid ${theme.palette.divider}`,
    height: 'fit-content',
  };

  const sectionHeaderStyles = {
    color: theme.palette.primary.main,
    fontWeight: 600,
    mb: 2,
    pb: 1,
    borderBottom: `2px solid ${theme.palette.background.default}`,
  };

  const [form, setForm] = useState({
    name: '',
    website: '',
    description: '',
    category: '',
    hasMultipleLocations: false,
    features: [],
    images: [''],
    locations: [
      {
        address: '',
        neighborhood: '',
        locationNote: '',
        isMainLocation: true,
      },
    ],
  });
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('');

  const getFeatureTooltip = (feature) => {
    const tooltips = {
      outdoor_seating: 'Has outdoor seating available',
      wheelchair_accessible: 'Accessible for wheelchair users',
      lunch: 'Serves lunch options',
      pour_over: 'Offers pour-over brewing methods',
      takeaway: 'Offers takeaway/to-go options',
      vegan_options: 'Has vegan food and drink options',
      breakfast: 'Serves breakfast items',
      iced_drinks: 'Offers cold/iced beverages',
      pastries: 'Serves pastries and other baked goods',
      multi_roaster: 'Features coffee from multiple roasters',
      decaf: 'Offers decaffeinated coffee options',
      no_coffee_bar: 'No on-site coffee bar (retail, office or roastery)',
      limited_sitting: 'Limited seating available',
      roaster_only: 'Roastery without public seating',
    };
    return tooltips[feature] || `Feature: ${feature.replace(/_/g, ' ')}`;
  };

  // Handle basic field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle features (multi-select)
  const handleFeatureChange = (feature) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  // Handle location field changes
  const handleLocationChange = (e, idx) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const locations = [...prev.locations];
      locations[idx][name] = type === 'checkbox' ? checked : value;
      return { ...prev, locations };
    });
  };

  // Geocode address using OpenStreetMap Nominatim
  const geocodeAddress = async (address) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data && data[0]) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
      }
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  };

  // Handle image URL changes
  const handleImageChange = (e, idx) => {
    const { value } = e.target;
    setForm((prev) => {
      const images = [...prev.images];
      images[idx] = value;
      return { ...prev, images };
    });
  };

  // Add another location
  const addLocation = () => {
    setForm((prev) => ({
      ...prev,
      locations: [
        ...prev.locations,
        {
          address: '',
          neighborhood: '',
          locationNote: '',
          isMainLocation: false,
        },
      ],
    }));
  };

  // Remove a location by index
  const removeLocation = (idx) => {
    setForm((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== idx),
    }));
  };

  // Prepare payload for backend and geocode addresses
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      // Geocode each location
      const locationsWithCoords = await Promise.all(
        form.locations.map(async (loc) => {
          const geo = await geocodeAddress(loc.address);
          return {
            ...loc,
            coordinates: geo
              ? {
                  type: 'Point',
                  coordinates: [geo.lon, geo.lat],
                }
              : undefined,
          };
        })
      );

      const payload = {
        ...form,
        locations: locationsWithCoords,
      };
      console.log(payload);

      const result = await cafeAPI.submitCafe(payload);
      if (result.success) {
        setStatusType('success');
        setStatus('Cafe added!');
        setForm({
          name: '',
          website: '',
          description: '',
          category: '',
          hasMultipleLocations: false,
          features: [],
          images: [''],
          locations: [
            {
              address: '',
              neighborhood: '',
              locationNote: '',
              isMainLocation: true,
            },
          ],
        });
      } else {
        setStatusType('error');
        setStatus(result.error || "We couldn't add this cafe. Please check and try again.");
      }
    } catch (err) {
      console.log('New cafe submission error:', err); // Debug log

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
        // Server errors (validation errors, etc.)
        const errorMessage = err.message || "We couldn't submit your suggestion. Please try again.";
        setStatus(errorMessage);
        setStatusType('error');
      }
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', md: '1200px' },
        mx: 'auto',
        p: { xs: 2, sm: 3 },
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderRadius: 2,
        boxShadow: 5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            color: theme.palette.text.default,
            fontSize: { xs: '1.5rem', sm: '2.125rem' },
          }}
        >
          Suggest a Cafe
        </Typography>
        <IconButton
          onClick={onClose}
          aria-label="Close add cafe form"
          sx={{
            color: theme.palette.text.default,
            p: { xs: 1, sm: 1.5 },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        {status && (
          <Alert severity={statusType === 'success' ? 'success' : 'error'} sx={{ mb: 2 }}>
            {status}
          </Alert>
        )}

        {/* Basic Information Section */}
        <Paper elevation={3} sx={sectionStyles}>
          <Typography variant="h6" sx={sectionHeaderStyles}>
            Basic Information
          </Typography>

          <TextField
            label="Cafe Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            variant="outlined"
            sx={textFieldStyles}
          />

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl
              sx={{
                flex: { xs: '1 1 100%', sm: '1 1 45%' },
                minWidth: { xs: '100%', sm: '200px' },
                mt: 2,
                mb: 1,
              }}
            >
              <InputLabel id="category-label">Cafe Type</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={form.category}
                label="Cafe Type"
                onChange={handleChange}
                required
                sx={textFieldStyles}
                MenuProps={{
                  PaperProps: {
                    sx: selectMenuStyles['& .MuiPaper-root'],
                  },
                }}
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    sx={selectMenuStyles['& .MuiMenuItem-root']}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Website (optional)"
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://..."
              sx={{
                flex: { xs: '1 1 100%', sm: '1 1 45%' },
                minWidth: { xs: '100%', sm: '200px' },
                ...textFieldStyles,
              }}
              margin="normal"
              variant="outlined"
            />
          </Box>
        </Paper>

        {/* Location Information Section */}
        <Paper elevation={3} sx={sectionStyles}>
          <Typography variant="h6" sx={sectionHeaderStyles}>
            Location Information
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Primary Address"
              name="address"
              value={form.locations[0]?.address || ''}
              onChange={(e) => handleLocationChange(e, 0)}
              required
              placeholder="Street address, city"
              sx={{
                flex: { xs: '1 1 100%', sm: '1 1 45%' },
                minWidth: { xs: '100%', sm: '200px' },
                ...textFieldStyles,
              }}
              margin="normal"
              variant="outlined"
            />

            <TextField
              label="Neighborhood"
              name="neighborhood"
              value={form.locations[0]?.neighborhood || ''}
              onChange={(e) => handleLocationChange(e, 0)}
              sx={{
                flex: { xs: '1 1 100%', sm: '1 1 45%' },
                minWidth: { xs: '100%', sm: '200px' },
                ...textFieldStyles,
              }}
              margin="normal"
              variant="outlined"
            />
          </Box>

          {/* Additional Locations */}
          {form.locations.slice(1).map((loc, idx) => {
            const realIdx = idx + 1;
            return (
              <Paper
                key={realIdx}
                variant="outlined"
                sx={{
                  p: 2,
                  mt: 2,
                  position: 'relative',
                  backgroundColor: theme.palette.background.paper,
                  borderColor: theme.palette.divider,
                  borderRadius: 1,
                }}
              >
                <IconButton
                  aria-label="Remove this location"
                  onClick={() => removeLocation(realIdx)}
                  size="small"
                  color="inherit"
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Address"
                    name="address"
                    value={loc.address}
                    onChange={(e) => handleLocationChange(e, realIdx)}
                    required
                    sx={{
                      flex: { xs: '1 1 100%', sm: '1 1 45%' },
                      minWidth: { xs: '100%', sm: '200px' },
                      ...textFieldStyles,
                    }}
                    margin="normal"
                    variant="outlined"
                  />
                  <TextField
                    label="Neighborhood"
                    name="neighborhood"
                    value={loc.neighborhood}
                    onChange={(e) => handleLocationChange(e, realIdx)}
                    sx={{
                      flex: { xs: '1 1 45%', sm: '1 1 45%' },
                      minWidth: { xs: '100%', sm: '200px' },
                      ...textFieldStyles,
                    }}
                    margin="normal"
                    variant="outlined"
                  />
                </Box>

                <TextField
                  label="Location Note"
                  name="locationNote"
                  value={loc.locationNote}
                  onChange={(e) => handleLocationChange(e, realIdx)}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  sx={textFieldStyles}
                />
              </Paper>
            );
          })}

          <Tooltip title="Add another location for this cafe" arrow>
            <Button
              type="button"
              onClick={addLocation}
              startIcon={<AddCircleOutlineIcon />}
              variant="text"
              sx={{ mt: 2, alignSelf: 'flex-start' }}
            >
              Add Another Location
            </Button>
          </Tooltip>
        </Paper>

        {/* Features Section */}
        <Paper elevation={3} sx={sectionStyles}>
          <Typography variant="h6" sx={sectionHeaderStyles}>
            Cafe Features
          </Typography>

          <FormGroup
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: 1,
              mt: 1,
            }}
          >
            {FEATURE_OPTIONS.map((feature) => (
              <Tooltip key={feature} title={getFeatureTooltip(feature)} arrow>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      name={feature}
                      checked={form.features.includes(feature)}
                      onChange={() => handleFeatureChange(feature)}
                      sx={{
                        color: theme.palette.primary.main,
                        '&.Mui-checked': { color: theme.palette.secondary.main },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      {feature.replace(/_/g, ' ')}
                    </Typography>
                  }
                  sx={{
                    backgroundColor: form.features.includes(feature)
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(25, 118, 210, 0.2)'
                        : 'rgba(25, 118, 210, 0.1)'
                      : theme.palette.mode === 'dark'
                        ? theme.palette.background.paper
                        : 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                    m: 0,
                    border: form.features.includes(feature)
                      ? `1px solid ${theme.palette.primary.main}`
                      : `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor:
                        theme.palette.mode === 'dark'
                          ? theme.palette.action.hover
                          : 'rgba(25, 118, 210, 0.05)',
                    },
                  }}
                />
              </Tooltip>
            ))}
          </FormGroup>
        </Paper>

        {/* Submit Section */}
        <Paper elevation={3} sx={sectionStyles}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              pt: 2,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                minWidth: 160,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Add Cafe
            </Button>
          </Box>
        </Paper>
      </Box>
    </Paper>
  );
};

export default NewCafeForm;
