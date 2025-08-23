import TastingForm from "../components/TastingForm";
import { useEffect } from "react";
import { useCafeStore } from "../useCafeStore";
import { SwalAlertStyles } from "../components/SwalAlertStyles";
import { tastingAPI } from "../services/api";
import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  Button,
  Alert,
} from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const TastingsPage = () => {
  const tastings = useCafeStore((state) => state.tastings);
  const setTastings = useCafeStore((state) => state.setTastings);
  const loading = useCafeStore((state) => state.loading);
  const setLoading = useCafeStore((state) => state.setLoading);
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

  useEffect(() => {
    const fetchTastings = async () => {
      setLoading(true);
      try {
        let allTastings = [];
        if (isLoggedIn) {
          const userTastings = await tastingAPI.getUserTastings();
          allTastings = userTastings.data || [];
        } else {
          const publicTastings = await tastingAPI.getPublic();
          allTastings = publicTastings.data || [];
        }
        setTastings(allTastings);
      } catch {
        setTastings([]);
      }
      setLoading(false);
    };
    fetchTastings();
  }, [isLoggedIn, setTastings, setLoading]);

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
      } else {
        result = await tastingAPI.create(formData);
      }
      if (result.success) {
        if (editingTasting) {
          setTastings((prev) =>
            prev.map((t) => (t._id === editingTasting._id ? result.data : t))
          );
          setEditingTasting(null);
        } else {
          setTastings((prev) => [result.data, ...prev]);
        }
      } else {
        setTastings((prev) => [...prev, { _id: "error", error: result.error }]);
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

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography>Loading tastings...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tastings
      </Typography>
      <Box mb={2}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tastings by coffee, cafe, or notes..."
          style={{ width: "100%", padding: "0.5rem" }}
        />
      </Box>
      {isLoggedIn ? (
        <TastingForm
          onSubmit={handleTastingSubmit}
          initialValues={editingTasting || {}}
        />
      ) : (
        <Box textAlign="center" mt={2}>
          <Typography>Please log in to add your own experience</Typography>
        </Box>
      )}
      {filteredTastings.length === 0 ? (
        <Alert severity="info">No tastings found.</Alert>
      ) : (
        <>
          <List>
            {currentTastings.map((tasting) => (
              <ListItem
                key={tasting._id}
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  mb: 2,
                  borderBottom: "1px solid #eee",
                  pb: 2,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {tasting.coffeeName}
                </Typography>
                <Typography variant="body2">
                  at <em>{tasting.cafeId?.name}</em>
                </Typography>
                <Typography variant="body2">
                  Rating: {tasting.rating}/5
                </Typography>
                <Typography variant="body2">{tasting.notes}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {tasting.userId?.username} •{" "}
                  {new Date(tasting.createdAt).toLocaleDateString()}
                </Typography>
                {isLoggedIn && (
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ mt: 1 }}
                    onClick={() => setEditingTasting(tasting)}
                  >
                    Edit
                  </Button>
                )}
                {isLoggedIn && (
                  <Button
                    size="small"
                    color="error"
                    sx={{ mt: 1, ml: 1 }}
                    onClick={() => setDeletingTasting(tasting)}
                  >
                    Delete
                  </Button>
                )}
              </ListItem>
            ))}
          </List>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outlined"
              sx={{ mx: 2 }}
            >
              Previous
            </Button>
            <Typography sx={{ mx: 2 }}>
              Page {currentPage} of{" "}
              {Math.ceil(filteredTastings.length / tastingsPerPage)}
            </Typography>
            <Button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < Math.ceil(filteredTastings.length / tastingsPerPage)
                    ? prev + 1
                    : prev
                )
              }
              disabled={
                currentPage ===
                  Math.ceil(filteredTastings.length / tastingsPerPage) ||
                filteredTastings.length === 0
              }
              variant="outlined"
              sx={{ mx: 2 }}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default TastingsPage;
