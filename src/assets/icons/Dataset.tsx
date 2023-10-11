import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as Svg } from "../svg/dataset.svg";

const Dataset: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={Svg} />;
};

export default Dataset;
