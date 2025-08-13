import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export default function TastingForm({ onSubmit }) {
  const [cafes, setCafes] = useState([]);
  const [options, setOptions] = useState({});
  const [brewMethod, setBrewMethod] = useState("");
  const [tastingNotes, setTastingNotes] = useState([]);
  const [acidity, setAcidity] = useState("");
  const [mouthFeel, setMouthFeel] = useState("");
  const [roastLevel, setRoastLevel] = useState("");
  const [rating, setRating] = useState(3);
  const [notes, setNotes] = useState("");
  const [coffeeName, setCoffeeName] = useState("");
  const [cafeId, setCafeId] = useState("");
  const [cafeNeighborhood, setCafeNeighborhood] = useState("");
  const [coffeeRoaster, setCoffeeRoaster] = useState("");
  const [coffeeOrigin, setCoffeeOrigin] = useState("");
  const [coffeeOriginRegion, setCoffeeOriginRegion] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/metadata/form-options`);
        const data = await response.json();
        setCafes(data.cafes || []);
        setOptions(data.enums || {});
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };
    fetchData();
  }, []);

  const handleTastingNotesChange = (e) => {
    const { value, checked } = e.target;
    setTastingNotes((prev) =>
      checked ? [...prev, value] : prev.filter((note) => note !== value)
    );
  };

  const handleCafeChange = (e) => {
    const selectedCafe = cafes.find((c) => c._id === e.target.value);
    setCafeId(e.target.value);
    setCafeNeighborhood(selectedCafe ? selectedCafe.neighborhood : "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      coffeeName,
      cafeId,
      cafeNeighborhood,
      coffeeRoaster,
      coffeeOrigin,
      coffeeOriginRegion,
      brewMethod,
      tastingNotes,
      acidity,
      mouthFeel,
      roastLevel,
      rating,
      notes,
      isPublic,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Coffee Name:
        <input
          type="text"
          value={coffeeName}
          onChange={(e) => setCoffeeName(e.target.value)}
          required
        />
      </label>
      <label>
        Cafe:
        <select value={cafeId} onChange={handleCafeChange} required>
          <option value="">Select Cafe</option>
          {cafes.map((cafe) => (
            <option key={cafe._id} value={cafe._id}>
              {cafe.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Coffee Roaster:
        <input
          type="text"
          value={coffeeRoaster}
          onChange={(e) => setCoffeeRoaster(e.target.value)}
        />
      </label>
      <label>
        Coffee Origin:
        <input
          type="text"
          value={coffeeOrigin}
          onChange={(e) => setCoffeeOrigin(e.target.value)}
        />
      </label>
      <label>
        Coffee Region:
        <input
          type="text"
          value={coffeeOriginRegion}
          onChange={(e) => setCoffeeOriginRegion(e.target.value)}
        />
      </label>
      <label>
        Brew Method:
        <select
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
      <label>
        Roast Level:
        <input
          type="range"
          min="0"
          max={options.roastLevel?.length ? options.roastLevel.length - 1 : 2}
          value={options.roastLevel?.indexOf(roastLevel) ?? 1}
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
              value={note}
              checked={tastingNotes.includes(note)}
              onChange={handleTastingNotesChange}
            />
            {note}
          </label>
        ))}
      </fieldset>
      <label>
        <label>
          Acidity:
          <input
            type="range"
            min="0"
            max={options.acidity?.length ? options.acidity.length - 1 : 2}
            value={options.acidity?.indexOf(acidity) ?? 1}
            onChange={(e) =>
              setAcidity(options.acidity?.[e.target.value] || "")
            }
            required
          />
          <span style={{ marginLeft: "1rem" }}>{acidity || "Select"}</span>
        </label>
      </label>
      <label>
        Mouth Feel:
        <select
          value={mouthFeel}
          onChange={(e) => setMouthFeel(e.target.value)}
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
      <label>
        Rating (1-5):
        <input
          type="range"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
        />
        <span style={{ marginLeft: "1rem" }}>{rating}</span>
      </label>
      <label>
        Notes:
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={500}
        />
      </label>
      <label>
        Public:
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
      </label>
      <button type="submit">Submit Tasting</button>
    </form>
  );
}
