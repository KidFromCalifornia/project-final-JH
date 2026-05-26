import {
  Box,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';

export const NEIGHBORHOODS = [
  'Bromma',
  'Enskede-Årsta-Vantör',
  'Hägersten',
  'Kungsholmen',
  'Lidingö',
  'Nacka',
  'Norrmalm',
  'Södermalm',
  'Vasastan',
  'Östermalm',
];

export const FEATURES = [
  'outdoor_seating', 'wheelchair_accessible', 'lunch', 'pour_over', 'takeaway',
  'vegan_options', 'breakfast', 'iced_drinks', 'pastries', 'multi_roaster',
  'decaf', 'no_coffee_bar', 'limited_sitting', 'roaster_only',
];

const updateLocation = (editData, setEditData, index, field, value) => {
  const locations = editData.locations ? [...editData.locations] : [{}];
  locations[index] = { ...locations[index], [field]: value };
  setEditData({ ...editData, locations });
};

const addLocation = (editData, setEditData) => {
  const locations = [...(editData.locations || []), { address: '', neighborhood: '', locationNote: '', isMainLocation: false }];
  setEditData({ ...editData, locations, hasMultipleLocations: true });
};

const removeLocation = (editData, setEditData, index) => {
  const locations = editData.locations.filter((_, i) => i !== index);
  setEditData({ ...editData, locations, hasMultipleLocations: locations.length > 1 });
};

const LocationFields = ({ editData, setEditData, index }) => {
  const loc = editData.locations?.[index] || {};
  return (
    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" fontWeight={600}>Location {index + 1}</Typography>
        {index > 0 && (
          <Button size="small" color="error" onClick={() => removeLocation(editData, setEditData, index)}>
            Remove
          </Button>
        )}
      </Box>
      <Stack spacing={2}>
        <TextField variant="filled" fullWidth label="Address" value={loc.address || ''}
          onChange={(e) => updateLocation(editData, setEditData, index, 'address', e.target.value)} />
        <TextField variant="filled" select fullWidth label="Neighbourhood" value={loc.neighborhood || ''}
          onChange={(e) => updateLocation(editData, setEditData, index, 'neighborhood', e.target.value)}>
          <MenuItem value="">— None —</MenuItem>
          {NEIGHBORHOODS.map((n) => <MenuItem key={n} value={n}>{n}</MenuItem>)}
        </TextField>
        <TextField variant="filled" fullWidth label="Location Note" placeholder="e.g. Second floor, ring the bell"
          value={loc.locationNote || ''}
          onChange={(e) => updateLocation(editData, setEditData, index, 'locationNote', e.target.value)} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField variant="filled" fullWidth label="Latitude" placeholder="59.3293"
            inputProps={{ inputMode: 'decimal' }}
            value={loc.coordinates?.coordinates?.[1] ?? ''}
            onChange={(e) => {
              const lat = parseFloat(e.target.value);
              const lng = loc.coordinates?.coordinates?.[0] ?? 0;
              const coords = isNaN(lat) ? undefined : { type: 'Point', coordinates: [lng, lat] };
              const locations = [...(editData.locations || [])];
              locations[index] = { ...locations[index], coordinates: coords };
              setEditData({ ...editData, locations });
            }}
            helperText="e.g. 59.3293" />
          <TextField variant="filled" fullWidth label="Longitude" placeholder="18.0686"
            inputProps={{ inputMode: 'decimal' }}
            value={loc.coordinates?.coordinates?.[0] ?? ''}
            onChange={(e) => {
              const lng = parseFloat(e.target.value);
              const lat = loc.coordinates?.coordinates?.[1] ?? 0;
              const coords = isNaN(lng) ? undefined : { type: 'Point', coordinates: [lng, lat] };
              const locations = [...(editData.locations || [])];
              locations[index] = { ...locations[index], coordinates: coords };
              setEditData({ ...editData, locations });
            }}
            helperText="e.g. 18.0686" />
        </Box>
      </Stack>
    </Box>
  );
};

const CafeEditForm = ({ editData, setEditData, showFeatures = true }) => (
  <Stack spacing={2}>
    <Typography variant="subtitle1" fontWeight={600}>Basic Info</Typography>
    <TextField variant="filled" fullWidth label="Name" value={editData.name || ''}
      onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
    <TextField variant="filled" select fullWidth label="Category" value={editData.category || ''}
      onChange={(e) => setEditData({ ...editData, category: e.target.value })}>
      <MenuItem value="specialty">Specialty</MenuItem>
      <MenuItem value="roaster">Roaster</MenuItem>
      <MenuItem value="thirdwave">Third Wave</MenuItem>
    </TextField>
    <TextField variant="filled" fullWidth multiline rows={3} label="Description" value={editData.description || ''}
      onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
    <TextField variant="filled" fullWidth label="Website or Instagram" value={editData.website || ''}
      onChange={(e) => setEditData({ ...editData, website: e.target.value })} />

    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="subtitle1" fontWeight={600}>Locations</Typography>
      <Button size="small" variant="outlined" onClick={() => addLocation(editData, setEditData)}>
        + Add Location
      </Button>
    </Box>

    {(editData.locations || [{}]).map((_, i) => (
      <LocationFields key={i} editData={editData} setEditData={setEditData} index={i} />
    ))}

    <Typography variant="subtitle1" fontWeight={600}>Media</Typography>
    <TextField variant="filled" fullWidth label="Icon URL (SVG)" placeholder="https://example.com/logo.svg"
      value={editData.icon || ''}
      onChange={(e) => setEditData({ ...editData, icon: e.target.value })}
      helperText="SVG logo shown on the map marker or cafe card" />
    <TextField variant="filled" fullWidth label="Background Image URL" placeholder="https://example.com/cover.jpg"
      value={editData.image || ''}
      onChange={(e) => setEditData({ ...editData, image: e.target.value })}
      helperText="Cover/background image for the cafe card" />

    <FormControlLabel
      control={
        <Checkbox checked={!!editData.isApproved}
          onChange={(e) => setEditData({ ...editData, isApproved: e.target.checked })} />
      }
      label="Approved (visible on map)"
    />

    {showFeatures && (
      <>
        <Typography variant="subtitle1" fontWeight={600}>Features</Typography>
        <FormGroup row>
          {FEATURES.map((feature) => (
            <FormControlLabel
              key={feature}
              control={
                <Checkbox
                  checked={(editData.features || []).includes(feature)}
                  onChange={(e) => {
                    const features = editData.features || [];
                    setEditData({
                      ...editData,
                      features: e.target.checked
                        ? [...features, feature]
                        : features.filter((f) => f !== feature),
                    });
                  }}
                />
              }
              label={feature.replaceAll('_', ' ')}
            />
          ))}
        </FormGroup>
      </>
    )}
  </Stack>
);

export default CafeEditForm;
