import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as UploadSvg } from "../svg/upload.svg";

const Upload: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={UploadSvg} />;
};

export default Upload;
