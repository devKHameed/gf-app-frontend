import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as PreviusPlaySvg } from "../svg/PreviusPlay.svg";

const PreviusPlay: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return (
    <SvgIcon
      inheritViewBox
      {...props}
      component={PreviusPlaySvg}
      className='PreviusPlay-icon'
    />
  );
};

export default PreviusPlay;
