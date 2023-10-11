import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { SelectC } from "./Select";

export default {
  title: "Components/Select",
  component: SelectC,
} as ComponentMeta<typeof SelectC>;

export const Default: ComponentStory<typeof SelectC> = (props) => (
  <SelectC {...props} />
);
