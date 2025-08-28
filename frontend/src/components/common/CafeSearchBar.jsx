import { useCafeStore } from "../../stores/useCafeStore";
import { cafeAPI, tastingAPI } from "../../services/api";
import { TextField, Box } from "@mui/material";

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
    <Box sx={{ width: "100%", mb: 2 }}>
      <TextField
        sx={{ width: "50%" }}
        id="filled-basic"
        label={`Search ${type === "cafes" ? "cafes" : "tastings"}`}
        variant="filled"
        type="text"
        value={searchQuery}
        onChange={handleChange}
        autoComplete="on"
        role="searchbox"
        aria-label={`Search ${type}`}
    
      />
    </Box>
  );
};

export default SearchBar;
