import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as AddFolderSvg } from "../svg/AddFolder.svg";

const AddFolder: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={AddFolderSvg} />;
};

export default AddFolder;
