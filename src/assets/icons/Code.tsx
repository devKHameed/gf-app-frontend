import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as CodeSvg } from "../svg/code.svg";

const Code: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={CodeSvg} />;
};

export default Code;
