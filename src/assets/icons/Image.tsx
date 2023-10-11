import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as ImageSvg } from "../svg/image.svg";

const Image: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={ImageSvg} />;
};

export default Image;
