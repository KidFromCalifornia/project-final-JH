import React from 'react';
import { Divider, List, ListItem } from '@mui/material';
import {
  Storefront as StorefrontIcon,
  TravelExplore as TravelExploreIcon,
} from '@mui/icons-material';
import FilterDropdown from '../../common/FilterDropdown';

const NavigationFilters = ({
  categories,
  neighborhoods,
  cafeTypeQuery,
  neighborhoodQuery,
  setCafeTypeQuery,
  setNeighborhoodQuery,
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
            label="Filter by neighborhood"
            options={neighborhoods}
            value={neighborhoodQuery}
            onChange={setNeighborhoodQuery}
            iconComponent={<TravelExploreIcon sx={{ color: navIconColor }} />}
          />
        </ListItem>
      </List>
    </>
  );
};

export default NavigationFilters;
