import { Box, styled } from "@mui/material";
import React, { useState } from "react";
import Player from "./Player";
import WaveForm from "./WaveForm";

export type Option = {
  container?: HTMLDivElement;
  mediaElement?: HTMLVideoElement | HTMLAudioElement;
  useWorker?: boolean;
  wave?: boolean;
  waveColor?: string;
  backgroundColor?: string;
  paddingColor?: string;
  cursor?: boolean;
  cursorColor?: string;
  progress?: boolean;
  progressColor?: string;
  grid?: boolean;
  gridColor?: string;
  ruler?: boolean;
  rulerColor?: string;
  scrollbar?: boolean;
  scrollbarColor?: string;
  rulerAtTop?: boolean;
  scrollable?: boolean;
  refreshDelay?: number;
  channel?: number;
  duration?: number;
  padding?: number;
  waveScale?: number;
  waveSize?: number;
  pixelRatio?: number;
};
type WFPlayerTYpe = {
  config?: Option;
  url?: string;
  subTitle?: boolean;
};
const Style = styled(Box)`
  .footer {
    height: 75px;
  }
`;

const WFPlayer: React.FC<WFPlayerTYpe> = (wfProps) => {
  const { config, url = "/assets/audio/transcript.mp3" } = wfProps;
  const [player, setPlayer] = useState(null);
  const [waveform, setWaveform] = useState<WFPlayer | any>(null);
  const [playing, setPlaying] = useState(false);
  const props = {
    player,
    setPlayer,
    waveform,
    setWaveform,
    playing,
    setPlaying,
    config,
    url,
  };

  return (
    <Style>
      <Player {...props} />
      <WaveForm {...props} />
    </Style>
  );
};
export default WFPlayer;
