import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as Svg } from "../svg/checklist.svg";

const Checklist: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={Svg} />;
};

export default Checklist;
