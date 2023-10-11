import Box from "@mui/material/Box";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import RDrawer from "./Drawers/ResponsiveDrawer";

export default {
  title: "Components/Drawer/Responsive",
  component: RDrawer,
} as ComponentMeta<typeof RDrawer>;

const ResponsiveDrawerTemplate: ComponentStory<typeof RDrawer> = (props) => {
  return (
    <Box id="r-drawer">
      <RDrawer {...props} />
    </Box>
  );
};
export const ResponsiveDrawer = ResponsiveDrawerTemplate.bind({});
