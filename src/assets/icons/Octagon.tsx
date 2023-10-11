import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as OctagonSvg } from "../svg/octagon.svg";

const Octagon: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return (
    <SvgIcon
      inheritViewBox
      {...props}
      component={OctagonSvg}
      className='OctagonSvg-icon'
    />
  );
};

export default Octagon;
