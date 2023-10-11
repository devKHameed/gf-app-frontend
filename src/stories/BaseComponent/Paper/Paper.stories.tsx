import type { ComponentMeta, ComponentStory } from "@storybook/react";
import Paper from "./Paper";

export default {
  title: "Components/Paper",
  component: Paper,
} as ComponentMeta<typeof Paper>;

export const Default: ComponentStory<typeof Paper> = (props) => (
  <Paper {...props} />
);

export { Elevation, SimplePaper, Variants } from "./examples";
