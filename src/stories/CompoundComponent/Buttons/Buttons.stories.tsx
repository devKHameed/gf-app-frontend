import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import IOSSwitch from "components/IOSSwitch";
import { useState } from "react";

export default {
  title: "CompoundComponent/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

const children = [
  <ToggleButton value="left" key="left">
    <FormatAlignLeftIcon />
  </ToggleButton>,
  <ToggleButton value="center" key="center">
    <FormatAlignCenterIcon />
  </ToggleButton>,
  <ToggleButton value="right" key="right">
    <FormatAlignRightIcon />
  </ToggleButton>,
];

export const RunTestButton: ComponentStory<typeof Button> = (props) => {
  const [val, setVal] = useState(false);
  return (
    <>
      <Button
        variant="outlined"
        endIcon={<PlayCircleFilledWhiteOutlinedIcon />}
      >
        RUN TEST
      </Button>
      <Button
        variant="outlined"
        onClick={(e) => setVal(!val)}
        endIcon={<IOSSwitch onChange={(e) => setVal(e.target.checked)} />}
      >
        {`${val ? "ACTIVE" : "INACTIVE"}`}
      </Button>
      <Button variant="outlined" endIcon={<RestoreOutlinedIcon />}>
        HISTORY
      </Button>
      <Button variant="outlined" sx={{ p: 0.75, minWidth: "36px" }}>
        <StopCircleOutlinedIcon />
      </Button>
      <Button variant="outlined" sx={{ p: 0.75, minWidth: "36px" }}>
        <PlayCircleFilledWhiteOutlinedIcon />
      </Button>
      <Button variant="outlined" sx={{ p: 0.75, minWidth: "36px" }}>
        <PauseCircleOutlineOutlinedIcon />
      </Button>
      <ToggleButtonGroup size="small" aria-label="Small sizes">
        {children}
      </ToggleButtonGroup>
    </>
  );
};
