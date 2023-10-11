import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { listData, trailingData } from "data";
import Header from "./Header/Header";

export default {
  title: "CompoundComponent/Header",
  component: Header,
} as ComponentMeta<typeof Header>;

export const Item: ComponentStory<typeof Header> = (props) => {
  return (
    <>
      {trailingData.map((item, index) => (
        <Header {...item} key={index} />
      ))}
    </>
  );
};
export const ListItem: ComponentStory<typeof Header> = (props) => {
  return (
    <>
      {listData.map((item, index) => (
        <Header {...item} key={index} />
      ))}
    </>
  );
};
