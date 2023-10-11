import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as CalendarSvg } from "../svg/calendar.svg";

const Calendar: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={CalendarSvg} />;
};

export default Calendar;
