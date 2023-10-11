import type { ComponentMeta, ComponentStory } from "@storybook/react";
import TagsField from "components/TagsField";

export default {
  title: "CompoundComponent/TagsField",
  component: TagsField,
} as ComponentMeta<typeof TagsField>;

export const Item: ComponentStory<typeof TagsField> = (props) => {
  return (
    <>
      <TagsField />
    </>
  );
};
