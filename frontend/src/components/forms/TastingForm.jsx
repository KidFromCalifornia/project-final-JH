import { useState, useEffect } from 'react';
import { useCafeStore } from '../../stores/useCafeStore';
import { apiCall } from '../../services/api';
import { useAlert } from '../../context/AlertContext';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  MenuItem,
  FormControl,
  FormLabel,
  FormHelperText,
  Rating,
  Box,
  Typography,
  Paper,
  Divider,
  Tooltip,
  useTheme,
  Alert,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
const TastingForm = ({ onSubmit, initialValues = {}, onClose }) => {
  const theme = useTheme();
  const { showSnackbar } = useAlert();

  // State initialization
  const [form, setForm] = useState({
    cafeId:
      typeof initialValues.cafeId === 'object' && initialValues.cafeId?._id
        ? initialValues.cafeId._id
        : initialValues.cafeId || '',
    coffeeName: initialValues.coffeeName || '',
    coffeeRoaster: initialValues.coffeeRoaster || '',
    coffeeOrigin: initialValues.coffeeOrigin || '',
    coffeeOriginRegion: initialValues.coffeeOriginRegion || '',
    brewMethod: initialValues.brewMethod || '',
    tastingNotes: initialValues.tastingNotes || [],
    acidity: initialValues.acidity || '',
    mouthFeel: initialValues.mouthFeel || '',
    roastLevel: initialValues.roastLevel || '',
    rating: initialValues.rating || 3,
    notes: initialValues.notes || '',
    isPublic: initialValues.isPublic !== undefined ? initialValues.isPublic : true,
  });

  // Store hooks
  const cafes = useCafeStore((state) => state.cafes);
  const setCafes = useCafeStore((state) => state.setCafes);
  const options = useCafeStore((state) => state.options);
  const setOptions = useCafeStore((state) => state.setOptions);
  const fetchError = useCafeStore((state) => state.fetchError);
  const setFetchError = useCafeStore((state) => state.setFetchError);

  // Fetch cafes and options
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiCall('/metadata/form-options');
        setCafes(data.cafes || []);
        setOptions(data.enums || {});
      } catch (error) {
        console.log('Form options fetch error:', error);

        // Check for actual network connectivity issues
        if (
          (error.name === 'TypeError' && error.message.includes('fetch')) ||
          error.message.includes('NetworkError') ||
          error.message.includes('Failed to fetch') ||
          !navigator.onLine
        ) {
          // True network error - no internet or server unreachable
          showSnackbar(
            "We couldn't reach the server. Please check your internet connection and try again.",
            'error'
          );
        } else if (error.message.includes('timeout') || error.message.includes('Request timeout')) {
          // Request timeout
          showSnackbar('Request timed out. Please try again.', 'error');
        } else {
          // Server errors (API errors, etc.)
          setFetchError("We couldn't load form options. Please try again.");
        }
      }
    };
    if (!cafes || cafes.length === 0) {
      fetchData();
    }
  }, [setCafes, setOptions, setFetchError, cafes]);

  // Input handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (fetchError) setFetchError('');
  };

  const handleTastingNotesChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      tastingNotes: checked
        ? [...prev.tastingNotes, value]
        : prev.tastingNotes.filter((note) => note !== value),
    }));
    if (fetchError) setFetchError('');
  };

  const handleCafeChange = (e) => {
    setForm((prev) => ({ ...prev, cafeId: e.target.value }));
    if (fetchError) setFetchError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.tastingNotes.length === 0) {
      setFetchError('Please select at least one tasting note.');
      return;
    }
    onSubmit(form);
  };

  return (
    <Paper
      elevation={6}
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', md: '1200px' },
        mx: 'auto',
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        align="center"
        gutterBottom
        color="primary"
        sx={{
          mb: 3,
          fontSize: { xs: '1.5rem', sm: '2.125rem' },
          color: theme.palette.mode === 'dark' ? 'light.main' : 'primary.contrastText',
        }}
      >
        {initialValues.cafeId ? 'Edit Coffee Tasting' : 'Add New Coffee Tasting'}
      </Typography>

      <form onSubmit={handleSubmit} aria-label="Coffee Tasting Form">
        {fetchError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {fetchError}
          </Alert>
        )}

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* Basic Coffee Info Section */}
          <Grid item xs={12} lg={6}>
            <Box
              sx={{
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                p: 2,
              }}
            >
              <Typography color="light.main" variant="h3">
                Coffee Details
              </Typography>

              <Tooltip title="Select the cafe where you tasted this coffee." placement="top" arrow>
                <TextField
                  select
                  label="Where did you taste this coffee?"
                  name="cafeId"
                  value={form.cafeId}
                  onChange={handleCafeChange}
                  required
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  aria-label="Cafe Location"
                >
                  <MenuItem value="">Select a cafe</MenuItem>
                  {cafes.map((cafe, index) => (
                    <MenuItem key={cafe._id || `cafe-${index}`} value={cafe._id}>
                      {cafe.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Tooltip>

              <Tooltip title="Enter the name of the coffee." placement="top" arrow>
                <TextField
                  label="Coffee Name"
                  name="coffeeName"
                  value={form.coffeeName}
                  onChange={handleChange}
                  required
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  aria-label="Coffee Name"
                />
              </Tooltip>

              <Tooltip title="Enter the name of the coffee roaster." placement="top" arrow>
                <TextField
                  label="Coffee Roaster"
                  name="coffeeRoaster"
                  value={form.coffeeRoaster}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  aria-label="Coffee Roaster"
                />
              </Tooltip>

              {/* Origin fields side by side */}
              <Box
                sx={{
                  borderRadius: 1,
                  backgroundColor: 'none',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1,
                  mt: 2,
                }}
              >
                <Tooltip title="Enter the origin of the coffee." placement="top" arrow>
                  <TextField
                    label="Coffee Origin"
                    name="coffeeOrigin"
                    value={form.coffeeOrigin}
                    onChange={handleChange}
                    sx={{
                      flex: { xs: 'none', sm: 1 },
                      minWidth: { xs: '100%', sm: '0' },
                    }}
                  />
                </Tooltip>
                <Tooltip title="Enter the region of the coffee." placement="top" arrow>
                  <TextField
                    label="Region"
                    name="coffeeOriginRegion"
                    value={form.coffeeOriginRegion}
                    onChange={handleChange}
                    sx={{
                      flex: { xs: 'none', sm: 1 },
                      minWidth: { xs: '100%', sm: '0' },
                    }}
                  />
                </Tooltip>
              </Box>
            </Box>
          </Grid>

          {/* Taste Profile Section */}
          <Grid item xs={12} lg={6}>
            <Box
              sx={{
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                p: 2,
              }}
            >
              <Typography p={2} color="light.main" variant="h3">
                Taste Profile
              </Typography>

              {/* Brew method and roast level side by side */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  gap: 1,
                  mb: 2,
                  borderRadius: 1,
                  backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                }}
              >
                <Tooltip title="Select the brew method for the coffee." placement="top" arrow>
                  <TextField
                    select
                    label="Brew Method"
                    name="brewMethod"
                    value={form.brewMethod}
                    onChange={handleChange}
                    required
                    sx={{
                      flex: { xs: 'none', sm: 1 },
                      minWidth: { xs: '100%', sm: '0' },
                    }}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {(options.brewMethod || []).map((method) => (
                      <MenuItem key={method} value={method}>
                        {method}
                      </MenuItem>
                    ))}
                  </TextField>
                </Tooltip>

                <Tooltip title="Select the roast level of the coffee." placement="top" arrow>
                  <TextField
                    select
                    label="Roast Level"
                    name="roastLevel"
                    value={form.roastLevel}
                    onChange={handleChange}
                    sx={{
                      flex: { xs: 'none', sm: 1 },
                      minWidth: { xs: '100%', sm: '0' },
                    }}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {(options.roastLevel || []).map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </TextField>
                </Tooltip>
              </Box>

              {/* Acidity and Mouth Feel side by side */}
              <Box
                background="background.default"
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1,
                  mb: 2,
                }}
              >
                <Tooltip title="Select the acidity level of the coffee." placement="top" arrow>
                  <TextField
                    select
                    label="Acidity"
                    name="acidity"
                    value={form.acidity}
                    onChange={handleChange}
                    sx={{
                      flex: { xs: 'none', sm: 1 },
                      minWidth: { xs: '100%', sm: '0' },
                    }}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {(options.acidity || []).map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </TextField>
                </Tooltip>

                <Tooltip title="How does the coffee feel in your mouth?" placement="top" arrow>
                  <TextField
                    select
                    label="Mouth Feel"
                    name="mouthFeel"
                    value={form.mouthFeel}
                    onChange={handleChange}
                    sx={{
                      flex: { xs: 'none', sm: 1 },
                      minWidth: { xs: '100%', sm: '0' },
                    }}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {(options.mouthFeel || []).map((feel) => (
                      <MenuItem key={feel} value={feel}>
                        {feel}
                      </MenuItem>
                    ))}
                  </TextField>
                </Tooltip>
              </Box>

              <FormControl fullWidth margin="normal" sx={{ color: theme.palette.light, gap: 0.5 }}>
                <FormLabel>
                  <Typography variant="h6">Overall Rating</Typography>
                </FormLabel>
                <Tooltip
                  title="Rate your overall coffee experience from 1-5 hearts"
                  arrow
                  placement="top"
                >
                  <Rating
                    color={theme.palette.accent.main}
                    name="rating"
                    value={form.rating}
                    precision={0.5}
                    max={5}
                    icon={<FavoriteIcon fontSize="inherit" />}
                    emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                    onChange={(_, value) => setForm((prev) => ({ ...prev, rating: value || 1 }))}
                  />
                </Tooltip>
                <FormHelperText color={theme.palette.light.main}>
                  <Typography tm="small" variant="body2">
                    {form.rating ? `${form.rating} out of 5 hearts` : 'Select your rating'}
                  </Typography>
                </FormHelperText>
              </FormControl>
            </Box>
          </Grid>

          {/* Tasting Notes - Full Width */}
          <Grid item xs={12}>
            <Box
              backgroundColor={
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.secondary.main, 0.2)
                  : theme.palette.background.default
              }
              sx={{
                p: 2,
                borderRadius: 1,
              }}
            >
              <Typography
                color={theme.palette.mode === 'dark' ? 'light.main' : 'primary.main'}
                variant="h3"
                sx={{ fontWeight: 700 }}
              >
                Tasting Notes
              </Typography>

              <FormControl fullWidth required>
                <FormLabel sx={{ mb: 1 }}>
                  <Typography
                    color={theme.palette.mode === 'dark' ? 'light.main' : 'primary.main'}
                    variant="body"
                  >
                    Select at least one tasting note
                  </Typography>
                </FormLabel>
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
                  {(options.tastingNotes || []).map((note) => (
                    <FormControlLabel
                      key={note}
                      control={
                        <Checkbox
                          name="tastingNotes"
                          value={note}
                          checked={form.tastingNotes.includes(note)}
                          onChange={handleTastingNotesChange}
                          size="small"
                          sx={{
                            color: theme.palette.mode === 'dark' ? 'light.main' : 'primary.main',
                          }}
                        />
                      }
                      label={
                        <Typography
                          variant="body"
                          sx={{
                            fontSize: '1rem',
                            color: theme.palette.mode === 'dark' ? 'light.main' : 'primary.main',
                            fontWeight: 650,
                            textTransform: 'capitalize',
                          }}
                        >
                          {note}
                        </Typography>
                      }
                      sx={{
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                        m: 0,
                      }}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Box>
          </Grid>

          {/* Notes and Actions */}
          <Grid item xs={12}>
            <Box
              backgroundColor={
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.secondary.main, 0.2)
                  : 'light.main'
              }
              sx={{
                p: 2,
                borderRadius: 1,
              }}
            >
              <Typography
                color={theme.palette.mode === 'dark' ? 'light.main' : 'primary.main'}
                variant="h3"
              >
                Additional Details
              </Typography>

              <TextField
                name="notes"
                value={form.notes}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                margin="normal"
                variant="outlined"
                aria-label="Additional Notes"
                inputProps={{ maxLength: 500 }}
                placeholder="Share your thoughts about this coffee experience..."
              />

              {/* Actions Section */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 3,
                  pt: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      title="Make this tasting public"
                      name="isPublic"
                      checked={form.isPublic}
                      onChange={handleChange}
                      size="small"
                      sx={{
                        '&.Mui-checked': {
                          color:
                            theme.palette.mode === 'dark'
                              ? theme.palette.light.main
                              : theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        color:
                          theme.palette.mode === 'dark'
                            ? theme.palette.light.main
                            : theme.palette.primary.main,
                      }}
                    >
                      want to make this tasting public?
                    </Typography>
                  }
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {onClose && (
                    <Button
                      onClick={onClose}
                      variant="outlined"
                      size="large"
                      sx={{
                        minWidth: '8rem',
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        backgroundColor:
                          theme.palette.mode === 'dark' ? 'secondary.main' : 'primary.main',
                        color:
                          theme.palette.mode === 'dark' ? 'light.main' : 'primary.contrastText',
                        outlineColor:
                          theme.palette.mode === 'dark' ? 'light.main' : 'secondary.main',
                        '&:hover': {
                          backgroundColor:
                            theme.palette.mode === 'dark' ? 'muted.main' : 'secondary.main',
                          color:
                            theme.palette.mode === 'dark'
                              ? 'secondary.main'
                              : 'primary.contrastText',
                          outlineColor:
                            theme.palette.mode === 'dark' ? 'light.main' : 'secondary.main',
                        },
                      }}
                      aria-label="Cancel"
                    >
                      Cancel
                    </Button>
                  )}
                  <Tooltip
                    title={
                      !form.cafeId ||
                      !form.coffeeName ||
                      !form.brewMethod ||
                      form.tastingNotes.length === 0
                        ? 'Please fill in all required fields'
                        : 'Submit your experience.'
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
                          !form.cafeId ||
                          !form.coffeeName ||
                          !form.brewMethod ||
                          form.tastingNotes.length === 0
                        }
                        sx={{
                          minWidth: '10rem',
                          py: 1.5,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                        }}
                        aria-label={initialValues.cafeId ? 'Update Tasting' : 'Add Tasting'}
                      >
                        {initialValues.cafeId ? 'Update Tasting' : 'Add Tasting'}
                      </Button>
                    </span>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default TastingForm;
