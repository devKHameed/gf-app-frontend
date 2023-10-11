import type { ComponentMeta, ComponentStory } from "@storybook/react";
import PostCard from "./PostCard";

export default {
  title: "CompoundComponent/PostCard",
  component: PostCard,
} as ComponentMeta<typeof PostCard>;

export const Item: ComponentStory<typeof PostCard> = (props) => {
  return (
    <>
      <PostCard />
    </>
  );
};
