import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

/**
 * @param {function} onResults - callback for search results
 * @param {function} setQuery - callback for query string
 * @param {'cafes'|'tastings'} type - what to search (default: 'cafes')
 */
const SearchBar = ({ onResults, setQuery, type = "cafes" }) => {
  const [query, setLocalQuery] = useState("");

  const handleChange = async (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    setQuery && setQuery(value);

    if (value.trim() === "") {
      onResults([]);
      return;
    }

    // Choose endpoint based on type
    let endpoint = "";
    if (type === "cafes") {
      endpoint = `/cafes?search=${encodeURIComponent(value)}`;
    } else if (type === "tastings") {
      endpoint = `/tastings/public/search?query=${encodeURIComponent(value)}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const results = await response.json();
      if (!response.ok) throw new Error("Failed to fetch search results");
      // For tastings, use results.data; for cafes, use results.data or results
      onResults(results.data || results);
    } catch {
      onResults([]);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder={`Search ${type === "cafes" ? "cafes" : "tastings"}...`}
        value={query}
        onChange={handleChange}
        autoComplete="on"
        role="searchbox"
        aria-label={`Search ${type}`}
      />
    </div>
  );
};

export default SearchBar;
