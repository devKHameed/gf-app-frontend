import { memo, useCallback, useEffect, useRef } from "react";
import { isPlaying } from "utils";

const VideoWrap = memo(
  ({ setPlayer, setCurrentTime, setPlaying, url }: any) => {
    const $video = useRef<HTMLMapElement | any>();
    useEffect(() => {
      setPlayer($video.current);
      (function loop() {
        window.requestAnimationFrame(() => {
          if ($video.current) {
            setPlaying(isPlaying($video.current));
          }
          loop();
        });
      })();
    }, [setPlayer, setCurrentTime, setPlaying, $video, url]);

    const onClick = useCallback(() => {
      if ($video.current) {
        if (isPlaying($video.current)) {
          $video.current?.pause();
        } else {
          $video.current?.play();
        }
      }
    }, [$video]);

    return (
      <video
        controls
        style={{ display: "none" }}
        id='wf-video-player'
        onClick={onClick}
        src={url || "/assets/audio/transcript.mp3"}
        ref={$video}
      />
    );
  },
  (pre, next) => pre?.url === next?.url
);

export default function Player(props: any) {
  const $player = useRef<HTMLMapElement | any>();

  return (
    <div className='video' ref={$player}>
      <VideoWrap {...props} />
    </div>
  );
}
