import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as TriangleSvg } from "../svg/triangle.svg";

const Triangle: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return (
    <SvgIcon
      inheritViewBox
      {...props}
      component={TriangleSvg}
      className='TriangleSvg-icon'
    />
  );
};

export default Triangle;
