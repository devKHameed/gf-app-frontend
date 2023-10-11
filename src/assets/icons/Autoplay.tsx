import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as AutoplaySvg } from "../svg/autoplay.svg";

const Autoplay: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return (
    <SvgIcon
      inheritViewBox
      {...props}
      component={AutoplaySvg}
      className='auto-icon'
    />
  );
};

export default Autoplay;
