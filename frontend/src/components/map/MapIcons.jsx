import { SvgIcon } from '@mui/material';

import PinIcon from '../../assets/icons/pinIcon.svg?react';
import RoasterPinIcon from '../../assets/icons/roasterPinIcon.svg?react';
import SpecialtyPinIcon from '../../assets/icons/specialtyPinIcon.svg?react';
import ThirdWavePinIcon from '../../assets/icons/thirdWaveIcon.svg?react';
import GeotagPinIcon from '../../assets/icons/geotagPinIcon.svg?react';

const getCustomIcon = (category, theme, themeMode) => {
  let color;
  switch (category) {
    case 'thirdwave':
      // Use stronger yellow on light backgrounds for contrast
      color =
        (themeMode === 'light' ? theme.palette.accentStrong?.main : theme.palette.accent?.main) ||
        theme.palette.secondary.main;
      break;
    case 'specialty':
      color = themeMode === 'dark' ? theme.palette.light.main : theme.palette.primary.main;
      break;
    case 'roaster':
      color = theme.palette.error.main;
      break;
    case 'geotag':
      color = themeMode === 'dark' ? theme.palette.success.main : theme.palette.success.main;
      break;
    default:
      color = theme.palette.primary.main;
  }

  const iconProps = {
    sx: {
      fontSize: 32,
      color, // This will be inherited by the SVG's currentColor
    },
    inheritViewBox: true,
  };

  switch (category) {
    case 'thirdwave':
      return <SvgIcon component={ThirdWavePinIcon} {...iconProps} />;
    case 'specialty':
      return <SvgIcon component={SpecialtyPinIcon} {...iconProps} />;
    case 'roaster':
      return <SvgIcon component={RoasterPinIcon} {...iconProps} />;
    case 'geotag':
      return <SvgIcon component={GeotagPinIcon} {...iconProps} />;
    default:
      return <SvgIcon component={PinIcon} {...iconProps} />;
  }
};

export { getCustomIcon };
