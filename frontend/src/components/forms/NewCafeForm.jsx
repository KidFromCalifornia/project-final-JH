import { useState, useEffect } from 'react';
import { apiCall } from '../../services/api';
import { useAlert } from '../../context/AlertContext';
import { handleApiError } from '../../utils/errorHandler';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Tooltip,
  useTheme,
  MenuItem,
  Autocomplete,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { alpha } from '@mui/material/styles';
import { useCafeStore } from '../../stores/useCafeStore';

const NEIGHBORHOODS = [
  'Bromma',
  'Enskede-Årsta-Vantör',
  'Farsta',
  'Hägersten-Älvsjö',
  'Hässelby-Vällingby',
  'Kungsholmen',
  'Lidingö',
  'Nacka',
  'Norrmalm',
  'Rinkeby-Kista',
  'Skarpnäck',
  'Skärholmen',
  'Spånga-Tensta',
  'Södermalm',
  'Vasastan',
  'Östermalm',
];

const CATEGORIES = [
  {
    value: 'specialty',
    label: 'Specialty',
    tooltip: 'Scored 80+ by industry graders, commonly arabica, carefully sourced',
  },
  {
    value: 'roaster',
    label: 'Roaster',
    tooltip: 'Roasts their own beans, working with specialty grade coffee and/or third wave practices',
  },
  {
    value: 'thirdwave',
    label: 'Third Wave',
    tooltip: 'First coined by Trish Rothgeb in 2002, the practice of treating coffee as a craft. Locations that go beyond just serving it',
  },
];

const NewCafeForm = ({ onClose, onSuccess }) => {
  const theme = useTheme();
  const { showSnackbar } = useAlert();
  const cafes = useCafeStore((state) => state.cafes);
  const setCafes = useCafeStore((state) => state.setCafes);

  useEffect(() => {
    if (!cafes || cafes.length === 0) {
      apiCall('/cafes').then((data) => {
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setCafes(list);
      }).catch(() => {});
    }
  }, []);

  const [isExistingCafe, setIsExistingCafe] = useState(false);
  const [parentCafe, setParentCafe] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    website: '',
    description: '',
    address: '',
    neighborhood: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!isExistingCafe && !formData.name.trim()) newErrors.name = 'Cafe name is required';
    if (!isExistingCafe && !formData.category) newErrors.category = 'Category is required';
    if (!isExistingCafe && !formData.description.trim())
      newErrors.description = 'Description is required';
    if (!isExistingCafe && !formData.website.trim()) newErrors.website = 'Website or Instagram is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (isExistingCafe && !parentCafe) newErrors.parentCafe = 'Please select the existing cafe';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = isExistingCafe
      ? {
          name: parentCafe.name,
          category: parentCafe.category,
          description: parentCafe.description || '',
          website: formData.website.trim(),
          hasMultipleLocations: true,
          locations: [
            {
              address: formData.address.trim(),
              neighborhood: formData.neighborhood,
              isMainLocation: false,
            },
          ],
          isApproved: false,
          parentCafeId: parentCafe._id,
        }
      : {
          name: formData.name.trim(),
          category: formData.category,
          description: formData.description.trim(),
          website: formData.website.trim(),
          hasMultipleLocations: false,
          locations: [
            {
              address: formData.address.trim(),
              neighborhood: formData.neighborhood,
              isMainLocation: true,
            },
          ],
          isApproved: false,
        };

    try {
      const response = await apiCall('/cafes', { method: 'POST', body: JSON.stringify(payload) });
      showSnackbar('Cafe submitted! It will appear on the map once approved.', 'success');
      onSuccess?.(response);
      onClose?.();
    } catch (err) {
      handleApiError(err, showSnackbar, 'Failed to submit cafe. Please try again.');
    }
  };

  const sectionBg = alpha(theme.palette.secondary.main, 0.2);
  const labelColor = 'light.main';

  return (
    <Paper
      elevation={6}
      sx={{
        width: '100%',
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
        sx={{ mb: 3, fontSize: { xs: '1.5rem', sm: '2rem' }, color: theme.palette.text.light }}
      >
        Submit a Cafe
      </Typography>

      <form onSubmit={handleSubmit} aria-label="Submit New Cafe Form">
        <Grid container spacing={3}>
          {/* Existing cafe checkbox — top of form */}
          <Grid item xs={12}>
            <Box sx={{ p: 2, borderRadius: 1, backgroundColor: sectionBg }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isExistingCafe}
                    onChange={(e) => {
                      setIsExistingCafe(e.target.checked);
                      if (!e.target.checked) setParentCafe(null);
                    }}
                  />
                }
                label={
                  <Typography color={labelColor} fontWeight={600}>
                    Add another location for an existing cafe
                  </Typography>
                }
              />

              {isExistingCafe && (
                <Autocomplete
                  options={cafes.filter((c, i, arr) => arr.findIndex((x) => x._id === c._id) === i)}
                  getOptionLabel={(c) => c.name}
                  value={parentCafe}
                  onChange={(_, value) => {
                    setParentCafe(value);
                    if (errors.parentCafe) setErrors((prev) => ({ ...prev, parentCafe: '' }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select existing cafe *"
                      margin="normal"
                      error={!!errors.parentCafe}
                      helperText={errors.parentCafe}
                    />
                  )}
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
          </Grid>

          {/* Basic info — hidden when adding location to existing cafe */}
          {!isExistingCafe && (
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, borderRadius: 1, backgroundColor: sectionBg }}>
                <Typography variant="h6" color={labelColor} gutterBottom>
                  Basic Info
                </Typography>

                <Tooltip title="The cafe's full trading name" placement="top" arrow>
                  <TextField
                    label="Cafe Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                </Tooltip>

                <TextField
                  select
                  label="Category *"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.category}
                  helperText={
                    errors.category ||
                    CATEGORIES.find((c) => c.value === formData.category)?.tooltip ||
                    'Select a category'
                  }
                >
                  {CATEGORIES.map((c) => (
                    <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
                  ))}
                </TextField>
              </Box>
            </Grid>
          )}

          {/* Location */}
          <Grid item xs={12} md={isExistingCafe ? 12 : 6}>
            <Box sx={{ p: 2, borderRadius: 1, backgroundColor: sectionBg }}>
              <Typography variant="h6" color={labelColor} gutterBottom>
                Location
              </Typography>

              <Tooltip title="Full street address" placement="top" arrow>
                <TextField
                  label="Address *"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </Tooltip>

              <Tooltip title="Select the Stockholm neighbourhood" placement="top" arrow>
                <TextField
                  select
                  label="Neighbourhood"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                >
                  <MenuItem value="">— Select —</MenuItem>
                  {NEIGHBORHOODS.map((n) => (
                    <MenuItem key={n} value={n}>
                      {n}
                    </MenuItem>
                  ))}
                </TextField>
              </Tooltip>

              <Tooltip
                title="Instagram handle (e.g. @cafename) or website URL"
                placement="top"
                arrow
              >
                <TextField
                  label={isExistingCafe ? 'Website or Instagram' : 'Website or Instagram *'}
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  placeholder="https://cafe.com or @cafename"
                  error={!!errors.website}
                  helperText={errors.website}
                />
              </Tooltip>
            </Box>
          </Grid>

          {/* Description — hidden when adding location to existing cafe */}
          {!isExistingCafe && (
            <Grid item xs={12}>
              <Box sx={{ p: 2, borderRadius: 1, backgroundColor: sectionBg }}>
                <Typography variant="h6" color={labelColor} gutterBottom>
                  Description *
                </Typography>
                <Tooltip
                  title="Describe the cafe's atmosphere, specialties, or anything that makes it stand out"
                  placement="top"
                  arrow
                >
                  <TextField
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                    placeholder="Tell us about this cafe's atmosphere, specialties, or what makes it unique…"
                    error={!!errors.description}
                    helperText={errors.description}
                  />
                </Tooltip>
              </Box>
            </Grid>
          )}

          {/* Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              {onClose && (
                <Button
                  onClick={onClose}
                  variant="contained"
                  size="medium"
                  sx={{
                    minWidth: '6rem',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    color: '#ebf2fa',
                    '&:hover': { backgroundColor: '#7a8ca3', color: '#0a1f33' },
                    '&:active': { boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.35)', backgroundColor: '#7a8ca3', color: '#ebf2fa' },
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                size="medium"
                sx={{
                  minWidth: '8rem',
                  backgroundColor: '#7a8ca3',
                  color: '#0a1f33',
                  '&:hover': { backgroundColor: '#0a1f33', color: '#ebf2fa' },
                  '&:active': { boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)', backgroundColor: '#7a8ca3', color: '#ebf2fa' },
                }}
                aria-label="Submit Cafe"
              >
                Submit Cafe
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default NewCafeForm;
