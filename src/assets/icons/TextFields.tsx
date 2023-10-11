import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as TextFieldsSvg } from "../svg/text_fields.svg";

const TextFields: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={TextFieldsSvg} />;
};

export default TextFields;
