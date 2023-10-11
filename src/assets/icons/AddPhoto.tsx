import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as AddPhotosvg } from "../svg/AddPhoto.svg";

const AddPhoto: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={AddPhotosvg} />;
};

export default AddPhoto;
