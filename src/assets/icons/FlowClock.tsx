import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as FlowClockSvg } from "../svg/flow-clock.svg";

const FlowClock: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={FlowClockSvg} />;
};

export default FlowClock;
