import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as AddVideosvg } from "../svg/AddVideo.svg";

const AddVideo: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={AddVideosvg} />;
};

export default AddVideo;
