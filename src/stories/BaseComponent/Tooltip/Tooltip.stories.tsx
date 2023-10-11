import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { ComponentMeta } from "@storybook/react";

export default {
  title: "Components/Tooltip",
  component: Tooltip,
} as ComponentMeta<typeof Tooltip>;

export const BasicTooltip = () => {
  return (
    <Tooltip title="Delete" arrow>
      <IconButton>
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
};
