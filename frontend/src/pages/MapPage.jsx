import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useCafeStore } from "../useCafeStore";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  CircularProgress,
} from "@mui/material";
import L from "leaflet";
import { muiTheme } from "../muiTheme";

const MapPage = () => {
  // Use muiTheme directly for colors

  function getIconSvg(color) {
    const svg = `<svg width="32" height="32" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.3856 23.789L11.3831 23.7871L11.3769 23.7822L11.355 23.765C11.3362 23.7501 11.3091 23.7287 11.2742 23.7008C11.2046 23.6451 11.1039 23.5637 10.9767 23.4587C10.7224 23.2488 10.3615 22.944 9.92939 22.5599C9.06662 21.793 7.91329 20.7041 6.75671 19.419C5.60303 18.1371 4.42693 16.639 3.53467 15.0528C2.64762 13.4758 2 11.7393 2 10C2 7.34784 3.05357 4.8043 4.92893 2.92893C6.8043 1.05357 9.34784 0 12 0C14.6522 0 17.1957 1.05357 19.0711 2.92893C20.9464 4.8043 22 7.34784 22 10C22 11.7393 21.3524 13.4758 20.4653 15.0528C19.5731 16.639 18.397 18.1371 17.2433 19.419C16.0867 20.7041 14.9334 21.793 14.0706 22.5599C13.6385 22.944 13.2776 23.2488 13.0233 23.4587C12.8961 23.5637 12.7954 23.6451 12.7258 23.7008C12.6909 23.7287 12.6638 23.7501 12.645 23.765L12.6231 23.7822L12.6169 23.7871L12.615 23.7885C12.615 23.7885 12.6139 23.7894 12 23L12.6139 23.7894C12.2528 24.0702 11.7467 24.0699 11.3856 23.789ZM12 23L11.3856 23.789C11.3856 23.789 11.3861 23.7894 12 23ZM15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10Z" /></svg>`;
    return encodeURIComponent(svg);
  }

  function getCategoryColor(category) {
    if (category === "thirdwave")
      return muiTheme.palette.accent?.main || muiTheme.palette.secondary.main;
    if (category === "speciality") return muiTheme.palette.primary.main;
    if (category === "roaster") return muiTheme.palette.error.main;
    return muiTheme.palette.secondary.main;
  }

  function getCustomIcon(category) {
    const color = getCategoryColor(category);
    return L.icon({
      iconUrl: "data:image/svg+xml," + getIconSvg(color),
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  }
  const cafes = useCafeStore((state) => state.cafes);
  const setCafes = useCafeStore((state) => state.setCafes);
  const searchResults = useCafeStore((state) => state.searchResults);
  const loading = cafes.length === 0;

  useEffect(() => {
    if (cafes.length === 0) {
      fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001/api"}/cafes`
      )
        .then((res) => res.json())
        .then((data) => {
          setCafes(data.data || []);
        });
    }
  }, [cafes, setCafes]);

  const cafesToShow = searchResults.length > 0 ? searchResults : cafes;

  const grouped = cafesToShow.reduce((acc, cafe) => {
    const cat = cafe.category || "Other";
    acc[cat] = acc[cat] || [];
    acc[cat].push(cafe);
    return acc;
  }, {});

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Loading map...
        </Typography>
        <Typography variant="body2">
          Please wait while we fetch the latest data.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h3" align="center" gutterBottom sx={{ mt: 2 }}>
        Stockholm's Coffee Club
      </Typography>
      {/* Map */}
      <Box sx={{ height: "50dvh", width: "100%", mb: 4 }}>
        <MapContainer
          center={[59.3293, 18.0686]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {cafesToShow.map((cafe) => {
            const coords = cafe.locations?.[0]?.coordinates?.coordinates;
            if (
              coords &&
              coords.length === 2 &&
              typeof coords[0] === "number" &&
              typeof coords[1] === "number" &&
              coords[0] !== 0 &&
              coords[1] !== 0
            ) {
              return (
                <Marker
                  key={cafe._id}
                  position={[coords[1], coords[0]]}
                  icon={getCustomIcon(cafe.category)}
                >
                  <Popup>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {cafe.name}
                    </Typography>
                    <Typography variant="body2">{cafe.category}</Typography>
                    <Typography variant="body2">{cafe.feature}</Typography>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
        </MapContainer>
      </Box>
      {/* Cards */}
      <Grid container spacing={3} sx={{ mt: 2, justifyContent: "center" }}>
        {Object.entries(grouped).map(([category, cafesInCategory]) => (
          <Grid
            key={category}
            sx={{ flex: 1, minWidth: 300, maxWidth: 400, m: 1 }}
          >
            <Typography
              variant="h5"
              align="center"
              sx={{ textTransform: "capitalize", mb: 2 }}
            >
              {category}
            </Typography>
            <Grid container spacing={2} direction="column">
              {[...cafesInCategory]
                .sort((a, b) => {
                  const hoodA = a.locations?.[0]?.neighborhood || "Unavailable";
                  const hoodB = b.locations?.[0]?.neighborhood || "Unavailable";
                  return hoodA.localeCompare(hoodB);
                })
                .map((cafe) => {
                  const hood =
                    cafe.locations?.[0]?.neighborhood || "Unavailable";
                  return (
                    <Grid key={cafe._id} sx={{ mb: 2 }}>
                      <Card variant="outlined">
                        <CardActionArea
                          component={Link}
                          to={`/cafes/${cafe._id}`}
                        >
                          <CardContent>
                            <Typography variant="h6">{cafe.name}</Typography>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              {hood}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {cafe.locations?.[0]?.address}
                            </Typography>
                            <Typography variant="body2">
                              <b>Neighborhood:</b> {hood}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {cafe.description}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  );
                })}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Styled-components

export default MapPage;
