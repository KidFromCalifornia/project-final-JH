import React, { useState } from "react";
import { cafeAPI } from "../services/api";
import { SwalAlertStyles } from "./SwalAlertStyles";
import {
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";

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
        setStatus(result.error || "Error adding cafe.");
      }
    } catch {
      setStatus("Network error.");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{
          margin: "0.5rem",
          position: "fixed",
          backgroundColor: "white",
          padding: "1rem",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          maxWidth: "300px",
          top: "0",
          right: "0",
          color: "#170351",
        }}
      >
        <button
          type="button"
          aria-label="Close login form"
          onClick={onClose}
          style={{
            float: "right",
            cursor: "pointer",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
          }}
        >
          ×
        </button>
        <h2>Suggest a Cafe</h2>
        {status && (
          <SwalAlertStyles
            message={status}
            type={status.includes("error") ? "error" : "success"}
          />
        )}
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Website"
          name="website"
          value={form.website}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          inputProps={{ maxLength: 1000 }}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              fullWidth
              displayEmpty
            >
              <MenuItem value="">Select Category</MenuItem>
              {CATEGORY_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </MenuItem>
              ))}
            </Select>
          }
          label="Category"
        />

        <fieldset hidden>
          <legend>Images</legend>
          {form.images.map((img, idx) => (
            <div key={idx}>
              <input
                type="text"
                value={img}
                onChange={(e) => handleImageChange(e, idx)}
                placeholder="Image URL"
              />
            </div>
          ))}
        </fieldset>
        <fieldset>
          <legend>Location</legend>
          {form.locations.map((loc, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #eee",
                marginBottom: "1rem",
                padding: "1rem",
                position: "relative",
              }}
            >
              <TextField
                label="Address"
                name="address"
                value={loc.address}
                onChange={(e) => handleLocationChange(e, idx)}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                label="Neighborhood"
                name="neighborhood"
                value={loc.neighborhood}
                onChange={(e) => handleLocationChange(e, idx)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Location Note"
                name="locationNote"
                value={loc.locationNote}
                onChange={(e) => handleLocationChange(e, idx)}
                fullWidth
                margin="normal"
              />

              {form.locations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLocation(idx)}
                  style={{
                    position: "absolute",
                    top: "0.5rem",
                    right: "0.5rem",
                    background: "#eee",
                    border: "none",
                    borderRadius: "50%",
                    width: "2rem",
                    height: "2rem",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  aria-label="Remove this location"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addLocation}
            style={{ marginTop: "0.5rem" }}
          >
            Add Another Location
          </button>
        </fieldset>
        <fieldset>
          <legend>Features</legend>
          {FEATURE_OPTIONS.map((feature) => (
            <FormControlLabel
              key={feature}
              control={
                <Checkbox
                  name={feature}
                  checked={form.features.includes(feature)}
                  onChange={() => handleFeatureChange(feature)}
                />
              }
              label={feature.replace(/_/g, " ")}
            />
          ))}
        </fieldset>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Add Cafe
        </Button>
        {status && <p>{status}</p>}
      </form>
    </>
  );
};

export default NewCafeForm;
