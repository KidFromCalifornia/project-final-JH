import React from 'react';
import { Divider } from '@mui/material';
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

      <FilterDropdown
        label="Filter by Cafe Type"
        options={categories}
        value={cafeTypeQuery}
        onChange={setCafeTypeQuery}
        iconComponent={<StorefrontIcon sx={{ color: navIconColor }} />}
      />

      <FilterDropdown
        label="Filter by neighborhood"
        options={neighborhoods}
        value={neighborhoodQuery}
        onChange={setNeighborhoodQuery}
        iconComponent={<TravelExploreIcon sx={{ color: navIconColor }} />}
      />
    </>
  );
};

export default NavigationFilters;
