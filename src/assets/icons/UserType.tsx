import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as UserTypeSvg } from "../svg/user_type.svg";

const UserType: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={UserTypeSvg} />;
};

export default UserType;
