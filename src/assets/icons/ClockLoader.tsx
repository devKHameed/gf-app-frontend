import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as Svg } from "../svg/clock_loader_40.svg";

const ClockLoader: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={Svg} />;
};

export default ClockLoader;
