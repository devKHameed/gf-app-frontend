import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as AddButtonSvg } from "../svg/AddButton.svg";

const AddButton: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return (
    <SvgIcon
      inheritViewBox
      {...props}
      component={AddButtonSvg}
      className="plus-icon"
    />
  );
};

export default AddButton;
