import FormatAlignLeftOutlinedIcon from "@mui/icons-material/FormatAlignLeftOutlined";
import PauseOutlinedIcon from "@mui/icons-material/PauseOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { ListItem, ListItemIcon, Typography } from "@mui/material";
import NextPlayButton from "assets/icons/NextPlayButton";
import PreviusPlay from "assets/icons/PreviusPlay";
import { createSelectorFunctions } from "auto-zustand-selectors-hook";
import { useState } from "react";
import { useTranscriptAudioStore } from "store/stores/transcription/TranscriptData";
import { isPlaying } from "utils";
import { MenuList, MenuListWrapper } from "../Transcription.styles";
const useAudioStore = createSelectorFunctions(useTranscriptAudioStore);

type props = {
  setIsOpen?: any;
};
const CurrentTime = () => {
  const store = useAudioStore();
  const time =
    new Date((store?.time || 0) * 1000).toISOString().substr(11, 8) || 0;
  return (
    <Typography variant='body2' className='duration'>
      {time}
    </Typography>
  );
};
const PlayAndPouse = () => {
  const [isPlay, setisPlaying] = useState<boolean>(false);
  const player = document.getElementById("wf-video-player") as HTMLVideoElement;
  return (
    <>
      <ListItem
        onClick={() => {
          if (isPlaying(player)) {
            player?.pause();
            setisPlaying(false);
            return;
          }
          player?.play();
          setisPlaying(true);
        }}
      >
        <ListItemIcon className='play-track'>
          {isPlay ? (
            <PauseOutlinedIcon sx={{ width: "20px" }} />
          ) : (
            <PlayArrowIcon sx={{ width: "20px" }} />
          )}
        </ListItemIcon>
      </ListItem>
    </>
  );
};

const TranscriptionControlls: React.FC<props> = (props) => {
  const { setIsOpen } = props;
  return (
    <>
      <MenuListWrapper>
        <CurrentTime />
        <MenuList className='player-list'>
          <ListItem>
            <ListItemIcon className='shift-track'>
              <SkipNextIcon
                sx={{ width: "24px", transform: "rotate(180deg)" }}
              />
            </ListItemIcon>
          </ListItem>
          <ListItem>
            <ListItemIcon className='rewind-track'>
              <PreviusPlay sx={{ width: "24px" }} />
            </ListItemIcon>
          </ListItem>
          <PlayAndPouse />
          <ListItem>
            <ListItemIcon className='rewind-track'>
              <NextPlayButton sx={{ width: "24px" }} />
            </ListItemIcon>
          </ListItem>
          <ListItem>
            <ListItemIcon className='shift-track'>
              <SkipNextIcon sx={{ width: "24px" }} />
            </ListItemIcon>
          </ListItem>
        </MenuList>
        <ListItemIcon onClick={() => setIsOpen(true)} className='drawer-opener'>
          <FormatAlignLeftOutlinedIcon sx={{ width: "16px" }} />
          Script
        </ListItemIcon>
      </MenuListWrapper>
    </>
  );
};
export default TranscriptionControlls;
