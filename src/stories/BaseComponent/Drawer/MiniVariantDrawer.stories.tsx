import Box from "@mui/material/Box";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import MVariantDrawer from "./Drawers/MiniVariant";

export default {
  title: "Components/Drawer/Responsive",
  component: MVariantDrawer,
} as ComponentMeta<typeof MVariantDrawer>;

const MiniVariantDrawerTemplate: ComponentStory<typeof MVariantDrawer> = (
  props
) => {
  return (
    <Box id="r-drawer">
      <MVariantDrawer {...props} />
    </Box>
  );
};
export const MiniVariantDrawer = MiniVariantDrawerTemplate.bind({});
