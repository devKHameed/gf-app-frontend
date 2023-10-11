import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as ColCount2Svg } from "../svg/col_count_2.svg";

const ColCount2: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={ColCount2Svg} />;
};

export default ColCount2;
