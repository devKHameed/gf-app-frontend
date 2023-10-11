import { clamp } from "lodash";
import React, { useCallback, useEffect, useState } from "react";

const useGrab = (props: any) => {
  const [grabStartX, setGrabStartX] = useState<number>(0);
  const [grabStartTime, setGrabStartTime] = useState<number>(0);
  const [grabbing, setGrabbing] = useState<boolean>(false);

  const onGrabDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (event.button !== 0) return;
      setGrabStartX(event.pageX);
      setGrabStartTime(props.player.currentTime);
      setGrabbing(true);
    },
    [props.player]
  );

  const onGrabUp = useCallback(() => {
    setGrabStartX(0);
    setGrabStartTime(0);
    setGrabbing(false);
  }, []);

  const onGrabMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (grabbing && props.player && props.waveform) {
        const currentTime = clamp(
          grabStartTime -
            ((event.pageX - grabStartX) / document.body.clientWidth) * 10,
          0,
          props.player.duration
        );
        props.player.currentTime = currentTime;
        props.waveform.seek(currentTime);
      }
    },
    [grabbing, props.player, props.waveform, grabStartX, grabStartTime]
  );

  useEffect(() => {
    document.addEventListener("mouseup", onGrabUp);
    return () => {
      document.removeEventListener("mouseup", onGrabUp);
    };
  }, [onGrabUp]);

  return { grabStartX, grabStartTime, grabbing, onGrabDown, onGrabMove };
};

export default useGrab;
