import type { ComponentMeta, ComponentStory } from "@storybook/react";
import EdgeConnectorC from "./EdgeConnector";

export default {
  title: "CompoundComponent/EdgeConnector",
  component: EdgeConnectorC,
} as ComponentMeta<typeof EdgeConnectorC>;

export const Item: ComponentStory<typeof EdgeConnectorC> = (props) => {
  return (
    <>
      <EdgeConnectorC />
    </>
  );
};
