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
      // Add accessibility props to improve focus management
      disableRestoreFocus
      keepMounted={false}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 2 }, // No border radius on mobile
          maxHeight: { xs: '100vh', sm: '80vh' },
          maxWidth: { xs: '100vw', sm: '28rem' },
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
          px: { xs: 2, sm: 2 }, // Reduced padding
          pt: { xs: 1.5, sm: 1 }, // Reduced top padding
          pb: { xs: 0.5, sm: 0.5 }, // Reduced bottom padding
        }}
      >
        <Typography
          variant="Subtitle1"
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
            aria-label="Close dialog"
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent
        sx={{
          width: '100%',
          padding: { xs: '0.5rem', sm: '0.25rem' }, // Reduced padding
          flex: 1, // Take up remaining space on mobile
          overflowY: 'auto', // Allow scrolling if needed
          // Hide scrollbar
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none', // IE and Edge
          scrollbarWidth: 'none', // Firefox
        }}
      >
        <List disablePadding role="list" aria-label="Map legend items">
          {legendItems.map((item, index) => (
            <ListItem
              key={index}
              sx={{ py: 0.5, px: 0 }}
              role="listitem"
              aria-label={`${item.label}: ${item.description}`}
            >
              <ListItemIcon aria-hidden="true">
                {getCustomIcon(item.category, theme, theme.palette.mode)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" fontWeight="medium" color="primary">
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

        <Box sx={{ mt: 1, p: 1, bgcolor: theme.palette.primary.main, borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            <strong>Tip:</strong> Too many options? Use the filters in the menu to specify what
            you&apos;re looking for.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MapLegend;
