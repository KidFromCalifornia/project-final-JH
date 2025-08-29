import { useState } from "react";
import { cafeAPI } from "../../services/api";
import { SwalAlertStyles, showAlert } from "../../styles/SwalAlertStyles";
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
  Grid,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const CATEGORY_OPTIONS = ["specialty", "roaster", "thirdwave"];
    const FEATURE_OPTIONS = [
  "outdoor_seating",
  "wheelchair_accessible",
  "lunch",
  "pour_over",
  "takeaway",
  "vegan_options",
  "breakfast",
  "iced_drinks",
  "pastries",
  "multi_roaster",
  "decaf",
  "no_coffee_bar",
  "limited_sitting",
  "roaster_only",
];

const NewCafeForm = ({ onClose }) => {
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
    name: "",
    website: "",
    description: "",
    category: "",
    hasMultipleLocations: false,
    features: [],
    images: [""],
    locations: [
      {
        address: "",
        neighborhood: "",
        locationNote: "",
        isMainLocation: true,
      },
    ],
  });
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");

  const getFeatureTooltip = (feature) => {
    const tooltips = {
      outdoor_seating: "Has outdoor seating available",
      wheelchair_accessible: "Accessible for wheelchair users",
      lunch: "Serves lunch options",
      pour_over: "Offers pour-over brewing methods",
      takeaway: "Offers takeaway/to-go options",
      vegan_options: "Has vegan food and drink options",
      breakfast: "Serves breakfast items",
      iced_drinks: "Offers cold/iced beverages",
      pastries: "Serves pastries and other baked goods",
      multi_roaster: "Features coffee from multiple roasters",
      decaf: "Offers decaffeinated coffee options",
      no_coffee_bar: "No on-site coffee bar (retail, office or roastery)",
      limited_sitting: "Limited seating available",
      roaster_only: "Roastery without public seating",
    };
    return tooltips[feature] || `Feature: ${feature.replace(/_/g, " ")}`;
  };

  // Handle basic field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      locations[idx][name] = type === "checkbox" ? checked : value;
      return { ...prev, locations };
    });
  };

  // Geocode address using OpenStreetMap Nominatim
  const geocodeAddress = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data[0]) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    }
    return null;
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
          address: "",
          neighborhood: "",
          locationNote: "",
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
    setStatus("");
    try {
      // Geocode each location
      const locationsWithCoords = await Promise.all(
        form.locations.map(async (loc) => {
          const geo = await geocodeAddress(loc.address);
          return {
            ...loc,
            coordinates: geo
              ? {
                  type: "Point",
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
        setStatusType("success");
        setStatus("Cafe added!");
        setForm({
          name: "",
          website: "",
          description: "",
          category: "",
          hasMultipleLocations: false,
          features: [],
          images: [""],
          locations: [
            {
              address: "",
              neighborhood: "",
              locationNote: "",
              isMainLocation: true,
            },
          ],
        });
      } else {
        setStatusType("error");
        setStatus(
          result.error ||
            "We couldn't add this cafe. Please check and try again."
        );
      }
    } catch (err) {
      // Only show sweet alert if server is completely down (network error)
      if (err.code === 'NETWORK_ERROR' || err.message?.includes('fetch') || !err.response) {
        showAlert({
          title: "Server Unavailable",
          text: "We couldn't reach the server. Please try again later.",
          icon: "error",
        });
      } else {
        // For other errors, use inline status display
        setStatus("We couldn't submit your suggestion. Please try again.");
        setStatusType("error");
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: { xs: "100%", sm: 640 },
        maxWidth: { xs: "none", sm: 640 },
        p: { xs: 2, sm: 3 },
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
      }}
    >
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        mb: 1,
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: theme.palette.text.primary,
            fontSize: { xs: "1.5rem", sm: "2rem" },
          }}
        >
          Suggest a Cafe
        </Typography>
        <IconButton 
          onClick={onClose} 
          aria-label="Close add cafe form" 
          color="inherit"
          sx={{ 
            p: { xs: 1, sm: 1.5 },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {status && (
        <Box sx={{ mb: 2 }}>
          <SwalAlertStyles message={status} type={statusType} />
        </Box>
      )}

      {/* Basic Information - 2 columns for better space usage */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={8}>
          <TextField
            label="Cafe Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
            size="small"
            sx={textFieldStyles}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth required size="small">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              name="category"
              value={form.category}
              label="Category"
              onChange={handleChange}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label="Primary Address"
            name="address"
            value={form.locations[0]?.address || ""}
            onChange={(e) => handleLocationChange(e, 0)}
            required
            fullWidth
            size="small"
            placeholder="Street address, city"
            sx={textFieldStyles}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            label="Neighborhood"
            name="neighborhood"
            value={form.locations[0]?.neighborhood || ""}
            onChange={(e) => handleLocationChange(e, 0)}
            fullWidth
            size="small"
            sx={textFieldStyles}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            label="Website (optional)"
            name="website"
            value={form.website}
            onChange={handleChange}
            fullWidth
            size="small"
            placeholder="https://..."
            sx={textFieldStyles}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }}>
        <Typography variant="subtitle2" sx={{ color: "inherit" }}>
          Location
        </Typography>
      </Divider>
      <Stack spacing={{ xs: 1.5, sm: 2 }}>
        {form.locations.map((loc, idx) => (
          <Paper
            key={idx}
            variant="outlined"
            sx={(t) => ({
              p: { xs: 1.5, sm: 2 },
              position: "relative",
              backgroundColor: t.palette.background.paper,
              borderColor: t.palette.divider,
              borderRadius: 1,
            })}
          >
            {form.locations.length > 1 && (
              <IconButton
                aria-label="Remove this location"
                onClick={() => removeLocation(idx)}
                size="small"
                color="inherit"
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
            <Stack spacing={{ xs: 1.5, sm: 2 }}>
              <TextField
                label="Address"
                name="address"
                value={loc.address}
                onChange={(e) => handleLocationChange(e, idx)}
                required
                fullWidth
                size="small"
                sx={textFieldStyles}
              />
              <TextField
                label="Neighborhood"
                name="neighborhood"
                value={loc.neighborhood}
                onChange={(e) => handleLocationChange(e, idx)}
                fullWidth
                size="small"
                sx={textFieldStyles}
              />
              <TextField
                label="Location Note"
                name="locationNote"
                value={loc.locationNote}
                onChange={(e) => handleLocationChange(e, idx)}
                fullWidth
                size="small"
                sx={textFieldStyles}
              />
            </Stack>
          </Paper>
        ))}
        <Tooltip title="Add another location for this cafe" arrow>
          <Button
            type="button"
            onClick={addLocation}
            startIcon={<AddCircleOutlineIcon />}
            variant="text"
            sx={{ alignSelf: "flex-start" }}
          >
            Add Another Location
          </Button>
        </Tooltip>
      </Stack>

      <Divider sx={{ my: 2 }}>
        <Typography variant="subtitle2" sx={{ color: "inherit" }}>
          Features
        </Typography>
      </Divider>
      <FormGroup 
        row 
        sx={{ 
          rowGap: { xs: 0.5, sm: 1 }, 
          columnGap: { xs: 1, sm: 2 },
          '& .MuiFormControlLabel-root': {
            minWidth: { xs: '45%', sm: 'auto' },
            mb: { xs: 0.5, sm: 0 },
          }
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
                />
              }
              label={
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    lineHeight: 1.2
                  }}
                >
                  {feature.replace(/_/g, " ")}
                </Typography>
              }
              sx={(t) => ({ color: t.palette.text.primary })}
            />
          </Tooltip>
        ))}
      </FormGroup>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ 
          py: { xs: 1.5, sm: 1.5 },
          px: { xs: 2, sm: 3 },
          mt: 3,
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
      >
        Add Cafe
      </Button>
    </Box>
  );
};

export default NewCafeForm;
