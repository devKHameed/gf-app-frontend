import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as SkillActiveSVG } from "../svg/skill_active.svg";

const SkillActive: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={SkillActiveSVG} />;
};

export default SkillActive;
