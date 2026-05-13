import { useState } from 'react';
import { apiCall } from '../../services/api';
import { useAlert } from '../../context/AlertContext';
import { handleApiError } from '../../utils/errorHandler';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';

const SuggestionForm = ({ onClose }) => {
  const { showSnackbar } = useAlert();
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

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
      locations: [{ address: 'suggestion', neighborhood: '', isMainLocation: true }],
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
    <Paper elevation={6} sx={{ width: '100%', maxWidth: 560, mx: 'auto', p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
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
          placeholder="Tell us the cafe name, where it is, and why you love it…"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (error) setError('');
          }}
          error={!!error}
          helperText={error}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          {onClose && (
            <Button onClick={onClose} size="large" sx={{ minWidth: '8rem', fontWeight: 600 }}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="contained" size="large" sx={{ minWidth: '10rem', fontWeight: 600 }}>
            Send Suggestion
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default SuggestionForm;
