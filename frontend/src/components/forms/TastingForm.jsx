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
      width: { xs: "100%", sm: 640 },
      maxWidth: { xs: "none", sm: 640 },
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
        
        {/* Coffee Information Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Coffee Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Brewing Information Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Brewing Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Tasting Notes Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tasting Experience
          </Typography>
          
          <FormControl fullWidth margin="normal" required sx={{ mb: 2, '& .MuiFormLabel-root': {  }, '& .MuiFormLabel-root.Mui-focused': {  } }}>
            <FormLabel component="legend">Tasting Notes (Select at least one)</FormLabel>
            <FormGroup row>
              {(options.tastingNotes || []).map((note) => (
                <FormControlLabel
                  key={note}
                  control={
                    <Checkbox
                      name="tastingNotes"
                      value={note}
                      checked={form.tastingNotes.includes(note)}
                      onChange={handleTastingNotesChange}
                    />
                  }
                  label={note}
                  sx={{ minWidth: '200px', mb: 1 }}
                />
              ))}
            </FormGroup>
          </FormControl>

          <FormControl  margin="normal" sx={{ mb: 2, '& .MuiFormLabel-root': { color: 'text.primary' }, '& .MuiFormLabel-root.Mui-focused': { color: 'text.primary' } }}>
            <FormLabel component="legend">Overall Rating</FormLabel>
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
                sx={{ mt: 1 }}
              />
            </Tooltip>
            <FormHelperText>
              {form.rating ? `${form.rating} out of 5 hearts` : "Select your rating"}
            </FormHelperText>
          </FormControl>

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
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Settings Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Privacy Settings
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                id="isPublic"
                name="isPublic"
                checked={form.isPublic}
                onChange={handleChange}
              />
            }
            label="Make this tasting public (visible to other users)"
          />
        </Box>

        {/* Submit Button */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ 
              minWidth: 200, 
              py: { xs: 1.5, sm: 1.5 },
              px: { xs: 2, sm: 3 },
              minHeight: { xs: 48, sm: 42 }, // Better touch targets
              fontSize: { xs: "16px", sm: "14px" },
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
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
      </form>
    </Paper>
  );
};

export default TastingForm;
