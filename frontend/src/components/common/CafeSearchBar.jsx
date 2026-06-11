import { useCafeStore } from '../../stores/useCafeStore';
import { cafeAPI, tastingAPI } from '../../services/api';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ type = 'cafes' }) => {
  const searchQuery = useCafeStore((state) => state.searchQuery);
  const setSearchQuery = useCafeStore((state) => state.setSearchQuery);
  const setSearchResults = useCafeStore((state) => state.setSearchResults);

  const handleChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      let results;
      if (type === 'cafes') {
        results = await cafeAPI.getAll(value);
      } else if (type === 'tastings') {
        results = await tastingAPI.search(value);
      }
      setSearchResults(results.data || results);
    } catch {
      setSearchResults([]);
    }
  };

  return (
    <TextField
      id="search-field"
      label={`Search ${type}…`}
      variant="outlined"
      type="text"
      value={searchQuery}
      onChange={handleChange}
      autoComplete="on"
      role="searchbox"
      aria-label={`Search ${type}`}
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
      }}
      sx={{ minWidth: 220 }}
    />
  );
};

export default SearchBar;
