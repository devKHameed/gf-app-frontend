import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as ViewAllStarSVG } from "../svg/star_view_all.svg";

const ViewAllStar: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={ViewAllStarSVG} />;
};

export default ViewAllStar;
