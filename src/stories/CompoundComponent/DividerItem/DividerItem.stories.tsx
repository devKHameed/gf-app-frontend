import type { ComponentMeta, ComponentStory } from "@storybook/react";
import DividerItem from "components/IconPicker/DividerItem";

export default {
  title: "CompoundComponent/DividerItem",
  component: DividerItem,
} as ComponentMeta<typeof DividerItem>;

export const Item: ComponentStory<typeof DividerItem> = (props) => {
  return (
    <>
      <DividerItem />
    </>
  );
};
