import Select from "@mui/material/Select";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { CanvasSetting } from "module/canvasSetting";

export default {
  title: "CompoundComponent/CanvasSetting",
  component: CanvasSetting,
} as ComponentMeta<typeof CanvasSetting>;

export const Default: ComponentStory<typeof Select> = (props) => (
  <CanvasSetting />
);
