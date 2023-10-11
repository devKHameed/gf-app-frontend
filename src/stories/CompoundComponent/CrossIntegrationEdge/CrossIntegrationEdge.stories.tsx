import type { ComponentMeta, ComponentStory } from "@storybook/react";
import CrossIntegrationEdgeC from "./CrossIntegrationEdge";

export default {
  title: "CompoundComponent/CrossIntegrationEdge",
  component: CrossIntegrationEdgeC,
} as ComponentMeta<typeof CrossIntegrationEdgeC>;

export const Item: ComponentStory<typeof CrossIntegrationEdgeC> = (props) => {
  return (
    <>
      <CrossIntegrationEdgeC />
    </>
  );
};
