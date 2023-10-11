import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as DashboardViewAllSVG } from "../svg/dashboard_view_all.svg";

const DashboardViewAll: React.FC<React.ComponentProps<typeof SvgIcon>> = (
  props
) => {
  return <SvgIcon inheritViewBox {...props} component={DashboardViewAllSVG} />;
};

export default DashboardViewAll;
