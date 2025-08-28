import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cafeAPI } from "../services/api";
import { useCafeStore } from "../useCafeStore";
import { showAlert } from "../components/SwalAlertStyles";
import { Box, Typography, Paper, Alert, CircularProgress } from "@mui/material";

const CafePage = () => {
  const { cafeId } = useParams();
  const [cafe, setCafe] = useState(null);
  const loading = useCafeStore((state) => state.loading);
  const setLoading = useCafeStore((state) => state.setLoading);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cafeId) return;
    setLoading(true);
    cafeAPI
      .getById(cafeId)
      .then((data) => {
        setCafe(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(null);
        showAlert({
          title: "We couldn't load this cafe",
          text: "We couldn't reach the server. Please try again.",
          icon: "error",
        });
        setLoading(false);
      });
  }, [cafeId, setLoading]);

  if (loading)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Loading cafe...
        </Typography>
      </Box>
    );
  if (error)
    return (
      <Box textAlign="center" mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  if (!cafe)
    return (
      <Box textAlign="center" mt={4}>
        <Alert severity="info">No cafe found.</Alert>
      </Box>
    );

  return (
    <Box maxWidth="sm" mx="auto" mt={4}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {cafe.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {cafe.address}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {cafe.description}
        </Typography>
        <Typography variant="body2" color="primary">
          {cafe.features?.join(", ")}
        </Typography>
      </Paper>
    </Box>
  );
};

export default CafePage;
