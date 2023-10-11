import { ComponentMeta, ComponentStory } from "@storybook/react";
import { List } from "./List";

export default {
  title: "Components/List",
  component: List,
} as ComponentMeta<typeof List>;

export const MuiList: ComponentStory<typeof List> = (props) => {
  return <List {...props} />;
};
