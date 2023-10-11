import type { ComponentMeta, ComponentStory } from "@storybook/react";
import ToggleItems from "./ToggleITems/ToggleITem";

export default {
  title: "CompoundComponent/ToggleItems",
  component: ToggleItems,
} as ComponentMeta<typeof ToggleItems>;

export const Item: ComponentStory<typeof ToggleItems> = (props) => {
  return (
    <>
      <ToggleItems />
    </>
  );
};
