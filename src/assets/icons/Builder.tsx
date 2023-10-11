import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as BuilderSvg } from "../svg/Builder.svg";

const Builder: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={BuilderSvg} />;
};

export default Builder;
