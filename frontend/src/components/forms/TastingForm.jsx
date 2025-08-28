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
} from "@mui/material";
import Grid from "@mui/material/Grid";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const TastingForm = ({ onSubmit, initialValues = {} }) => {
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
        setFetchError("");
        showAlert({
          title: "We couldn't load form options",
          text: "We couldn't reach the server. Please try again.",
          icon: "error",
        });
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
      p: 3, 
      mb: 4,
      '& .MuiTextField-root': {
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
           
          },
        },
        '& .MuiInputLabel-root.Mui-focused': {
         
        },
      },
      '& .MuiCheckbox-root.Mui-checked': {
     
      },
    }}>
      <Typography variant="h5" component="h2" gutterBottom>
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
            size="large"
            sx={{ minWidth: 200, py: 1.5 }}
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
