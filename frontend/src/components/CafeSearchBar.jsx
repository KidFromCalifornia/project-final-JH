import { useCafeStore } from "../useCafeStore";
import { cafeAPI, tastingAPI } from "../services/api";
import styled from "styled-components";

const SearchBarContainer = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius};
  width: 100%;
  box-shadow: ${({ theme }) => theme.shadow};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: inset ${({ theme }) => theme.shadow};
  }
`;

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
    <>
      <SearchBarContainer
        type="text"
        placeholder={`Search ${type === "cafes" ? "cafes" : "tastings"}...`}
        value={searchQuery}
        onChange={handleChange}
        autoComplete="on"
        role="searchbox"
        aria-label={`Search ${type}`}
      />
    </>
  );
};

export default SearchBar;
