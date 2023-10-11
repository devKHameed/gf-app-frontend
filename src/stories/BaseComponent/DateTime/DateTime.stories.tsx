import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { MaterialUIPickers, NativePickers as NPickers } from "./DateTime";
export default {
  title: "Components/DateTimePickers",
  component: MaterialUIPickers,
} as ComponentMeta<typeof MaterialUIPickers>;

export const Default: ComponentStory<typeof MaterialUIPickers> = (props) => (
  <MaterialUIPickers {...props} />
);
export const NativePickers: ComponentStory<typeof NPickers> = (props) => (
  <NPickers {...props} />
);
