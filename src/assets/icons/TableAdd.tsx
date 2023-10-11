import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as TableAddSVG } from "../svg/table_add.svg";

const TableAdd: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={TableAddSVG} />;
};

export default TableAdd;
