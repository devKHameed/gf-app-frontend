import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as LabelSvg } from "../svg/label.svg";

const Label: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={LabelSvg} />;
};

export default Label;
