import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as SkillCreateSVG } from "../svg/skill_create.svg";

const SkillCreate: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={SkillCreateSVG} />;
};

export default SkillCreate;
