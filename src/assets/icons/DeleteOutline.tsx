import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as DeleteOutlineSvg } from "../svg/DeleteOutline.svg";

const DeleteOutline: React.FC<React.ComponentProps<typeof SvgIcon>> = (
  props
) => {
  return <SvgIcon inheritViewBox {...props} component={DeleteOutlineSvg} />;
};

export default DeleteOutline;
