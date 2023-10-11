import type { ComponentMeta, ComponentStory } from "@storybook/react";

import Accordion from "@mui/material/Accordion";
import ControlledAccordions, {
  CustomizedAccordions,
  SimpleAccordion,
} from "./Accordion";

export default {
  title: "Components/Accordion",
  component: SimpleAccordion,
} as ComponentMeta<typeof SimpleAccordion>;

export const Default: ComponentStory<typeof SimpleAccordion> = (props) => (
  <SimpleAccordion {...props} />
);
export const WidthHeadings: ComponentStory<typeof ControlledAccordions> = (
  props
) => <ControlledAccordions {...props} />;
export const CustomAccordion: ComponentStory<typeof Accordion> = (props) => (
  <CustomizedAccordions {...props} />
);
