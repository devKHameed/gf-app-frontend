import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as CalendarSvg } from "../svg/flow-horiz.svg";

const FlowHoriz: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={CalendarSvg} />;
};

export default FlowHoriz;
