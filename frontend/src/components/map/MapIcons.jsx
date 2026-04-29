import { SvgIcon } from '@mui/material';

// Original SVG imports
import PinIcon from '../../assets/icons/pinIcon.svg?react';
import RoasterPinIcon from '../../assets/icons/roasterPinIcon.svg?react';
import SpecialtyPinIcon from '../../assets/icons/specialtyPinIcon.svg?react';
import ThirdWavePinIcon from '../../assets/icons/thirdWaveIcon.svg?react';
import GeotagPinIcon from '../../assets/icons/geotagPinIcon.svg?react';

const getCustomIcon = (category, theme, themeMode, options = {}) => {
  // Use accentStrong in light mode, accent in dark mode
  const iconColor = themeMode === 'dark' ? theme.palette.accent.main : theme.palette.secondary.main;

  // Consistent icon styling
  const iconProps = {
    sx: {
      fontSize: options.fontSize || '2rem',
      color: iconColor,
      // Add subtle shadow for depth and visibility
      filter:
        themeMode === 'light'
          ? 'drop-shadow(1px 1px 0px rgba(0, 0, 0, 0.40))'
          : 'drop-shadow(2px 2px 0px rgba(0, 0, 0, 0.5))',
    },
  };

  // Icons change color based on category
  switch (category) {
    case 'thirdwave':
      return <SvgIcon component={ThirdWavePinIcon} inheritViewBox {...iconProps} />;
    case 'specialty':
      return <SvgIcon component={SpecialtyPinIcon} inheritViewBox {...iconProps} />;
    case 'roaster':
      return <SvgIcon component={RoasterPinIcon} inheritViewBox {...iconProps} />;
    case 'geotag':
      return <SvgIcon component={GeotagPinIcon} inheritViewBox {...iconProps} />;
    default:
      return <SvgIcon component={PinIcon} inheritViewBox {...iconProps} />;
  }
};

export { getCustomIcon };
