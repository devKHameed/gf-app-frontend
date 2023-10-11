import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as BagLinesSVG } from "../svg/baglines.svg";

const BagLines: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={BagLinesSVG} />;
};

export default BagLines;
