import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as RadioListSvg } from "../svg/radio_list.svg";

const RadioList: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={RadioListSvg} />;
};

export default RadioList;
