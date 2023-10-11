import { Stage } from "konva/lib/Stage";
import { Vector2d } from "konva/lib/types";
import { MutableRefObject, useRef } from "react";

export const STAGE_POSITION = "stagePosition";
export const STAGE_SCALE = "stageScale";
export type IStageType = {
  setStageRef: (stage: Stage) => void;
  stageRef: MutableRefObject<Stage>;
  dragBackgroundOrigin: MutableRefObject<Vector2d>;
};
const useStage = () => {
  const stageRef = useRef() as MutableRefObject<Stage>;
  const dragBackgroundOrigin = useRef<Vector2d>({ x: 0, y: 0 });

  const setStageRef = (stage: Stage) => {
    stageRef.current = stage;
  };

  return {
    setStageRef,
    stageRef,
    dragBackgroundOrigin,
  };
};

export default useStage;
