import type { ComponentMeta, ComponentStory } from "@storybook/react";
import Modal from "./Modal";

export default {
  title: "Components/Modal",
  component: Modal,
} as ComponentMeta<typeof Modal>;

export const Default: ComponentStory<typeof Modal> = (props) => <Modal />;
