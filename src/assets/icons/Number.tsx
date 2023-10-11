import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as NumberSvg } from "../svg/number.svg";

const Number: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={NumberSvg} />;
};

export default Number;
