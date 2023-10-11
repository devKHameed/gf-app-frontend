import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as PlayTriangleSvg } from "../svg/PlayTriangle.svg";

const PlayTriangle: React.FC<React.ComponentProps<typeof SvgIcon>> = (
  props
) => {
  return <SvgIcon inheritViewBox {...props} component={PlayTriangleSvg} />;
};

export default PlayTriangle;
