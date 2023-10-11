import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as ColCount3Svg } from "../svg/col_count_3.svg";

const ColCount3: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={ColCount3Svg} />;
};

export default ColCount3;
