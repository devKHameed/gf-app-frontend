import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as LeftPanelCloseSvg } from "../svg/left_panel_close.svg";

const LeftPanelClose: React.FC<React.ComponentProps<typeof SvgIcon>> = (
  props
) => {
  return (
    <SvgIcon
      inheritViewBox
      {...props}
      component={LeftPanelCloseSvg}
      className='LeftPanelCloseSvg-icon'
    />
  );
};

export default LeftPanelClose;
