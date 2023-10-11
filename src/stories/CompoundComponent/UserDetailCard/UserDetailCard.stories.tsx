import type { ComponentMeta, ComponentStory } from "@storybook/react";
import UserDetailCard from "./UserDetailCard";

export default {
  title: "CompoundComponent/UserDetailCard",
  component: UserDetailCard,
} as ComponentMeta<typeof UserDetailCard>;

export const Item: ComponentStory<typeof UserDetailCard> = (props) => {
  return (
    <>
      <UserDetailCard />
    </>
  );
};
