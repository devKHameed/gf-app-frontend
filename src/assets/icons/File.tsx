import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as FileSvg } from "../svg/file.svg";

const File: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={FileSvg} />;
};

export default File;
