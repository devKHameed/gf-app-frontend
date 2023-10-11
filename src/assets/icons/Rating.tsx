import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as RatingSvg } from "../svg/rating.svg";

const Rating: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={RatingSvg} />;
};

export default Rating;
