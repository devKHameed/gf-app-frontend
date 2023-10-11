import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as DatabaseSvg } from "../../svg/database.svg";

const DatabaseIcon: React.FC<React.ComponentProps<typeof SvgIcon>> = (
  props
) => {
  return (
    <SvgIcon
      inheritViewBox
      {...props}
      component={DatabaseSvg}
      className="plus-icon"
    />
  );
};

export default DatabaseIcon;
