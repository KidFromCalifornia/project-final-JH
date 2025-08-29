import { useState } from "react";
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
  Tooltip,
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
      <Tooltip title="Show Map Legend" arrow placement="left">
        <Fab
          onClick={handleOpen}
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
      </Tooltip>

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
            maxWidth: "20rem",
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
           What does it mean?
          </Typography>
          <Tooltip title="Close Legend" arrow>
            <IconButton 
              onClick={handleClose}
              size="small"
              sx={{ color: theme.palette.text.secondary }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Here is information about how each icon is used
          </Typography>

          <List disablePadding>
            {legendItems.map((item, index) => (
              <ListItem key={index} sx={{ py: 1, px: 0 }}>
                <ListItemIcon sx={{ minWidth: "48px" }}>
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
                    <Typography caption variant="subtitle2" fontWeight="medium">
                      {item.label}
                    </Typography>
                  }
                  secondary={
                    <Typography caption variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 2, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Tip:</strong> Too many options? Use the filters in the menu to specify what you're looking for.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MapLegend;
