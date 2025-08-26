import { SvgIcon } from "@mui/material";

import PinIcon from "../assets/pinIcon.svg?react";
import RoasterPinIcon from "../assets/roasterPinIcon.svg?react";
import SpecialtyPinIcon from "../assets/specialtyPinIcon.svg?react";
import ThirdWavePinIcon from "../assets/thirdWaveIcon.svg?react";

const getCustomIcon = (category, theme, themeMode) => {
  let color;
  switch (category) {
    case "thirdwave":
      color = theme.palette.accent?.main || theme.palette.secondary.main;
      break;
    case "specialty":
      color =
        themeMode === "dark"
          ? theme.palette.light?.main || theme.palette.primary.main
          : theme.palette.primary.main;
      break;
    case "roaster":
      color = theme.palette.error.main;
      break;
    default:
      color = theme.palette.primary.main;
  }

  const iconProps = { sx: { fontSize: 32, color }, inheritViewBox: true };

  switch (category) {
    case "thirdwave":
      return <SvgIcon component={ThirdWavePinIcon} {...iconProps} />;
    case "specialty":
      return <SvgIcon component={SpecialtyPinIcon} {...iconProps} />;
    case "roaster":
      return <SvgIcon component={RoasterPinIcon} {...iconProps} />;
    default:
      return <SvgIcon component={PinIcon} {...iconProps} />;
  }
};

export { getCustomIcon };
