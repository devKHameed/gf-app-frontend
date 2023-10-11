import { Box, styled } from "@mui/material";
import { createSelectorFunctions } from "auto-zustand-selectors-hook";
import useGrab from "hooks/UseGrab";
import React, { memo, useEffect, useRef } from "react";
import { useTranscriptAudioStore } from "store/stores/transcription/TranscriptData";
import useTranscriptionRef from "views/app-view/TranscriptionEditor/hooks/useTranscriptionRef";
import { Option } from "./index";
const useAudioStore = createSelectorFunctions(useTranscriptAudioStore);

const Style = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
  .waveform {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    z-index: 1;
    user-select: none;
    pointer-events: none;
  }
  .grab {
    position: relative;
    z-index: 11;
    cursor: grab;
    height: 100%;
    user-select: none;
    background-color: transparent;

    &.grabbing {
      cursor: grabbing;
    }
  }
`;

const Waveform = memo(
  ({ player, setWaveform, config, url }: any) => {
    const $waveform = useRef<WFPlayer | any>(null);
    const { waveSurferRef, setTotalDuration } = useTranscriptionRef();
    const store = useAudioStore();
    useEffect(() => {
      [...window.WFPlayer.instances]?.forEach((item) => item.destroy());
      setTotalDuration(0);
      const waveform = new window.WFPlayer({
        scrollable: true,
        useWorker: false,
        duration: 10,
        padding: 1,
        wave: true,
        pixelRatio: 2,
        container: $waveform.current,
        mediaElement: player,
        waveColor: "rgba(255, 255, 255, 0.2)",
        progressColor: "rgba(255, 255, 255, 0.5)",
        gridColor: "rgba(255, 255, 255, 0.05)",
        rulerColor: "rgba(255, 255, 255, 0.5)",
        paddingColor: "rgba(0, 0, 0, 0)",
        ...config,
      });
      setWaveform(waveform);

      waveform.on("update", (cf: any) => {
        store?.setAudioValues({ time: cf?.currentTime });
      });
      waveform.on("decode:success", (cf: any) => {
        setTotalDuration(waveform.duration || 0);
      });
      waveform.load(url);
      waveSurferRef.current = waveform;
      return () => {
        waveform?.destroy();
      };
    }, [player, $waveform, setWaveform, config, url]);
    return <Box className='waveform' ref={$waveform} />;
  },
  (pre, next) => pre?.url === next?.url
);

type RcWFPlayerType = {
  player?: any;
  setPlayer?: (player: any) => void;
  waveform?: WFPlayer | undefined;
  setWaveform?: (waveform: any) => void;
  playing?: boolean;
  setPlaying?: (playing: boolean) => void;
  config?: Option;
  subTitle?: boolean;
};

const RcWFPlayer: React.FC<RcWFPlayerType> = (props) => {
  const $footer = useRef<HTMLElement | any>();
  const { grabbing, onGrabDown, onGrabMove } = useGrab({
    ...props,
  });
  return (
    <Style className='footer' ref={$footer}>
      {props.player ? (
        <React.Fragment>
          <Waveform {...props} />
          <Box
            className={`grab ${grabbing ? "grabbing" : ""}`}
            onMouseDown={onGrabDown}
            onMouseMove={onGrabMove}
          />
        </React.Fragment>
      ) : null}
    </Style>
  );
};
export default RcWFPlayer;
