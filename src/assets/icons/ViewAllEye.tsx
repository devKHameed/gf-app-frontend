import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as ViewAllEyeSVG } from "../svg/view_all.svg";

const ViewAllEye: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={ViewAllEyeSVG} />;
};

export default ViewAllEye;
