import type { ComponentMeta, ComponentStory } from "@storybook/react";
import SessionItem from "components/SessionItem/SessionItem";
import { statusdata } from "data";

export default {
  title: "CompoundComponent/SessionItem",
  component: SessionItem,
} as ComponentMeta<typeof SessionItem>;

export const Item: ComponentStory<typeof SessionItem> = (props) => {
  return (
    <>
      {statusdata.map((ele) => {
        return (
          <SessionItem
            status={ele.runStatus}
            timestamp={ele.runTimeNo}
            title={ele.runTime}
          />
        );
      })}
    </>
  );
};
