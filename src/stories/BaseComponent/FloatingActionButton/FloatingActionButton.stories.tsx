import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NavigationIcon from "@mui/icons-material/Navigation";
import Box from "@mui/material/Box";
import MFab from "@mui/material/Fab";
import { ComponentStory } from "@storybook/react";
import Fab from "./Fab";

export default {
  title: "Components/FloatingActionButton",
  component: Fab,
};

export const FloatingActionButtons: ComponentStory<typeof Fab> = (props) => {
  return (
    <Box sx={{ "& > :not(style)": { m: 1 } }}>
      <Fab {...props} />
    </Box>
  );
};
export const FButtons: ComponentStory<typeof Fab> = (props) => {
  return (
    <Box sx={{ "& > :not(style)": { m: 1 } }}>
      <MFab color="secondary" aria-label="edit" {...props}>
        <EditIcon />
      </MFab>
      <MFab variant="extended" {...props}>
        <NavigationIcon sx={{ mr: 1 }} />
        Navigate
      </MFab>
      <MFab disabled aria-label="like" {...props}>
        <FavoriteIcon />
      </MFab>
    </Box>
  );
};
