import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as PlaySvg } from "../svg/play.svg";

const Play: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={PlaySvg} />;
};

export default Play;
