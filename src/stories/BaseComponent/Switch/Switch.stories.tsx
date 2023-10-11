import Switch from "@mui/material/Switch";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "Components/Switch",
  component: Switch,
} as ComponentMeta<typeof Switch>;

export const Default: ComponentStory<typeof Switch> = (props) => (
  <Switch {...props} />
);
