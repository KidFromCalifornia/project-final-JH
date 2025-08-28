import { useState } from "react";
import { useTheme } from "@mui/material/styles";

import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";

function FlipTastingCard({
  tasting,
  isLoggedIn,
  setEditingTasting,
  setDeletingTasting,
  themeMode,
}) {
  const [flipped, setFlipped] = useState(false);
  const theme = useTheme();
  const gradientFront = `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.primary.main} 100%)`;
  const gradientBack = `linear-gradient(135deg, ${
    theme.palette.secondary.main
  } 0%, ${
    theme.palette.light?.main ||
    theme.palette.primary.light ||
    theme.palette.primary.main
  } 100%)`;

  return (
    <Box
      sx={{
        perspective: 1000,
        cursor: "pointer",
        mb: 2,
        minWidth: 300,
        minHeight: 275,
        position: "relative",
      }}
      onClick={() => setFlipped((prev) => !prev)}
    >
      <Tooltip
        title={flipped ? "Show tasting details" : "Flip for more info"}
        arrow
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            transition: "transform 0.6s",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "none",
          }}
        >
          {/* Front Side */}
          <Card
            sx={{
              width: "100%",
              minHeight: 320,
              backfaceVisibility: "hidden",
              background: gradientFront,
              boxShadow: theme.shadows[4],
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: theme.shape.borderRadius,
              m: 1,
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 2,
              overflow: "hidden",
              p: 0,
            }}
          >
            {/* Centered coffee name and notes */}
            <Box
              sx={{
                flex: 1,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                px: 2,
                py: 4,
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  mb: 2,
                  color: theme.palette.text.primary,
                  textShadow: `0 2px 8px ${theme.palette.secondary.main}`,
                }}
              >
                {tasting.coffeeName}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  color: theme.palette.text.primary,
                  textAlign: "center",
                  textShadow: `0 1px 6px ${theme.palette.primary.main}`,
                }}
              >
                {tasting.notes}
              </Typography>
            </Box>
            {/* Bottom info box */}
            <Box
              sx={{
                boxShadow: "inset theme.shadow.main ",
                width: "100%",
                bgcolor:
                  themeMode === "dark"
                    ? theme.colors?.background || theme.palette.background.paper
                    : "rgba(255,255,255,0.85)",
                py: theme.spacing(3),
                px: theme.spacing(2),
                display: "flex",
                alignItems: "center",
                alignContent: "Center",
                justifyContent: "space-between",
                borderTop: `1.5px solid ${
                  theme.colors?.secondary || theme.palette.secondary.main
                }`,
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
              >
                {tasting.userId?.username || "Unknown User"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: theme.palette.secondary.main }}
              >
                {new Date(tasting.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Card>
          {/* Back Side */}
          <Card
            sx={{
              width: "100%",
              minHeight: 275,
              minWidth: 300,
              backfaceVisibility: "hidden",
              background: gradientBack,
              boxShadow: theme.shadows[3],
              transform: "rotateY(180deg)",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: theme.shape.borderRadius,
              m: 1,
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {tasting.coffeeName}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Cafe:</strong> {tasting.cafeId?.name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Rating:</strong> {tasting.rating}/5
              </Typography>
              {Array.isArray(tasting.features) &&
                tasting.features.length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      Features:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {tasting.features.map((feature, idx) => (
                        <li key={idx} style={{ fontSize: "0.95em" }}>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}
              {Array.isArray(tasting.images) && tasting.images.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    Images:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {tasting.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Tasting"
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: 2,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              <Typography variant="caption" color="text.secondary">
                {tasting.userId?.username} •{" "}
                {new Date(tasting.createdAt).toLocaleDateString()}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              {isLoggedIn && (
                <Tooltip title="Edit tasting" arrow>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTasting(tasting);
                    }}
                  >
                    Edit
                  </Button>
                </Tooltip>
              )}
              {isLoggedIn && (
                <Tooltip title="Delete tasting" arrow>
                  <Button
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingTasting(tasting);
                    }}
                  >
                    Delete
                  </Button>
                </Tooltip>
              )}
            </CardActions>
          </Card>
        </Box>
      </Tooltip>
    </Box>
  );
}
export default FlipTastingCard;
