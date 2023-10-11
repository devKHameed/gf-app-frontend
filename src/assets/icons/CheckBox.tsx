import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as CheckBoxSvg } from "../svg/check_box.svg";

const CheckBox: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={CheckBoxSvg} />;
};

export default CheckBox;
