import React, { useState } from "react";
import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Fab,
} from "@mui/material";
import {
  Info as InfoIcon,
  Close as CloseIcon,
  MyLocation as MyLocationIcon,
} from "@mui/icons-material";
import { getCustomIcon } from "./MapIcons";

const MapLegend = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const legendItems = [
    {
      category: "specialty",
      label: "Specialty Coffee",
      description: "High-quality, artisanal coffee shops",
    },
    {
      category: "thirdwave",
      label: "Third Wave Coffee",
      description: "Coffee treated as artisanal craft, focus on origin and brewing methods",
    },
    {
      category: "roaster",
      label: "Coffee Roaster",
      description: "Coffee roasting facilities and roaster cafes",
    },
    {
      category: "default",
      label: "General Cafe",
      description: "Standard coffee shops and cafes",
    },
    {
      category: "geotag",
      label: "Your Location",
      description: "Your current GPS location",
      isUserLocation: true,
    },
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* Legend FAB Button */}
      <Fab
        onClick={handleOpen}
        onClose={handleClose}
        sx={{
          position: "fixed",
          zIndex: 1301,
          width: 56,
          height: 56,
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.light.main,
          boxShadow: 3,
          border: `1px solid ${theme.palette.divider}`,
          bottom: { xs: 110, sm: "auto" }, // Above mobile nav
          left: { xs: "50%", sm: "auto" },
          transform: { xs: "translateX(-50%)", sm: "none" },
          top: { xs: "auto", sm: 140 }, // Below geotag button on desktop
          right: { xs: "auto", sm: 30 },
          "&:hover": {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.accentStrong.main,
          },
        }}
        aria-label="Show map legend"
      >
        <InfoIcon fontSize="large" />
      </Fab>

      {/* Legend Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: "80vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography variant="h6" component="h2">
            Map Legend
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{ color: theme.palette.text.secondary }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Different icons represent different types of coffee establishments:
          </Typography>

          <List disablePadding>
            {legendItems.map((item, index) => (
              <ListItem key={index} sx={{ py: 1, px: 0 }}>
                <ListItemIcon sx={{ minWidth: "20rem" }}>
                  {item.isUserLocation ? (
                    <MyLocationIcon
                      sx={{
                        fontSize: 32,
                        color: theme.palette.success.main,
                      }}
                    />
                  ) : (
                    getCustomIcon(item.category, theme, theme.palette.mode)
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight="medium">
                      {item.label}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 2, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Tip:</strong> Use the filters in the navigation to show only specific types of coffee establishments.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MapLegend;
