import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as NextPlayButtonSvg } from "../svg/NextPlayButton.svg";

const NextPlayButton: React.FC<React.ComponentProps<typeof SvgIcon>> = (
  props
) => {
  return (
    <SvgIcon
      inheritViewBox
      {...props}
      component={NextPlayButtonSvg}
      className='plus-icon'
    />
  );
};

export default NextPlayButton;
