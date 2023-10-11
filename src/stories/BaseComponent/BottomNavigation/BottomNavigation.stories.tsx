import FavoriteIcon from "@mui/icons-material/Favorite";
import FolderIcon from "@mui/icons-material/Folder";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RestoreIcon from "@mui/icons-material/Restore";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { useState } from "react";
export default {
  title: "Components/BottomNavigation",
  component: BottomNavigation,
} as ComponentMeta<typeof BottomNavigation>;
export const Default: ComponentStory<typeof BottomNavigation> = (props) => {
  const [value, setValue] = useState(0);
  return (
    <Box>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        {...props}
      >
        <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
        <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
      </BottomNavigation>
    </Box>
  );
};
export const BottomwithNoLabel: ComponentStory<typeof BottomNavigation> = (
  props
) => {
  const [b2, setB2] = useState(0);

  return (
    <Box>
      <Box py={3}>
        <BottomNavigation
          value={b2}
          onChange={(event, newValue) => {
            setB2(newValue);
          }}
        >
          <BottomNavigationAction
            label="Recents"
            value="recents"
            icon={<RestoreIcon />}
          />
          <BottomNavigationAction
            label="Favorites"
            value="favorites"
            icon={<FavoriteIcon />}
          />
          <BottomNavigationAction
            label="Nearby"
            value="nearby"
            icon={<LocationOnIcon />}
          />
          <BottomNavigationAction
            label="Folder"
            value="folder"
            icon={<FolderIcon />}
          />
        </BottomNavigation>
      </Box>
    </Box>
  );
};
