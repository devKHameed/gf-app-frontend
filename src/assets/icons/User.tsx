import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as UserSvg } from "../svg/user.svg";

const User: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={UserSvg} />;
};

export default User;
