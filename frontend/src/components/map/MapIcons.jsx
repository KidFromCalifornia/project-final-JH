import { SvgIcon } from '@mui/material';

// Original SVG imports
import PinIcon from '../../assets/icons/pinIcon.svg?react';
import RoasterPinIcon from '../../assets/icons/roasterPinIcon.svg?react';
import SpecialtyPinIcon from '../../assets/icons/specialtyPinIcon.svg?react';
import ThirdWavePinIcon from '../../assets/icons/thirdWaveIcon.svg?react';
import GeotagPinIcon from '../../assets/icons/geotagPinIcon.svg?react';

const getCustomIcon = (category, theme, themeMode, options = {}) => {
  // Simple color map
  const colors = {
    thirdwave: '#e0b404', // Yellow/gold
    specialty: '#2570bb', // Blue
    roaster: '#ef6461', // Red
    geotag: '#4caf50', // Green
    default: theme.palette.primary.main,
  };

  const color = colors[category] || colors.default;

  // Add outline effect for light mode to increase visibility
  const iconProps = {
    sx: {
      fontSize: 32,
      color,
    },
  };

  // For SVG icons, we need a stronger outline in light mode with sharp edges
  const svgIconProps = {
    ...iconProps,
    sx: {
      ...iconProps.sx,
      // Create a sharper outline by using multiple stacked shadows with 0 blur radius
      filter:
        themeMode === 'light'
          ? 'drop-shadow(1px 2px 0px rgba(7, 42, 103, .03)) drop-shadow(1px 1px 0px rgba(7, 42, 103, 1.0)) '
          : 'drop-shadow(2px 3px 0px #072a677f)',
    },
  };

  // SVG icons with proper outline effect
  switch (category) {
    case 'thirdwave':
      return <SvgIcon component={ThirdWavePinIcon} inheritViewBox {...svgIconProps} />;
    case 'specialty':
      return <SvgIcon component={SpecialtyPinIcon} inheritViewBox {...svgIconProps} />;
    case 'roaster':
      return <SvgIcon component={RoasterPinIcon} inheritViewBox {...svgIconProps} />;
    case 'geotag':
      return <SvgIcon component={GeotagPinIcon} inheritViewBox {...svgIconProps} />;
    default:
      return <SvgIcon component={PinIcon} inheritViewBox {...svgIconProps} />;
  }
};

export { getCustomIcon };
