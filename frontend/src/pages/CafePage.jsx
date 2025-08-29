import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cafeAPI } from "../services/api";
import { useCafeStore } from "../stores/useCafeStore";
import { showAlert } from "../styles/SwalAlertStyles";
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
        setLoading(false);
        // Only show sweet alert if server is completely down (network error)
        if (err.code === 'NETWORK_ERROR' || err.message?.includes('fetch') || !err.response) {
          showAlert({
            title: "Server Unavailable",
            text: "We couldn't reach the server. Please try again later.",
            icon: "error",
          });
        } else {
          // For other errors, use inline error display
          setError("We couldn't load this cafe. Please try again.");
        }
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
        
        {/* Multiple Locations Display */}
        {cafe.hasMultipleLocations && cafe.locations?.length > 1 ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Locations:
            </Typography>
            {cafe.locations.map((location, index) => (
              <Box key={index} sx={{ mb: 1, pl: 1, borderLeft: '2px solid', borderLeftColor: 'primary.main' }}>
                {location.locationNote && (
                  <Typography variant="subtitle2" color="primary" fontWeight="500">
                    {location.locationNote}
                  </Typography>
                )}
                <Typography variant="body1">
                  {location.address}
                </Typography>
                {location.neighborhood && (
                  <Typography variant="body2" color="text.secondary">
                    {location.neighborhood}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body1" gutterBottom>
            {cafe.locations?.[0]?.address}
          </Typography>
        )}
        
        <Typography variant="body2" sx={{ mb: 2 }}>
          {cafe.description}
        </Typography>
        <Typography variant="body2">
          {cafe.features?.join(", ")}
        </Typography>
      </Paper>
    </Box>
  );
};

export default CafePage;
