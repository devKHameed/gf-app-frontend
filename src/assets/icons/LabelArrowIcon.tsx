import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as LabelArrowIconSvg } from "../svg/label-arrow-icon.svg";

const LabelArrowIcon: React.FC<React.ComponentProps<typeof SvgIcon>> = (
  props
) => {
  return <SvgIcon inheritViewBox {...props} component={LabelArrowIconSvg} />;
};

export default LabelArrowIcon;
