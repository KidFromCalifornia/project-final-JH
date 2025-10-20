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
import { alpha } from '@mui/material/styles';

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
          maxWidth: { xs: '100vw', sm: '30rem' },
          width: '100%',
          margin: { xs: 0, sm: 'auto' }, // No margin on mobile
          padding: { xs: '0.25rem', sm: '.5rem' }, // No padding on mobile
          backgroundColor:
            theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.light.main,
          display: 'flex',
          flexDirection: 'column',
          flexWrap: { xs: 'nowrap', sm: 'nowrap' },
          zIndex: 1400, // Ensure the dialog paper is also above FABs
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          pt: { xs: 1.5, sm: 1 }, // Reduced top padding
          pb: { xs: 0.5, sm: 0.5 }, // Reduced bottom padding
        }}
      >
        <Typography
          variant="Subtitle1"
          color={theme.palette.text.secondary}
          fontSize={theme.typography.h3.fontSize}
          sx={{
            color:
              theme.palette.mode === 'dark' ? theme.palette.light.main : theme.palette.primary.main,
          }}
        >
          What does it mean?
        </Typography>
        <Tooltip title="Click to close" arrow>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color:
                theme.palette.mode === 'dark'
                  ? theme.palette.light.main
                  : theme.palette.primary.main,
            }}
            aria-label="Close dialog"
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent
        sx={{
          width: '100%',
          flex: 1, // Take up remaining space on mobile

          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none', // IE and Edge
          scrollbarWidth: 'none', // Firefox
        }}
      >
        <List colordisablePadding role="list" aria-label="Map legend items">
          {legendItems.map((item, index) => (
            <ListItem
              key={index}
              sx={{
                px: 0,
              }}
              role="listitem"
              aria-label={`${item.label}: ${item.description}`}
            >
              <ListItemIcon aria-hidden="true">
                {getCustomIcon(item.category, theme, theme.palette.mode)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle3"
                    fontWeight="550"
                    color={
                      theme.palette.mode === 'dark'
                        ? theme.palette.light.main
                        : theme.palette.primary.main
                    }
                  >
                    {item.label}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    fontSize="1rem"
                    color={
                      theme.palette.mode === 'dark'
                        ? theme.palette.light.main
                        : theme.palette.primary.main
                    }
                  >
                    {item.description}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>

        <Box
          sx={{
            p: 0.5,
            bgcolor:
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.secondary.main, 0.6)
                : alpha(theme.palette.primary.main, 0.6),
            borderRadius: 1,
          }}
        >
          <Typography
            variant="caption"
            fontSize="1rem"
            fontWeight={550}
            color={theme.palette.mode === 'dark' ? 'light.main' : 'light.main'}
          >
            <strong>Tip:</strong> Too many options? Use the filters in the menu to specify what
            you&apos;re looking for.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MapLegend;
