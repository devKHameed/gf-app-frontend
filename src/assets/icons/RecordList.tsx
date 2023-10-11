import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as RecordListSvg } from "../svg/record_list.svg";

const RecordList: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={RecordListSvg} />;
};

export default RecordList;
