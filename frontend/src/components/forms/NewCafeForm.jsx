import React, { useState } from "react";
import { cafeAPI } from "../../services/api";
import { SwalAlertStyles, showAlert } from "../../styles/SwalAlertStyles";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  FormControl,
  InputLabel,
  FormGroup,
  Divider,
  Paper,
  IconButton,
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
  const [statusType, setStatusType] = useState("success");

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
    } catch {
      setStatus("");
      setStatusType("error");
      showAlert({
        title: "We couldn't submit your suggestion",
        text: "We couldn't reach the server. Please try again.",
        icon: "error",
      });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={(t) => ({
        p: 2,
        maxWidth: 640,
        color: t.palette.text.primary,
        backgroundColor: t.palette.background.paper,
      })}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <Typography variant="h6">Suggest a Cafe</Typography>
        <IconButton
          aria-label="Close add cafe form"
          onClick={onClose}
          size="small"
          color="inherit"
        >
          <CloseIcon />
        </IconButton>
      </Stack>
      {status && (
        <Box sx={{ mb: 2 }}>
          <SwalAlertStyles message={status} type={statusType} />
        </Box>
      )}

      <Stack spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Website"
          name="website"
          value={form.website}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          inputProps={{ maxLength: 1000 }}
          fullWidth
          multiline
          minRows={2}
        />
        <FormControl fullWidth required>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            name="category"
            value={form.category}
            label="Category"
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="">
              <em>Select Category</em>
            </MenuItem>
            {CATEGORY_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Divider sx={{ my: 2 }}>
        <Typography variant="subtitle2" sx={{ color: "inherit" }}>
          Location
        </Typography>
      </Divider>
      <Stack spacing={2}>
        {form.locations.map((loc, idx) => (
          <Paper
            key={idx}
            variant="outlined"
            sx={(t) => ({
              p: 2,
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
            <Stack spacing={2}>
              <TextField
                label="Address"
                name="address"
                value={loc.address}
                onChange={(e) => handleLocationChange(e, idx)}
                required
                fullWidth
              />
              <TextField
                label="Neighborhood"
                name="neighborhood"
                value={loc.neighborhood}
                onChange={(e) => handleLocationChange(e, idx)}
                fullWidth
              />
              <TextField
                label="Location Note"
                name="locationNote"
                value={loc.locationNote}
                onChange={(e) => handleLocationChange(e, idx)}
                fullWidth
              />
            </Stack>
          </Paper>
        ))}
        <Button
          type="button"
          onClick={addLocation}
          startIcon={<AddCircleOutlineIcon />}
          variant="text"
          sx={{ alignSelf: "flex-start" }}
        >
          Add Another Location
        </Button>
      </Stack>

      <Divider sx={{ my: 2 }}>
        <Typography variant="subtitle2" sx={{ color: "inherit" }}>
          Features
        </Typography>
      </Divider>
      <FormGroup row sx={{ rowGap: 1, columnGap: 2 }}>
        {FEATURE_OPTIONS.map((feature) => (
          <FormControlLabel
            key={feature}
            control={
              <Checkbox
                size="small"
                name={feature}
                checked={form.features.includes(feature)}
                onChange={() => handleFeatureChange(feature)}
              />
            }
            label={feature.replace(/_/g, " ")}
            sx={(t) => ({ color: t.palette.text.primary })}
          />
        ))}
      </FormGroup>

      <Button
        type="submit"
        variant="contained"
    
        fullWidth
        sx={{ mt: 3 }}
      >
        Add Cafe
      </Button>
    </Box>
  );
};

export default NewCafeForm;
