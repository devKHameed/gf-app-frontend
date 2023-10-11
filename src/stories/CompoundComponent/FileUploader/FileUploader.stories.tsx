import type { ComponentMeta, ComponentStory } from "@storybook/react";
import FileUploader from "./FileUploader/FileUploader";

export default {
  title: "CompoundComponent/MediaUploader",
  component: FileUploader,
} as ComponentMeta<typeof FileUploader>;

export const GalleryMedia: ComponentStory<typeof FileUploader> = (props) => {
  return (
    <>
      <FileUploader />
    </>
  );
};
