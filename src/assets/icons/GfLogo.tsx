import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as GFLogoSvg } from "../svg/gf-log.svg";

const GfLogo: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={GFLogoSvg} />;
};

export default GfLogo;
