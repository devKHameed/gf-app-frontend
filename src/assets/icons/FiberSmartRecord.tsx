import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as FiberSmartRecordSvg } from "../svg/fiber_smart_record.svg";

const FiberSmartRecord: React.FC<React.ComponentProps<typeof SvgIcon>> = (
  props
) => {
  return <SvgIcon inheritViewBox {...props} component={FiberSmartRecordSvg} />;
};

export default FiberSmartRecord;
