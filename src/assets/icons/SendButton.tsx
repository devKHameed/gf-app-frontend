import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as SendButtonSvg } from "../svg/SendButton.svg";

const SendButton: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return (
    <SvgIcon
      inheritViewBox
      {...props}
      component={SendButtonSvg}
      className='send-icon'
    />
  );
};

export default SendButton;
