import type { ComponentMeta, ComponentStory } from "@storybook/react";
import Dialog from "./Dialog";

export default {
  title: "Components/Dialog",
  component: Dialog,
} as ComponentMeta<typeof Dialog>;

export const Default: ComponentStory<typeof Dialog> = (props) => {
  return <Dialog {...props} />;
};
