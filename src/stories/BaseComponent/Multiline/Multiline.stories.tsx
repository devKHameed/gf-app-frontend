import { ComponentMeta, ComponentStory } from "@storybook/react";
import MultilineTextField from "./MultilineTextField";

export default {
  title: "Components/TextField",
  component: MultilineTextField,
} as ComponentMeta<typeof MultilineTextField>;

export const MultilineTextFields: ComponentStory<typeof MultilineTextField> = (
  props
) => {
  return <MultilineTextField {...props} />;
};
