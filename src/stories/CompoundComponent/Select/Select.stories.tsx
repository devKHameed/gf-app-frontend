import Select from "@mui/material/Select";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { SelectCustomItem, SelectIcon } from "./IconSelect";

export default {
  title: "CompoundComponent/SelectIcon",
  component: SelectIcon,
} as ComponentMeta<typeof Select>;

export const Default: ComponentStory<typeof Select> = (props) => <SelectIcon />;
export const Variant: ComponentStory<typeof Select> = (props) => (
  <SelectCustomItem />
);
