import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as ColCount1Svg } from "../svg/col_count_1.svg";

const ColCount1: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={ColCount1Svg} />;
};

export default ColCount1;
