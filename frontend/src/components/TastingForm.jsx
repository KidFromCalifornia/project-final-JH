import { styled } from "@mui/material/styles";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});
import { useState, useEffect } from "react";
import { useCafeStore } from "../useCafeStore";
import { apiCall } from "../services/api";
import { SwalAlertStyles } from "./SwalAlertStyles";
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
} from "@mui/material";
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
  const user = useCafeStore((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiCall("/metadata/form-options");
        setCafes(data.cafes || []);
        setOptions(data.enums || {});
      } catch (error) {
        console.error("Error fetching metadata:", error);
        setFetchError("Failed to load metadata");
      }
    };
    // Only fetch if cafes are not already loaded
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.tastingNotes.length === 0) {
      setFetchError("Please select at least one tasting note.");
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      {fetchError && <SwalAlertStyles message={fetchError} type="error" />}
      <TextField
        label="Coffee Name"
        name="coffeeName"
        value={form.coffeeName}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />
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
      <TextField
        label="Coffee Roaster"
        name="coffeeRoaster"
        value={form.coffeeRoaster}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Coffee Origin"
        name="coffeeOrigin"
        value={form.coffeeOrigin}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Coffee Region"
        name="coffeeOriginRegion"
        value={form.coffeeOriginRegion}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
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
      <FormControl fullWidth margin="normal">
        <FormLabel>Roast Level</FormLabel>
        <TextField
          type="range"
          name="roastLevel"
          min={0}
          max={options.roastLevel?.length ? options.roastLevel.length - 1 : 2}
          value={Math.max(options.roastLevel?.indexOf(form.roastLevel) ?? 0, 0)}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              roastLevel: options.roastLevel?.[e.target.value] || "",
            }))
          }
          required
        />
        <FormHelperText>{form.roastLevel || "Select"}</FormHelperText>
      </FormControl>
      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">
          Tasting Notes (choose multiple):
        </FormLabel>
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
            />
          ))}
        </FormGroup>
      </FormControl>
      {/* Duplicate cafe select removed, handled above with MUI TextField */}

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
      <FormControl fullWidth margin="normal">
        <FormLabel component="legend">Custom icon and color</FormLabel>
        <Rating
          name="rating"
          value={form.rating}
          precision={0.5}
          icon={<FavoriteIcon fontSize="inherit" />}
          emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
          onChange={(e, value) =>
            setForm((prev) => ({ ...prev, rating: value }))
          }
        />
        <FormHelperText>
          {form.rating ? `${form.rating} Hearts` : "Select rating"}
        </FormHelperText>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <FormLabel component="legend">10 stars</FormLabel>
        <Rating
          name="customized-10"
          value={form.rating}
          max={10}
          onChange={(e, value) =>
            setForm((prev) => ({ ...prev, rating: value }))
          }
        />
        <FormHelperText>
          {form.rating ? `${form.rating} Stars` : "Select rating"}
        </FormHelperText>
      </FormControl>
      <TextField
        label="Notes"
        name="notes"
        value={form.notes}
        onChange={handleChange}
        multiline
        rows={3}
        fullWidth
        margin="normal"
        inputProps={{ maxLength: 500 }}
        placeholder="Additional notes about the tasting"
      />
      <FormControlLabel
        control={
          <Checkbox
            id="isPublic"
            name="isPublic"
            checked={form.isPublic}
            onChange={handleChange}
          />
        }
        label="Public"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={
          !form.cafeId ||
          !form.coffeeName ||
          !form.brewMethod ||
          !form.roastLevel
        }
      >
        Submit
      </Button>
    </form>
  );
};

export default TastingForm;
