import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as CalendarSvg } from "../svg/flow-free.svg";

const FlowFree: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={CalendarSvg} />;
};

export default FlowFree;
