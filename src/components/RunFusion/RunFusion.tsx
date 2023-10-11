import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import { Box, IconButton, LinearProgress, Stack } from "@mui/material";
import * as React from "react";
import ProfileCard from "stories/CompoundComponent/ProfileCard/ProfileCard";
interface Props {
  progress?: number;
  title?: string;
  actions?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
}

const RunFusion: React.FC<Props> = (props) => {
  const { progress, title, actions = true, onPause, onPlay, onStop } = props;
  return (
    <Box>
      <Stack>
        <ProfileCard
          options={{ draggable: false, switcher: false }}
          title={title || "Run"}
          rightIcon={
            actions ? (
              <Stack direction={"row"} alignItems="center">
                <IconButton onClick={onStop}>
                  <StopCircleOutlinedIcon />
                </IconButton>
                <IconButton onClick={onPlay}>
                  <PlayCircleFilledWhiteOutlinedIcon />
                </IconButton>
                <IconButton onClick={onPause}>
                  <PauseCircleOutlineOutlinedIcon />
                </IconButton>
              </Stack>
            ) : (
              <Box sx={{ height: 40 }} />
            )
          }
        />
        <LinearProgress
          color="inherit"
          variant="determinate"
          value={progress}
        />
      </Stack>
      {/* {runningTestData.map((ele) => {
        return (
          <Box sx={{ mb: 1.5 }}>
            <ProfileCard
              options={{ draggable: false, switcher: false }}
              title={`${ele.title}: ${''} ${ele.value}`}
              AvatarImage={<IconButton>{ele.icon}</IconButton>}
            />
          </Box>
        );
      })} */}
    </Box>
  );
};
export default RunFusion;
