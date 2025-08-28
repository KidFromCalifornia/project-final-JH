import TastingForm from "../components/TastingForm";
import { useEffect } from "react";
import { useCafeStore } from "../useCafeStore";
import {
  Container,
  Box,
  Typography,
  Button,
  Alert,
  Grid,
  Tooltip,
  useTheme,
  Paper,
} from "@mui/material";
import CafeSearchBar from "../components/CafeSearchBar";
import FlipTastingCard from "../components/FlipTastingCard";
import { tastingAPI } from "../services/api";

const TastingsPage = () => {
  const tastings = useCafeStore((state) => state.tastings);
  const setTastings = useCafeStore((state) => state.setTastings);
  const editingTasting = useCafeStore((state) => state.editingTasting);
  const setEditingTasting = useCafeStore((state) => state.setEditingTasting);
  const deletingTasting = useCafeStore((state) => state.deletingTasting);
  const setDeletingTasting = useCafeStore((state) => state.setDeletingTasting);
  const searchQuery = useCafeStore((state) => state.searchQuery);
  const setSearchQuery = useCafeStore((state) => state.setSearchQuery);
  const currentPage = useCafeStore((state) => state.currentPage);
  const setCurrentPage = useCafeStore((state) => state.setCurrentPage);
  const tastingsPerPage = useCafeStore((state) => state.tastingsPerPage);
  const isLoggedIn = useCafeStore((state) => state.isLoggedIn);
  const theme = useTheme();
  const fetchTastings = useCafeStore((state) => state.fetchTastings);
  useEffect(() => {
    fetchTastings(isLoggedIn);
  }, [isLoggedIn, fetchTastings]);
  useEffect(() => {
    const deleteTasting = async () => {
      if (!deletingTasting) return;
      try {
        const result = await tastingAPI.delete(deletingTasting._id);
        if (result.success) {
          setTastings((prev) =>
            prev.filter((t) => t._id !== deletingTasting._id)
          );
        } else {
          setTastings((prev) => [
            ...prev,
            { _id: "error", error: result.error },
          ]);
        }
      } catch (error) {
        setTastings((prev) => [
          ...prev,
          { _id: "error", error: error.message },
        ]);
      }
      setDeletingTasting(null);
    };
    deleteTasting();
  }, [deletingTasting, setTastings, setDeletingTasting]);

  const handleTastingSubmit = async (formData) => {
    try {
      let result;
      if (editingTasting) {
        result = await tastingAPI.update(editingTasting._id, formData);
        if (result.success) {
          setTastings((prev) =>
            prev.map((t) => (t._id === editingTasting._id ? result.data : t))
          );
          setEditingTasting(null);
        } else {
          setTastings((prev) => [
            ...prev,
            { _id: "error", error: result.error },
          ]);
        }
      } else {
        result = await tastingAPI.create(formData);
        if (result.success) {
          setTastings((prev) => [result.data, ...prev]);
        } else {
          setTastings((prev) => [
            ...prev,
            { _id: "error", error: result.error },
          ]);
        }
      }
    } catch (error) {
      setTastings((prev) => [...prev, { _id: "error", error: error.message }]);
    }
  };

  const normalize = (str) =>
    String(str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filteredTastings = tastings.filter((tasting) => {
    if (!tasting) return false;
    const query = normalize(searchQuery);

    // Flatten all tasting fields into a single string for searching
    const allFields = Object.values(tasting)
      .map((value) => {
        if (typeof value === "object" && value !== null) {
          // For nested objects, include their values too
          return Object.values(value).map(normalize).join(" ");
        }
        return normalize(value);
      })
      .join(" ");

    return allFields.includes(query);
  });

  // Pagination logic
  const indexOfLastTasting = currentPage * tastingsPerPage;
  const indexOfFirstTasting = indexOfLastTasting - tastingsPerPage;
  const currentTastings = filteredTastings.slice(
    indexOfFirstTasting,
    indexOfLastTasting
  );
  const totalPages = Math.ceil(filteredTastings.length / tastingsPerPage);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h1" hidden gutterBottom>
        Coffee Tasting Page
      </Typography>
      {isLoggedIn ? (
        <TastingForm
          onSubmit={handleTastingSubmit}
          initialValues={editingTasting || {}}
        />
      ) : (
        <Box sx={{ textAlign: "center" }} mt={2}>
          <Typography variant="h2">
            Please log in to add your own experience
          </Typography>
        </Box>
      )}
      <CafeSearchBar setSearchQuery={setSearchQuery} type="tastings" />
      {filteredTastings.length === 0 ? (
        <Alert severity="info">No tastings found.</Alert>
      ) : (
        <>
          <Grid
            xs={12}
            sm={6}
            md={4}
            container
            spacing={3}
            justifyContent="center"
            alignItems="stretch"
          >
            {currentTastings.length === 0 ? (
              <Typography
                variant="body2"
                color="themetext.secondary"
                sx={{ mt: 2 }}
              >
                No tasting cards to display.
              </Typography>
            ) : (
              currentTastings.map((tasting) => (
                <Grid item key={tasting._id} xs={12} sm={6} md={4}>
                  <FlipTastingCard
                    tasting={tasting}
                    isLoggedIn={isLoggedIn}
                    setEditingTasting={setEditingTasting}
                    setDeletingTasting={setDeletingTasting}
                  />
                </Grid>
              ))
            )}
          </Grid>
          <Box display="flex" padding={2} justifyContent="center" mt={2}>
            <Tooltip title="Go to previous page" arrow>
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outlined"
                sx={{ mx: 2 }}
              >
                Previous
              </Button>
            </Tooltip>
            <Typography sx={{ mx: 2 }}>
              Page {currentPage} of {totalPages}
            </Typography>
            <Tooltip title="Go to next page" arrow>
              <Button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < totalPages ? prev + 1 : prev
                  )
                }
                disabled={
                  currentPage === totalPages || filteredTastings.length === 0
                }
                variant="outlined"
                sx={{ mx: 2 }}
              >
                Next
              </Button>
            </Tooltip>
          </Box>
        </>
      )}
    </Container>
  );
};

export default TastingsPage;
