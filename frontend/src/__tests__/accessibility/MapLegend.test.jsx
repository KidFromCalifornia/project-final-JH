// Simple example accessibility test for MapLegend component
import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ThemeProvider } from '@mui/material/styles';
import MapLegend from '../../components/map/MapLegend';
import { createTheme } from '@mui/material/styles';

// This is just a simplified example of how you could test for accessibility
// You can use this pattern for other components if needed
describe('MapLegend Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const theme = createTheme();
    const { container } = render(
      <ThemeProvider theme={theme}>
        <MapLegend open={true} onClose={() => {}} />
      </ThemeProvider>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
