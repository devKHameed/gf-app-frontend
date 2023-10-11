import { ComponentMeta, ComponentStory } from "@storybook/react";
import Card from "./Card";

export const Default: ComponentStory<typeof Card> = (props) => (
  <Card {...props} />
);

export default {
  title: "Components/Card",
  component: Card,
} as ComponentMeta<typeof Card>;
