import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as ArrowUpSvg } from "../svg/ArrowUp.svg";

const ArrowUp: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={ArrowUpSvg} />;
};

export default ArrowUp;
