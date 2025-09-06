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
import Grid from '@mui/material/Grid';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const TastingForm = ({ onSubmit, initialValues = {} }) => {
  const theme = useTheme();
  const { showSnackbar } = useAlert();

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? theme.palette.background.paper // ✅ CHANGE: Use theme background instead of white
          : theme.palette.common.white,
      minHeight: { xs: 56, sm: 48 },
      '& fieldset': { borderColor: theme.palette.text.primary },
      '&:hover fieldset': { borderColor: theme.palette.primary.main },
      '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
      '& input': {
        color: theme.palette.text.primary,
        fontSize: { xs: '18px', sm: '16px' },
        wordWrap: 'break-word', // ✅ Allow text wrapping
        overflowWrap: 'break-word', // ✅ Modern CSS for text wrapping
        whiteSpace: 'normal', // ✅ Allow normal white space handling
        // ✅ ADD placeholder styling for dark mode
        '&::placeholder': {
          color: theme.palette.text.secondary,
          opacity: 0.7,
        },
      },
      '& textarea': {
        color: theme.palette.text.primary,
        fontSize: { xs: '18px', sm: '16px' },
        wordWrap: 'break-word', // ✅ Allow text wrapping in textareas
        overflowWrap: 'break-word', // ✅ Modern CSS for text wrapping
        whiteSpace: 'pre-wrap', // ✅ Preserve formatting but allow wrapping
        // ✅ ADD placeholder styling for textareas
        '&::placeholder': {
          color: theme.palette.text.secondary,
          opacity: 0.7,
        },
      },
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.text.primary,
      '&.Mui-focused': { color: theme.palette.primary.main },
      wordWrap: 'break-word', // ✅ Allow label text wrapping
      overflowWrap: 'break-word',
    },
    // ✅ ADD specific placeholder styling for MUI inputs
    '& .MuiInputBase-input::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.7,
    },
    '& .MuiSelect-select': {
      color: theme.palette.text.primary,
      fontSize: { xs: '18px', sm: '16px' },
    },
  };

  // Select menu styling for better contrast
  const selectMenuProps = {
    SelectProps: {
      MenuProps: {
        PaperProps: {
          sx: {
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[8],
            '& .MuiMenuItem-root': {
              color: theme.palette.text.primary,
              fontSize: { xs: '18px', sm: '16px' },
              backgroundColor: theme.palette.background.paper,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
            },
          },
        },
      },
    },
  };
  // Section styling for better visual hierarchy
  const sectionStyles = {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.background.paper // ✅ CHANGE: Use paper background for dark mode
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
        if (error.code === 'NETWORK_ERROR' || error.message?.includes('fetch') || !error.response) {
          showSnackbar("We couldn't reach the server. Please try again later.", 'error');
        } else {
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
        maxWidth: { xs: '100%', md: '1200px' }, // ✅ Add max width for larger screens
        mx: 'auto', // ✅ Center the form
        p: { xs: 2, sm: 3 },
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderRadius: 2,
        boxShadow: 5,
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        align="center"
        gutterBottom
        sx={{
          mb: 3,
          fontSize: { xs: '1.5rem', sm: '2.125rem' }, // ✅ Responsive font size
        }}
      >
        {initialValues.cafeId ? 'Edit Coffee Tasting' : 'Add New Coffee Tasting'}
      </Typography>

      <form onSubmit={handleSubmit} aria-label="Coffee Tasting Form">
        {fetchError && <Alert severity="error" sx={{ mb: 2 }}>{fetchError}</Alert>}

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* Basic Coffee Info Section */}
          <Grid item xs={12} lg={6}>
            <Paper elevation={3} sx={sectionStyles}>
              <Typography variant="h6" sx={sectionHeaderStyles}>
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
                  sx={textFieldStyles}
                  {...selectMenuProps}
                >
                  <MenuItem value="">Select a cafe</MenuItem>
                  {cafes.map((cafe) => (
                    <MenuItem key={cafe._id} value={cafe._id}>
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
                  sx={textFieldStyles}
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
                  sx={textFieldStyles}
                />
              </Tooltip>

              {/* Origin fields side by side */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' }, // ✅ Stack on mobile
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
                      flex: { xs: 'none', sm: 1 }, // ✅ No flex on mobile, flex on larger screens
                      minWidth: { xs: '100%', sm: '0' }, // ✅ Full width on mobile
                      ...textFieldStyles,
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
                      flex: { xs: 'none', sm: 1 }, // ✅ No flex on mobile, flex on larger screens
                      minWidth: { xs: '100%', sm: '0' }, // ✅ Full width on mobile
                      ...textFieldStyles,
                    }}
                  />
                </Tooltip>
              </Box>
            </Paper>
          </Grid>

          {/* Taste Profile Section */}
          <Grid item xs={12} lg={6}>
            <Paper elevation={3} sx={sectionStyles}>
              <Typography variant="h6" sx={sectionHeaderStyles}>
                Taste Profile
              </Typography>

              {/* Brew method and roast level side by side */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' }, // ✅ Stack on mobile
                  gap: 1,
                  mb: 2,
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
                      flex: { xs: 'none', sm: 1 }, // ✅ No flex on mobile, flex on larger screens
                      minWidth: { xs: '100%', sm: '0' }, // ✅ Full width on mobile
                      ...textFieldStyles,
                    }}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          sx: selectMenuStyles['& .MuiPaper-root']
                        }
                      }
                    }}
                  >
                    <MenuItem 
                      value=""
                      sx={selectMenuStyles['& .MuiMenuItem-root']}
                    >
                      Select
                    </MenuItem>
                    {(options.brewMethod || []).map((method) => (
                      <MenuItem 
                        key={method} 
                        value={method}
                        sx={selectMenuStyles['& .MuiMenuItem-root']}
                      >
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
                      flex: { xs: 'none', sm: 1 }, // ✅ No flex on mobile, flex on larger screens
                      minWidth: { xs: '100%', sm: '0' }, // ✅ Full width on mobile
                      ...textFieldStyles,
                    }}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          sx: selectMenuStyles['& .MuiPaper-root']
                        }
                      }
                    }}
                  >
                    <MenuItem 
                      value=""
                      sx={selectMenuStyles['& .MuiMenuItem-root']}
                    >
                      Select
                    </MenuItem>
                    {(options.roastLevel || []).map((level) => (
                      <MenuItem 
                        key={level} 
                        value={level}
                        sx={selectMenuStyles['& .MuiMenuItem-root']}
                      >
                        {level}
                      </MenuItem>
                    ))}
                  </TextField>
                </Tooltip>
              </Box>

              {/* Acidity and Mouth Feel side by side */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' }, // ✅ Stack on mobile
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
                      flex: { xs: 'none', sm: 1 }, // ✅ No flex on mobile, flex on larger screens
                      minWidth: { xs: '100%', sm: '0' }, // ✅ Full width on mobile
                      ...textFieldStyles,
                    }}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          sx: selectMenuStyles['& .MuiPaper-root']
                        }
                      }
                    }}
                  >
                    <MenuItem 
                      value=""
                      sx={selectMenuStyles['& .MuiMenuItem-root']}
                    >
                      Select
                    </MenuItem>
                    {(options.acidity || []).map((level) => (
                      <MenuItem 
                        key={level} 
                        value={level}
                        sx={selectMenuStyles['& .MuiMenuItem-root']}
                      >
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
                      flex: { xs: 'none', sm: 1 }, // ✅ No flex on mobile, flex on larger screens
                      minWidth: { xs: '100%', sm: '0' }, // ✅ Full width on mobile
                      ...textFieldStyles,
                    }}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          sx: selectMenuStyles['& .MuiPaper-root']
                        }
                      }
                    }}
                  >
                    <MenuItem 
                      value=""
                      sx={selectMenuStyles['& .MuiMenuItem-root']}
                    >
                      Select
                    </MenuItem>
                    {(options.mouthFeel || []).map((feel) => (
                      <MenuItem 
                        key={feel} 
                        value={feel}
                        sx={selectMenuStyles['& .MuiMenuItem-root']}
                      >
                        {feel}
                      </MenuItem>
                    ))}
                  </TextField>
                </Tooltip>
              </Box>

              <FormControl fullWidth margin="normal">
                <FormLabel sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                  Overall Rating
                </FormLabel>
                <Tooltip
                  title="Rate your overall coffee experience from 1-5 hearts"
                  arrow
                  placement="top"
                >
                  <Rating
                    name="rating"
                    value={form.rating}
                    precision={0.5}
                    max={5}
                    icon={<FavoriteIcon fontSize="inherit" />}
                    emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                    onChange={(_, value) => setForm((prev) => ({ ...prev, rating: value || 1 }))}
                    sx={{
                      mt: 1,
                      '& .MuiRating-iconFilled': { color: theme.palette.accent.main },
                      '& .MuiRating-iconEmpty': { color: 'rgba(0, 0, 0, 0.26)' },
                    }}
                  />
                </Tooltip>
                <FormHelperText sx={{ color: theme.palette.text.secondary }}>
                  {form.rating ? `${form.rating} out of 5 hearts` : 'Select your rating'}
                </FormHelperText>
              </FormControl>
            </Paper>
          </Grid>

          {/* Tasting Notes - Full Width */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={sectionStyles}>
              <Typography variant="h6" sx={sectionHeaderStyles}>
                Tasting Notes
              </Typography>

              <FormControl fullWidth required>
                <FormLabel sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 1 }}>
                  Select at least one tasting note
                </FormLabel>
                <FormGroup
                  sx={{
                    display: 'grid', // Changed from 'flex'
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
                            color: theme.palette.primary.main,
                            '&.Mui-checked': { color: theme.palette.secondary.main },
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                          {note}
                        </Typography>
                      }
                      sx={{
                        backgroundColor: form.tastingNotes.includes(note)
                          ? theme.palette.mode === 'dark'
                            ? 'rgba(25, 118, 210, 0.2)' // ✅ Simplified - no need for complex replace
                            : 'rgba(25, 118, 210, 0.1)'
                          : theme.palette.mode === 'dark'
                            ? theme.palette.background.paper
                            : 'rgba(255, 255, 255, 0.8)',
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                        m: 0,
                        border: form.tastingNotes.includes(note)
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
                  ))}
                </FormGroup>
              </FormControl>
            </Paper>
          </Grid>

          {/* Notes and Actions */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={sectionStyles}>
              <Typography variant="h6" sx={sectionHeaderStyles}>
                Additional Details
              </Typography>

              <TextField
                label="Additional Notes"
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
                sx={textFieldStyles}
              />

              {/* Actions Section */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 3,
                  pt: 2,
                  borderTop: `1px solid ${theme.palette.divider}`,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isPublic"
                      checked={form.isPublic}
                      onChange={handleChange}
                      sx={{ color: theme.palette.primary.main }}
                    />
                  }
                  label="Make this tasting public"
                  sx={{ color: theme.palette.text.primary }}
                />
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
                    {' '}
                    {/* Added span wrapper for disabled button */}
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
                        minWidth: 160,
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
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default TastingForm;
