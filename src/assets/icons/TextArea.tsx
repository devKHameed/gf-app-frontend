import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as TextAreaSvg } from "../svg/textarea.svg";

const TextArea: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={TextAreaSvg} />;
};

export default TextArea;
