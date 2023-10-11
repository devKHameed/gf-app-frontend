import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as ArrowBackSvg } from "../svg/ArrowBack.svg";

const ArrowBack: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={ArrowBackSvg} />;
};

export default ArrowBack;
