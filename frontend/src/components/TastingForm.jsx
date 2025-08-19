import { useState, useEffect } from "react";
import { useCafeStore } from "../useCafeStore";
import { apiCall } from "../services/api";
import { SwalAlertStyles } from "./SwalAlertStyles";

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
      <label htmlFor="coffeeName">
        Coffee Name:
        <input
          type="text"
          id="coffeeName"
          name="coffeeName"
          value={form.coffeeName}
          onChange={handleChange}
          required
        />
      </label>
      <label htmlFor="cafeId">
        Where did you taste this coffee?:
        <select
          id="cafeId"
          name="cafeId"
          value={cafeId}
          onChange={handleCafeChange}
          required
        >
          <option value="">Select Cafe</option>
          {cafes.map((cafe) => (
            <option key={cafe._id} value={cafe._id}>
              {cafe.name}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="coffeeRoaster">
        Coffee Roaster:
        <input
          type="text"
          id="coffeeRoaster"
          name="coffeeRoaster"
          value={coffeeRoaster}
          onChange={(e) => setCoffeeRoaster(e.target.value)}
        />
      </label>
      <label htmlFor="coffeeOrigin">
        Coffee Origin:
        <input
          type="text"
          id="coffeeOrigin"
          name="coffeeOrigin"
          value={coffeeOrigin}
          onChange={(e) => setCoffeeOrigin(e.target.value)}
        />
      </label>
      <label htmlFor="coffeeOriginRegion">
        Coffee Region:
        <input
          type="text"
          id="coffeeOriginRegion"
          name="coffeeOriginRegion"
          value={coffeeOriginRegion}
          onChange={(e) => setCoffeeOriginRegion(e.target.value)}
        />
      </label>
      <label htmlFor="brewMethod">
        Brew Method:
        <select
          id="brewMethod"
          name="brewMethod"
          value={brewMethod}
          onChange={(e) => setBrewMethod(e.target.value)}
          required
        >
          <option value="">Select</option>
          {options.brewMethod?.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="roastLevel">
        Roast Level:
        <input
          type="range"
          id="roastLevel"
          name="roastLevel"
          min="0"
          max={options.roastLevel?.length ? options.roastLevel.length - 1 : 2}
          value={Math.max(options.roastLevel?.indexOf(roastLevel) ?? 0, 0)}
          onChange={(e) =>
            setRoastLevel(options.roastLevel?.[e.target.value] || "")
          }
          required
        />
        <span style={{ marginLeft: "1rem" }}>{roastLevel || "Select"}</span>
      </label>
      <fieldset>
        <legend>Tasting Notes (choose multiple):</legend>
        {(options.tastingNotes || []).map((note) => (
          <label key={note}>
            <input
              type="checkbox"
              name="tastingNotes"
              value={note}
              checked={tastingNotes.includes(note)}
              onChange={handleTastingNotesChange}
            />
            {note}
          </label>
        ))}
      </fieldset>
      <label htmlFor="cafeId">
        Where did you taste this coffee?:
        <select
          id="cafeId"
          name="cafeId"
          value={form.cafeId}
          onChange={handleCafeChange}
          required
        >
          <option value="">Select a cafe</option>
          {cafes.map((cafe) => (
            <option key={cafe._id} value={cafe._id}>
              {cafe.name}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="mouthFeel">
        Mouth Feel:
        <select
          id="mouthFeel"
          name="mouthFeel"
          value={form.mouthFeel}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          {options.mouthFeel?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="rating">
        Rating (1-5):
        <input
          type="range"
          id="rating"
          name="rating"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
        />
        <span style={{ marginLeft: "1rem" }}>{rating}</span>
      </label>
      <label labelhtmlFor="notes">
        Notes:
        <textarea
          id="notes"
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={500}
          placeholder="Additional notes about the tasting"
        />
      </label>
      <label htmlFor="isPublic">
        Public:
        <input
          type="checkbox"
          id="isPublic"
          name="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
      </label>
      <button
        style={{
          marginTop: "1rem",
          backgroundColor: "#170351",
          color: "#fff",
          padding: "0.5rem 1rem",
          border: "none",
          cursor: "pointer",
        }}
        type="submit"
        disabled={!cafeId || !coffeeName || !brewMethod || !roastLevel}
      >
        Submit
      </button>
    </form>
  );
};

export default TastingForm;
