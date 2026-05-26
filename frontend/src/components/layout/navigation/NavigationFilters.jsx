import React from 'react';
import { Divider, List, ListItem } from '@mui/material';
import {
  Storefront as StorefrontIcon,
  TravelExplore as TravelExploreIcon,
  LocalCafe as LocalCafeIcon,
} from '@mui/icons-material';
import FilterDropdown from '../../common/FilterDropdown';

const FEATURES = [
  'outdoor_seating', 'wheelchair_accessible', 'lunch', 'pour_over', 'takeaway',
  'vegan_options', 'breakfast', 'iced_drinks', 'pastries', 'multi_roaster',
  'decaf', 'no_coffee_bar', 'limited_sitting', 'roaster_only',
];

const formatFeature = (f) => f.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const NavigationFilters = ({
  categories,
  neighborhoods,
  cafeTypeQuery,
  neighborhoodQuery,
  featureQuery,
  setCafeTypeQuery,
  setNeighborhoodQuery,
  setFeatureQuery,
  navIconColor,
  open,
}) => {
  return (
    <>
      <Divider />
      <List>
        <ListItem disablePadding>
          <FilterDropdown
            label="Filter by Cafe Type"
            options={categories}
            value={cafeTypeQuery}
            onChange={setCafeTypeQuery}
            iconComponent={<StorefrontIcon sx={{ color: navIconColor }} />}
          />
        </ListItem>

        <ListItem disablePadding>
          <FilterDropdown
            label="Filter by Neighborhood"
            options={neighborhoods}
            value={neighborhoodQuery}
            onChange={setNeighborhoodQuery}
            iconComponent={<TravelExploreIcon sx={{ color: navIconColor }} />}
          />
        </ListItem>

        <ListItem disablePadding>
          <FilterDropdown
            label="Filter by Feature"
            options={FEATURES.map(formatFeature)}
            value={featureQuery ? formatFeature(featureQuery) : ''}
            onChange={(val) => setFeatureQuery(val ? FEATURES.find(f => formatFeature(f) === val) || '' : '')}
            iconComponent={<LocalCafeIcon sx={{ color: navIconColor }} />}
          />
        </ListItem>
      </List>
    </>
  );
};

export default NavigationFilters;
