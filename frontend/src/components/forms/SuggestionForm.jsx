import { useState } from 'react';
import { apiCall } from '../../services/api';
import { useAlert } from '../../context/AlertContext';
import { handleApiError } from '../../utils/errorHandler';
import {
  TextField, Button, Typography, Box, Paper,
  Accordion, AccordionSummary, AccordionDetails,
  FormGroup, FormControlLabel, Checkbox,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FEATURES } from '../admin/CafeEditForm';

const formatFeature = (f) => f.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const SuggestionForm = ({ onClose, prefill = '' }) => {
  const { showSnackbar } = useAlert();
  const [description, setDescription] = useState(prefill);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [error, setError] = useState('');

  const toggleFeature = (feature, checked) => {
    setSelectedFeatures((prev) =>
      checked ? [...prev, feature] : prev.filter((f) => f !== feature)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please enter your suggestion');
      return;
    }

    const payload = {
      name: 'suggestion',
      category: 'specialty',
      description: description.trim(),
      website: 'suggestion',
      hasMultipleLocations: false,
      locations: [{ address: 'suggestion', neighborhood: '', isMainLocation: true, features: selectedFeatures }],
      isApproved: false,
    };

    try {
      await apiCall('/cafes', { method: 'POST', body: JSON.stringify(payload) });
      showSnackbar('Thanks for your suggestion!', 'success');
      onClose?.();
    } catch (err) {
      handleApiError(err, showSnackbar, 'Failed to submit suggestion. Please try again.');
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{ width: '100%', maxWidth: 560, mx: 'auto', p: { xs: 2, sm: 3 }, borderRadius: 2 }}
    >
      <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ mb: 2 }}>
        Make a Suggestion
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Did we miss something, is something wrong? Let us know.
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          multiline
          rows={5}
          fullWidth
          label="Your suggestion *"
          placeholder="Let us know if anything is out of date or what features are missing"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (error) setError('');
          }}
          error={!!error}
          helperText={error}
          sx={{ mb: 2 }}
        />

        <Accordion disableGutters elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 3, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" fontWeight={600}>
              Features {selectedFeatures.length > 0 ? `(${selectedFeatures.length} selected)` : '(optional)'}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup row>
              {FEATURES.map((feature) => (
                <FormControlLabel
                  key={feature}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedFeatures.includes(feature)}
                      onChange={(e) => toggleFeature(feature, e.target.checked)}
                    />
                  }
                  label={<Typography variant="body2">{formatFeature(feature)}</Typography>}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          {onClose && (
            <Button onClick={onClose} size="large" sx={{ minWidth: '8rem', fontWeight: 600 }}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ minWidth: '10rem', fontWeight: 600 }}
          >
            Send
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default SuggestionForm;
