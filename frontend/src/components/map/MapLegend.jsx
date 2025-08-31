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
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { getCustomIcon } from './MapIcons';

const MapLegend = ({ open = false, onClose = () => {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = () => {
    onClose();
  };

  const legendItems = [
    {
      category: 'specialty',
      label: 'Specialty Coffee',
      description:
        'Coffee graded 80+ by SCA’s Coffee Value Assessment. Assessed on Bean Quality, Sensory Attributes, Market Trends, and Origin & Practices.',
    },
    {
      category: 'thirdwave',
      label: 'Third Wave Coffee',
      description:
        'Cafés focused on coffee craft and the consumer experience, offering multiple brew methods, diverse origins, and often shelves of beans and gear.',
    },
    {
      category: 'roaster',
      label: 'Coffee Roaster',
      description:
        'Businesses that source and roast green coffee themselves, with or without a café, highlighting unique flavor profiles for each coffee.',
    },
    {
      category: 'geotag',
      label: 'Found Location',
      description:
        'Using GPS to help you discover, explore, and navigate to nearby coffee spots quickly.',
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile} // Full screen on mobile
      sx={{
        zIndex: 1400, // Higher than FABs (which are at 1301)
      }}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 2 }, // No border radius on mobile
          maxHeight: { xs: '100vh', sm: '80vh' },
          maxWidth: { xs: '100vw', sm: '24rem' },
          width: '100%',
          margin: { xs: 0, sm: 'auto' }, // No margin on mobile
          padding: { xs: '0', sm: '1em' }, // No padding on mobile
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: { xs: 'nowrap', sm: 'wrap' },
          zIndex: 1400, // Ensure the dialog paper is also above FABs
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'background.paper',
          px: { xs: 2, sm: 3 }, // More padding on mobile
          pt: { xs: 2, sm: 1.5 }, // More top padding on mobile
          pb: { xs: 1, sm: 1 },
        }}
      >
        <Typography
          variant="h2"
          color={theme.palette.text.secondary}
          fontSize={theme.typography.h3.fontSize}
        >
          What does it mean?
        </Typography>
        <Tooltip title="Click to close" arrow>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{ color: theme.palette.text.secondary }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent
        sx={{
          width: '100%',
          padding: { xs: '1rem', sm: '.25rem' }, // More padding on mobile
          flex: 1, // Take up remaining space on mobile
          overflowY: 'auto', // Allow scrolling if needed
          // Hide scrollbar
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none', // IE and Edge
          'scrollbar-width': 'none', // Firefox
        }}
      >
        <List disablePadding>
          {legendItems.map((item, index) => (
            <ListItem key={index} sx={{ py: 1, px: 0 }}>
              <ListItemIcon sx={{ minWidth: '48px' }}>
                {getCustomIcon(item.category, theme, theme.palette.mode)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" fontWeight="medium" color="color.primary">
                    {item.label}
                  </Typography>
                }
                secondary={
                  <Typography caption variant="body2" color="text.primary">
                    {item.description}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 2, p: 2, bgcolor: theme.palette.primary.main, borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            <strong>Tip:</strong> Too many options? Use the filters in the menu to specify what
            you're looking for.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MapLegend;
