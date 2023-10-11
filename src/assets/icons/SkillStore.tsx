import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as SkillStoreSVG } from "../svg/skill_store.svg";

const SkillStore: React.FC<React.ComponentProps<typeof SvgIcon>> = (props) => {
  return <SvgIcon inheritViewBox {...props} component={SkillStoreSVG} />;
};

export default SkillStore;
