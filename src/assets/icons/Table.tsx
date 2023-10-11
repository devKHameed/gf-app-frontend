import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as TableSVG } from "../svg/table.svg";

const Table: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={TableSVG} />;
};

export default Table;
