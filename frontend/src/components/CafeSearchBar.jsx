import { useCafeStore } from "../useCafeStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const SearchBar = ({ type = "cafes" }) => {
  const searchQuery = useCafeStore((state) => state.searchQuery);
  const setSearchQuery = useCafeStore((state) => state.setSearchQuery);
  const setSearchResults = useCafeStore((state) => state.setSearchResults);

  const handleChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === "") {
      setSearchResults([]);
      return;
    }

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
      setSearchResults(results.data || results);
    } catch {
      setSearchResults([]);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder={`Search ${type === "cafes" ? "cafes" : "tastings"}...`}
        value={searchQuery}
        onChange={handleChange}
        autoComplete="on"
        role="searchbox"
        aria-label={`Search ${type}`}
      />
    </div>
  );
};

export default SearchBar;
