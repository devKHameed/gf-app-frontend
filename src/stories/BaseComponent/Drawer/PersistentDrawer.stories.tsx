import Box from "@mui/material/Box";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import PersistentDrawerLeft from "./Drawers/PersistentDrawer";

export default {
  title: "Components/Drawer/PersistentDrawer",
  component: PersistentDrawerLeft,
} as ComponentMeta<typeof PersistentDrawerLeft>;

const PersistentDrawerLeftTemplate: ComponentStory<
  typeof PersistentDrawerLeft
> = (props) => {
  return (
    <Box id="r-drawer">
      <PersistentDrawerLeft {...props} />
    </Box>
  );
};
export const PersistentDrawer = PersistentDrawerLeftTemplate.bind({});
