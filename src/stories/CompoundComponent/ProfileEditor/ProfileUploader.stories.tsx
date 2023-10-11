import type { ComponentMeta, ComponentStory } from "@storybook/react";
import IconVariant from "components/IconVariant";
import ProfileEditor from "./ProfileEditor/ProfileEditor";
import ProfileUploader from "./ProfileUploader/ProfileUploader";

export default {
  title: "CompoundComponent/ProfileEditor",
  component: ProfileEditor,
} as ComponentMeta<typeof ProfileEditor>;

export const Item: ComponentStory<typeof ProfileEditor> = (props) => {
  return (
    <>
      <ProfileEditor />
      <IconVariant />
    </>
  );
};
export const ProfileUpload: ComponentStory<typeof ProfileUploader> = (
  props
) => {
  return (
    <>
      <ProfileUploader />
    </>
  );
};
