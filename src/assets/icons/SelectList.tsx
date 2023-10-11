import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as SelectListSvg } from "../svg/select_list.svg";

const SelectList: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={SelectListSvg} />;
};

export default SelectList;
