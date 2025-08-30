import { useState, useEffect } from "react";
import { useCafeStore } from "../../stores/useCafeStore";
import { apiCall } from "../../services/api";
import { SwalAlertStyles, showAlert } from "../../styles/SwalAlertStyles";
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
} from "@mui/material";
import Grid from "@mui/material/Grid";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const TastingForm = ({ onSubmit, initialValues = {} }) => {
  const theme = useTheme();
  
  // Reusable TextField styling to match LoginForm
  const textFieldStyles = {
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
      '& textarea': {
        color: theme.palette.text.primary,
        fontSize: { xs: "16px", sm: "14px" },
      },
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.text.primary,
      '&.Mui-focused': {
        color: theme.palette.primary.main,
      },
    },
  };

  const [form, setForm] = useState({
    cafeId: initialValues.cafeId || "",
    cafeName: initialValues.cafeName || "",
    cafeNeighborhood: initialValues.cafeNeighborhood || "",
    coffeeRoaster: initialValues.coffeeRoaster || "",
    coffeeOrigin: initialValues.coffeeOrigin || "",
    coffeeOriginRegion: initialValues.coffeeOriginRegion || "",
    brewMethod: initialValues.brewMethod || "",
    tastingNotes: initialValues.tastingNotes || [],
    acidity: initialValues.acidity || "",
    mouthFeel: initialValues.mouthFeel || "",
    roastLevel: initialValues.roastLevel || "",
    rating: initialValues.rating || 3,
    notes: initialValues.notes || "",
    isPublic:
      initialValues.isPublic !== undefined ? initialValues.isPublic : true,
    coffeeName: initialValues.coffeeName || "",
  });
  
  const cafes = useCafeStore((state) => state.cafes);
  const setCafes = useCafeStore((state) => state.setCafes);
  const options = useCafeStore((state) => state.options);
  const setOptions = useCafeStore((state) => state.setOptions);
  const fetchError = useCafeStore((state) => state.fetchError);
  const setFetchError = useCafeStore((state) => state.setFetchError);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiCall("/metadata/form-options");
        setCafes(data.cafes || []);
        setOptions(data.enums || {});
      } catch (error) {
        console.error("Error fetching metadata:", error);
        // Only show sweet alert if server is completely down (network error)
        if (error.code === 'NETWORK_ERROR' || error.message?.includes('fetch') || !error.response) {
          showAlert({
            title: "Server Unavailable",
            text: "We couldn't reach the server. Please try again later.",
            icon: "error",
          });
        } else {
          // For other errors, use inline error display
          setFetchError("We couldn't load form options. Please try again.");
        }
      }
    };
    if (!cafes || cafes.length === 0) {
      fetchData();
    }
  }, [setCafes, setOptions, setFetchError, cafes]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (fetchError) setFetchError("");
  };

  const handleTastingNotesChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      tastingNotes: checked
        ? [...prev.tastingNotes, value]
        : prev.tastingNotes.filter((note) => note !== value),
    }));
    if (fetchError) setFetchError("");
  };

  const handleCafeChange = (e) => {
    const selectedCafe = cafes.find((c) => c._id === e.target.value);
    setForm((prev) => ({
      ...prev,
      cafeId: e.target.value,
      cafeNeighborhood: selectedCafe ? selectedCafe.neighborhood : "",
    }));
    if (fetchError) setFetchError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.tastingNotes.length === 0) {
      setFetchError("Please select at least one tasting note.");
      return;
    }
    onSubmit(form);
  };

  return (
    <Paper elevation={2} sx={{ 
      width: { xs: "100%", sm: 640, md: 900, lg: 1000 },
      maxWidth: { xs: "none", sm: 640, md: 900, lg: 1000 },
      p: { xs: 2, sm: 3 },
      mb: 4,
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
    }}>
      <Typography 
        variant="h4" 
        component="h2" 
        gutterBottom
        sx={{ 
          color: theme.palette.text.primary,
          fontSize: { xs: "1.5rem", sm: "2rem" },
          mb: 2,
        }}
      >
        {initialValues.cafeId ? 'Edit Coffee Tasting' : 'Add New Coffee Tasting'}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        {fetchError && <SwalAlertStyles message={fetchError} type="error" />}
        
        {/* Main Form Container - Flex Row Layout */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 3,
          alignItems: 'flex-start'
        }}>
          
          {/* Left Column */}
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}>
            
            {/* Coffee Information Section */}
            <Paper elevation={1} sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600, mb: 2 }}>
                Coffee Information
              </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <TextField
                label="Coffee Name"
                name="coffeeName"
                value={form.coffeeName}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <TextField
                select
                label="Where did you taste this coffee?"
                name="cafeId"
                value={form.cafeId}
                onChange={handleCafeChange}
                required
                fullWidth
                margin="normal"
                sx={textFieldStyles}
              >
                <MenuItem value="">Select a cafe</MenuItem>
                {cafes.map((cafe) => (
                  <MenuItem key={cafe._id} value={cafe._id}>
                    {cafe.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <TextField
                label="Coffee Roaster"
                name="coffeeRoaster"
                value={form.coffeeRoaster}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <TextField
                label="Coffee Origin"
                name="coffeeOrigin"
                value={form.coffeeOrigin}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <TextField
                label="Coffee Region"
                name="coffeeOriginRegion"
                value={form.coffeeOriginRegion}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4}>
              <div></div> {/* Empty grid item for spacing */}
            </Grid>
          </Grid>
        </Paper>
        
      </Box>
          
      {/* Right Column */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}>

        {/* Brewing Information Section */}
        <Paper elevation={1} sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600, mb: 2 }}>
            Brewing Method & Profile
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <TextField
                select
                label="Brew Method"
                name="brewMethod"
                value={form.brewMethod}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
                sx={textFieldStyles}
              >
                <MenuItem value="">Select</MenuItem>
                {(options.brewMethod || []).map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <TextField
                select
                label="Roast Level"
                name="roastLevel"
                value={form.roastLevel}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
                sx={textFieldStyles}
              >
                <MenuItem value="">Select</MenuItem>
                {(options.roastLevel || []).map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <TextField
                select
                label="Acidity"
                name="acidity"
                value={form.acidity}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
                sx={textFieldStyles}
              >
                <MenuItem value="">Select</MenuItem>
                {(options.acidity || []).map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <TextField
                select
                label="Mouth Feel"
                name="mouthFeel"
                value={form.mouthFeel}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
                sx={textFieldStyles}
              >
                <MenuItem value="">Select</MenuItem>
                {(options.mouthFeel || []).map((feel) => (
                  <MenuItem key={feel} value={feel}>
                    {feel}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            {/* Rating Section */}
            <Grid item xs={12}>
              <FormControl margin="normal" sx={{ mt: 2, '& .MuiFormLabel-root': { color: theme.palette.text.primary }, '& .MuiFormLabel-root.Mui-focused': { color: theme.palette.text.primary } }}>
                <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>Overall Rating</FormLabel>
                <Tooltip title="Rate your overall coffee experience from 1-5 hearts" arrow placement="top">
                  <Rating
                    name="rating"
                    value={form.rating}
                    precision={0.5}
                    max={5}
                    icon={<FavoriteIcon fontSize="inherit" />}
                    emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                    onChange={(e, value) =>
                      setForm((prev) => ({ ...prev, rating: value || 1 }))
                    }
                    sx={{ 
                      mt: 1, 
                      '& .MuiRating-iconFilled': { color: theme.palette.accent.main },
                      '& .MuiRating-iconEmpty': { color: 'rgba(0, 0, 0, 0.26)' }
                    }}
                  />
                </Tooltip>
                <FormHelperText>
                  {form.rating ? `${form.rating} out of 5 hearts` : "Select your rating"}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        
      </Box>
      
    </Box>

    {/* Full Width Sections */}
    <Box sx={{ mt: 3 }}>

        {/* Tasting Experience Section */}
        <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600, mb: 2 }}>
            Tasting Experience & Notes
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal" required sx={{ mb: 2, '& .MuiFormLabel-root': { color: theme.palette.text.primary }, '& .MuiFormLabel-root.Mui-focused': { color: theme.palette.text.primary } }}>
                <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>Tasting Notes (Select at least one)</FormLabel>
                <FormGroup sx={{ 
                  display: 'flex', 
                  flexDirection: 'row', 
                  flexWrap: 'wrap', 
                  gap: 1.5,
                  justifyContent: 'flex-start',
                  width: '100%'
                }}>
                  {(options.tastingNotes || []).map((note) => (
                    <FormControlLabel
                      key={note}
                      control={
                        <Checkbox
                          name="tastingNotes"
                          value={note}
                          checked={form.tastingNotes.includes(note)}
                          onChange={handleTastingNotesChange}
                          sx={{ color: theme.palette.primary.main }}
                        />
                      }
                      label={note}
                      sx={{ 
                        minWidth: '180px', 
                        maxWidth: 'calc(25% - 12px)',
                        mb: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        borderRadius: 1,
                        px: 1,
                        mr: 0,
                        flex: '1 1 auto',
                        '@media (max-width: 900px)': {
                          maxWidth: 'calc(33.333% - 12px)'
                        },
                        '@media (max-width: 600px)': {
                          maxWidth: 'calc(50% - 12px)'
                        }
                      }}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Additional Notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                margin="normal"
                inputProps={{ maxLength: 500 }}
                placeholder="Share your thoughts about this coffee experience..."
                helperText={`${form.notes.length}/500 characters`}
                sx={textFieldStyles}
              />
            </Grid>
          </Grid>
        </Paper>

        <Divider sx={{ my: 3 }} />

        {/* Privacy Settings & Submit Section */}
        <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600, mb: 2 }}>
                Privacy Settings
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    id="isPublic"
                    name="isPublic"
                    checked={form.isPublic}
                    onChange={handleChange}
                    sx={{ color: theme.palette.primary.main }}
                  />
                }
                label="Make this tasting public (visible to other users)"
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                  mr: 1
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ 
                    minWidth: 200, 
                    py: { xs: 1.5, sm: 1.5 },
                    px: { xs: 2, sm: 3 },
                    minHeight: { xs: 48, sm: 42 },
                    fontSize: { xs: "16px", sm: "14px" },
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    boxShadow: 3,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                      transform: 'translateY(-2px)',
                      boxShadow: 6,
                    },
                    '&:disabled': {
                      backgroundColor: theme.palette.action.disabled,
                      color: theme.palette.text.disabled,
                    }
                  }}
                  disabled={
                    !form.cafeId ||
                    !form.coffeeName ||
                    !form.brewMethod ||
                    !form.roastLevel ||
                    form.tastingNotes.length === 0
                  }
                >
                  {initialValues.cafeId ? 'Update Tasting' : 'Add Tasting'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
      </Box>
      
      </form>
    </Paper>
  );
};

export default TastingForm;
