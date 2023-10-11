import Box from "@mui/material/Box";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import PermanantDrawer from "./Drawers/Permanent";

export default {
  title: "Components/Drawer/Responsive",
  component: PermanantDrawer,
} as ComponentMeta<typeof PermanantDrawer>;

const PermanantDrawerTemplate: ComponentStory<typeof PermanantDrawer> = (
  props
) => {
  return (
    <Box id="r-drawer">
      <PermanantDrawer {...props} />
    </Box>
  );
};
export const PermanantDrawerLeft = PermanantDrawerTemplate.bind({});
