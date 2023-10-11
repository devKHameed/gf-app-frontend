import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as ScheduleAutomationsViewAllSVG } from "../svg/schedule_view_all.svg";

const ScheduleAutomationsViewAll: React.FC<
  React.ComponentProps<typeof SvgIcon>
> = (props) => {
  return (
    <SvgIcon
      inheritViewBox
      {...props}
      component={ScheduleAutomationsViewAllSVG}
    />
  );
};

export default ScheduleAutomationsViewAll;
