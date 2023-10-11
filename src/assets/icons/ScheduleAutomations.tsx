import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as ScheduleAutomationsSVG } from "../svg/schedule_automations.svg";

const ScheduleAutomations: React.FC<React.ComponentProps<typeof SvgIcon>> = (
  props
) => {
  return (
    <SvgIcon inheritViewBox {...props} component={ScheduleAutomationsSVG} />
  );
};

export default ScheduleAutomations;
