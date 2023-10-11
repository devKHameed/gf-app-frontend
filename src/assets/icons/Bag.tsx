import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as BagSVG } from "../svg/bag_check.svg";

const Bag: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={BagSVG} />;
};

export default Bag;
