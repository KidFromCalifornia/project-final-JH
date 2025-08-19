import { useCafeStore } from "../useCafeStore";
import { cafeAPI, tastingAPI } from "../services/api";

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

    try {
      let results;
      if (type === "cafes") {
        results = await cafeAPI.getAll(value);
      } else if (type === "tastings") {
        results = await tastingAPI.search(value);
      }
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
