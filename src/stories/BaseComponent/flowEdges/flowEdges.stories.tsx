
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import FlowEdgesC from "./flowEdges";

export default {
  title: "CompoundComponent/flowEdges",
  component: FlowEdgesC,
} as ComponentMeta<typeof FlowEdgesC>;

export const Item: ComponentStory<typeof FlowEdgesC> = (props) => {
  return (
    <>
      <FlowEdgesC />
    </>
  );
};
