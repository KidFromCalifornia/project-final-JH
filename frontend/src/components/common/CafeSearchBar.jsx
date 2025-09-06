import { useCafeStore } from '../../stores/useCafeStore';
import { cafeAPI, tastingAPI } from '../../services/api';
import { TextField, Box, useTheme } from '@mui/material';

const SearchBar = ({ type = 'cafes' }) => {
  const theme = useTheme();
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
    <>
      <TextField
        id="outlined-basic"
        label={`Search ${type}...`}
        variant="outlined"
        type="text"
        placeholder={`Search ${type}...`}
        value={searchQuery}
        onChange={handleChange}
        autoComplete="on"
        role="searchbox"
        aria-label={`Search ${type}`}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor:
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            '& fieldset': {
              borderColor: theme.palette.primary.main,
            },
            '&:hover fieldset': {
              borderColor: theme.palette.primary.dark,
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
            },
          },
          '& .MuiOutlinedInput-input': {
            color: theme.palette.text.primary,
            '&::placeholder': {
              color: theme.palette.text.primary,
              opacity: 0.7,
            },
          },
          '& .MuiInputLabel-root': {
            color: theme.palette.text.primary,
            '&.Mui-focused': {
              color: theme.palette.primary.main,
            },
          },
        }}
      />
    </>
  );
};

export default SearchBar;
