import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as ProgressSvg } from "../svg/progress.svg";

const Progress: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={ProgressSvg} />;
};

export default Progress;
