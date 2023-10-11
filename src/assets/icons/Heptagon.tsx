import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as HeptagonSvg } from "../svg/heptagon.svg";

const Heptagon: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return (
    <SvgIcon
      inheritViewBox
      {...props}
      component={HeptagonSvg}
      className='HeptagonSvg-icon'
    />
  );
};

export default Heptagon;
