import { useState, useEffect } from 'react';
import { useCafeStore } from '../../stores/useCafeStore';
import { apiCall } from '../../services/api';
import { useAlert } from '../../context/AlertContext';
import { handleApiError } from '../../utils/errorHandler';
import Slider from '@mui/material/Slider';
import TastingWheel from '../common/TastingWheel';
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  FormLabel,
  FormHelperText,
  Box,
  Typography,
  Paper,
  Tooltip,
  useTheme,
  Alert,
  Autocomplete,
  Rating,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import WhatshotOutlinedIcon from '@mui/icons-material/WhatshotOutlined';

const ROAST_LEVELS = ['light', 'medium', 'dark'];
const SUBMISSION_LIMIT = 5;
const SUBMISSION_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const checkSubmissionLimit = () => {
  const stored = JSON.parse(localStorage.getItem('tastingSubmissions') || '[]');
  const recent = stored.filter((ts) => Date.now() - ts < SUBMISSION_WINDOW_MS);
  return { allowed: recent.length < SUBMISSION_LIMIT, remaining: SUBMISSION_LIMIT - recent.length };
};

const recordSubmission = () => {
  const stored = JSON.parse(localStorage.getItem('tastingSubmissions') || '[]');
  const recent = stored.filter((ts) => Date.now() - ts < SUBMISSION_WINDOW_MS);
  localStorage.setItem('tastingSubmissions', JSON.stringify([...recent, Date.now()]));
};

const TastingForm = ({ onSubmit, initialValues = {}, onClose }) => {
  const theme = useTheme();
  const { showSnackbar } = useAlert();
  const isDark = theme.palette.mode === 'dark';

  const [form, setForm] = useState({
    cafeId:
      typeof initialValues.cafeId === 'object' && initialValues.cafeId?._id
        ? initialValues.cafeId._id
        : initialValues.cafeId || '',
    signature: '',
    coffeeName: initialValues.coffeeName || '',
    coffeeRoaster: initialValues.coffeeRoaster || '',
    coffeeOrigin: initialValues.coffeeOrigin || '',
    coffeeOriginRegion: initialValues.coffeeOriginRegion || '',
    brewMethod: initialValues.brewMethod || '',
    tastingNotes: initialValues.tastingNotes || [],
    acidity: initialValues.acidity || '',
    mouthFeel: initialValues.mouthFeel || '',
    roastLevel: initialValues.roastLevel || '',
    notes: initialValues.notes || '',
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [selectedCafe, setSelectedCafe] = useState(null);

  const cafes = useCafeStore((state) => state.cafes);
  const setCafes = useCafeStore((state) => state.setCafes);
  const options = useCafeStore((state) => state.options);
  const setOptions = useCafeStore((state) => state.setOptions);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiCall('/metadata/form-options');
        setCafes(data.cafes || []);
        setOptions(data.enums || {});
      } catch (error) {
        handleApiError(error, showSnackbar, "Couldn't load form options. Please try again.");
      }
    };
    if (!cafes || cafes.length === 0) fetchData();
  }, [setCafes, setOptions]);

  // Seed selectedCafe from initialValues
  useEffect(() => {
    if (form.cafeId && cafes.length > 0 && !selectedCafe) {
      const match = cafes.find((c) => c._id === form.cafeId);
      if (match) setSelectedCafe(match);
    }
  }, [cafes, form.cafeId]);

  const validate = () => {
    const e = {};
    if (!form.cafeId) e.cafeId = 'Please select a cafe';
    if (!form.coffeeName.trim()) e.coffeeName = 'Coffee name is required';
    if (!form.coffeeRoaster.trim()) e.coffeeRoaster = 'Roaster is required';
    if (!form.brewMethod) e.brewMethod = 'Brew method is required';
    if (form.tastingNotes.length === 0) e.tastingNotes = 'Select at least one tasting note';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const { allowed, remaining } = checkSubmissionLimit();
    if (!allowed) {
      setSubmitError('You have reached the limit of 5 submissions per hour. Please try again later.');
      return;
    }
    recordSubmission();
    onSubmit(form);
  };

  const sectionBg = alpha(theme.palette.secondary.main, 0.2);
  const labelColor = isDark ? 'light.main' : 'text.primary';

  return (
    <Paper
      elevation={6}
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', md: '900px' },
        mx: 'auto',
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        align="center"
        gutterBottom
        sx={{
          mb: 2,
          fontWeight: 700,
          color: isDark ? 'light.main' : 'primary.main',
        }}
      >
        Add New Coffee Tasting
      </Typography>

      <form onSubmit={handleSubmit} aria-label="Coffee Tasting Form">
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <Grid container spacing={2}>

          {/* Section 1 — Coffee Details */}
          <Grid item xs={12}>
            <Box sx={{ borderRadius: 1, backgroundColor: sectionBg, p: 2 }}>
              <Typography variant="h6" sx={{ mb: 1.5, color: 'light.main', fontWeight: 700 }}>
                Coffee Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    options={cafes}
                    getOptionLabel={(option) => option.name || ''}
                    value={selectedCafe}
                    onChange={(_, newValue) => {
                      setSelectedCafe(newValue);
                      setForm((prev) => ({ ...prev, cafeId: newValue?._id || '' }));
                      if (errors.cafeId) setErrors((prev) => ({ ...prev, cafeId: '' }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Cafe *"
                        variant="filled"
                        error={!!errors.cafeId}
                        helperText={errors.cafeId}
                        placeholder="Type to search cafes…"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Coffee Name *"
                    name="coffeeName"
                    value={form.coffeeName}
                    onChange={handleChange}
                    fullWidth
                    variant="filled"
                    error={!!errors.coffeeName}
                    helperText={errors.coffeeName}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Roaster *"
                    name="coffeeRoaster"
                    value={form.coffeeRoaster}
                    onChange={handleChange}
                    fullWidth
                    variant="filled"
                    error={!!errors.coffeeRoaster}
                    helperText={errors.coffeeRoaster}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Country"
                    name="coffeeOrigin"
                    value={form.coffeeOrigin}
                    onChange={handleChange}
                    fullWidth
                    variant="filled"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Region"
                    name="coffeeOriginRegion"
                    value={form.coffeeOriginRegion}
                    onChange={handleChange}
                    fullWidth
                    variant="filled"
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Sections 2 & 3 — Taste Profile + Tasting Wheel */}
          <Grid item xs={12}>
            <Box sx={{ borderRadius: 1, backgroundColor: sectionBg, p: 2 }}>
              <Typography variant="h6" sx={{ mb: 1.5, color: 'light.main', fontWeight: 700 }}>
                Taste Profile
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 3,
                  alignItems: 'flex-start',
                }}
              >
                {/* Left column — controls */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                  <TextField
                    select
                    label="Brew Method *"
                    name="brewMethod"
                    value={form.brewMethod}
                    onChange={handleChange}
                    fullWidth
                    variant="filled"
                    error={!!errors.brewMethod}
                    helperText={errors.brewMethod}
                  >
                    <MenuItem value="">Select</MenuItem>
                    {(options.brewMethod || []).map((m) => (
                      <MenuItem key={m} value={m}>{m}</MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Mouth Feel"
                    name="mouthFeel"
                    value={form.mouthFeel}
                    onChange={handleChange}
                    fullWidth
                    variant="filled"
                  >
                    <MenuItem value="">Select</MenuItem>
                    {(options.mouthFeel || []).map((m) => (
                      <MenuItem key={m} value={m}>{m}</MenuItem>
                    ))}
                  </TextField>

                  <FormControl fullWidth>
                    <FormLabel sx={{ color: 'light.main', mb: 1 }}>
                      Acidity
                      {form.acidity && (
                        <Typography component="span" variant="caption" sx={{ ml: 1, color: 'light.main', textTransform: 'capitalize' }}>
                          ({form.acidity})
                        </Typography>
                      )}
                    </FormLabel>
                    <Box sx={{ px: 1 }}>
                      <Slider
                        value={['light', 'medium', 'high'].indexOf(form.acidity) + 1 || 0}
                        min={0}
                        max={3}
                        step={1}
                        marks={[
                          { value: 0, label: '' },
                          { value: 1, label: 'Light' },
                          { value: 2, label: 'Medium' },
                          { value: 3, label: 'High' },
                        ]}
                        onChange={(_, val) =>
                          setForm((prev) => ({
                            ...prev,
                            acidity: val === 0 ? '' : ['light', 'medium', 'high'][val - 1],
                          }))
                        }
                        sx={{
                          color: theme.palette.accent?.main || theme.palette.primary.main,
                          '& .MuiSlider-markLabel': { color: 'light.main' },
                        }}
                      />
                    </Box>
                  </FormControl>

                  <FormControl>
                    <FormLabel sx={{ color: 'light.main', mb: 0.5 }}>
                      Roast Level
                      {form.roastLevel && (
                        <Typography component="span" variant="caption" sx={{ ml: 1, color: 'light.main', textTransform: 'capitalize' }}>
                          ({form.roastLevel})
                        </Typography>
                      )}
                    </FormLabel>
                    <Rating
                      value={ROAST_LEVELS.indexOf(form.roastLevel) + 1 || 0}
                      max={3}
                      onChange={(_, val) =>
                        setForm((prev) => ({ ...prev, roastLevel: val ? ROAST_LEVELS[val - 1] : '' }))
                      }
                      icon={<WhatshotIcon fontSize="large" sx={{ color: theme.palette.accent?.main || '#ff6b35' }} />}
                      emptyIcon={<WhatshotOutlinedIcon fontSize="large" sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)' }} />}
                    />
                    <FormHelperText sx={{ color: 'light.main' }}>
                      1 = light · 2 = medium · 3 = dark
                    </FormHelperText>
                  </FormControl>
                </Box>

                {/* Right column — tasting wheel */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexShrink: 0,
                    width: { xs: '100%', md: 'auto' },
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: labelColor, mb: 0.5 }}>
                    Tasting Notes *
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1 }}>
                    Tap segments to select
                  </Typography>

                  {errors.tastingNotes && (
                    <Alert severity="error" sx={{ mb: 1, width: '100%' }}>
                      {errors.tastingNotes}
                    </Alert>
                  )}

                  <TastingWheel
                    selected={form.tastingNotes}
                    onChange={(notes) => {
                      setForm((prev) => ({ ...prev, tastingNotes: notes }));
                      if (errors.tastingNotes) setErrors((prev) => ({ ...prev, tastingNotes: '' }));
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Section 4 — Additional Details + Actions */}
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                backgroundColor: isDark ? alpha(theme.palette.secondary.main, 0.2) : theme.palette.background.paper,
              }}
            >
              <TextField
                name="notes"
                value={form.notes}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                variant="filled"
                label="Additional tasting notes and/or brew recipes"
                placeholder="e.g. 18g in / 36g out / 28s · bright finish with lingering sweetness…"
                inputProps={{ maxLength: 500 }}
              />

              {/* Actions row — signature left, buttons right */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'stretch', sm: 'center' },
                  gap: 2,
                  mt: 2,
                }}
              >
                <TextField
                  label="Your signature (optional)"
                  name="signature"
                  value={form.signature}
                  onChange={handleChange}
                  variant="filled"
                  size="small"
                  placeholder="Leave blank to post as Anonymous"
                  sx={{ flex: 1, maxWidth: { sm: '280px' } }}
                />

                <Box sx={{ display: 'flex', gap: 1.5, justifyContent: { xs: 'flex-end' } }}>
                  {onClose && (
                    <Button
                      onClick={onClose}
                      variant="outlined"
                      size="large"
                      sx={{ minWidth: '6rem' }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Tooltip
                    title={
                      !form.cafeId || !form.coffeeName || !form.coffeeRoaster || !form.brewMethod || form.tastingNotes.length === 0
                        ? 'Please fill in all required fields'
                        : ''
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
                          !form.cafeId || !form.coffeeName || !form.coffeeRoaster || !form.brewMethod || form.tastingNotes.length === 0
                        }
                        sx={{ minWidth: '8rem', fontWeight: 600 }}
                      >
                        Add Tasting
                      </Button>
                    </span>
                  </Tooltip>
                </Box>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {checkSubmissionLimit().remaining} of {SUBMISSION_LIMIT} submissions remaining this hour
              </Typography>
            </Box>
          </Grid>

        </Grid>
      </form>
    </Paper>
  );
};

export default TastingForm;
