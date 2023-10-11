import { Rect as RectType } from "konva/lib/shapes/Rect";
import { RegularPolygon as RegularPolygonType } from "konva/lib/shapes/RegularPolygon";
import React, { RefObject, useEffect, useRef } from "react";
import { Rect, RegularPolygon } from "react-konva";
import { StageDataItem } from "store/stores/presentation/StageDataList";
import useDragAndDrop from "views/app-view/presentation/hook/useDragAndDrop";
import useItem, {
  OverrideItemProps,
} from "views/app-view/presentation/hook/useItem";
import useStage from "views/app-view/presentation/hook/useStage";
import useTransformer from "views/app-view/presentation/hook/useTransformer";

export type ShapeItemKind = {
  "data-item-type": string;
  id: string;
  icon: string;
  x: number;
  y: number;
  sides: number;
  radius: number;
};

export type ShapeItemProps = OverrideItemProps<{
  data: StageDataItem;
  transformer: ReturnType<typeof useTransformer>;
  e?: DragEvent;
}>;

const ShapeItem: React.FC<ShapeItemProps> = ({
  data,
  e,
  transformer,
  onSelect,
}) => {
  const { attrs } = data;

  const shapeRef = useRef() as RefObject<RegularPolygonType | RectType>;
  const stage = useStage();
  const { onDragMoveFrame, onDragEndFrame, checkIsInFrame } = useDragAndDrop(
    stage.stageRef,
    stage.dragBackgroundOrigin
  );

  const { updateCanvasItem } = useItem();
  const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current && shapeRef.current) {
      isMounted.current = true;
      const node: any = shapeRef?.current;
      const clientRect = shapeRef.current?.getClientRect();
      updateCanvasItem(shapeRef.current!.id(), () => ({
        ...node!.attrs,
        width: clientRect!.width * (node?.scaleX() || 1),

        height: clientRect!.height * (node?.scaleY() || 1),
        scaleX: 1,
        scaleY: 1,
        updatedAt: Date.now(),
        clientX: clientRect.x,
        clientY: clientRect.y,
        radius: node?.attrs.radius * (node?.scaleX() || 1),
      }));
    }
    return () => {};
  }, [data]);

  useEffect(() => {
    if (shapeRef.current) {
      stage.setStageRef(shapeRef.current.getStage()!);
      checkIsInFrame(shapeRef.current);

      shapeRef.current?.on("transformend", function (e) {
        // reset scale, so only with is changing by transformer
        const node = shapeRef?.current;
        console.log({
          ref: shapeRef.current,
          bou: shapeRef.current?.getClientRect(),
          // size: node?.getSize(),
          e,
          node,
        });
        const clientRect = shapeRef.current?.getClientRect();
        shapeRef.current?.setAttrs({
          // width: clientRect!.width,
          // height: clientRect!.height,
          scaleX: 1,
          scaleY: 1,
          clientX: clientRect!.x,
          clientY: clientRect!.y,
          radius: node?.attrs.radius * (node?.scaleX() || 1),
        });

        updateCanvasItem(shapeRef.current!.id(), () => ({
          ...node!.attrs,
          width: clientRect!.width,

          height: clientRect!.height,
          scaleX: 1,
          scaleY: 1,
          updatedAt: Date.now(),
          clientX: clientRect!.x,
          clientY: clientRect!.y,
          radius: node?.attrs.radius * (node?.scaleX() || 1),
        }));
      });

      // });
      return () => {
        shapeRef.current?.removeEventListener("transformend");
      };
    }
  }, [data]);

  if (attrs.sides === 4) {
    return (
      <Rect
        ref={shapeRef as RefObject<RectType>}
        onClick={onSelect}
        name="label-target"
        data-item-type="shape"
        data-item-shape={attrs.shape_name}
        id={data.id}
        x={attrs.x}
        y={attrs.y}
        width={attrs.width}
        height={attrs.height}
        // width={Math.sqrt(attrs.radius * 2)}
        // height={Math.sqrt(attrs.radius * 2)}
        sides={attrs.sides}
        radius={attrs.radius}
        scaleX={attrs.scaleX}
        scaleY={attrs.scaleY}
        fill={attrs.fill ?? "#000000"}
        stroke={attrs.stroke ?? null}
        strokeWidth={attrs.stroke ? 5 : undefined}
        opacity={attrs.opacity ?? 1}
        rotation={attrs.rotation ?? 0}
        draggable
        onDragMove={onDragMoveFrame}
        onDragEnd={onDragEndFrame}
      />
    );
  }
  return (
    <RegularPolygon
      ref={shapeRef as RefObject<RegularPolygonType>}
      onClick={onSelect}
      name="label-target"
      data-item-type="shape"
      id={data.id}
      data-item-shape={attrs.shape_name}
      x={attrs.x}
      y={attrs.y}
      // width={attrs.width}
      // height={attrs.height}
      sides={attrs.sides}
      radius={attrs.radius}
      scaleX={attrs.scaleX}
      scaleY={attrs.scaleY}
      fill={attrs.fill ?? "#000000"}
      stroke={attrs.stroke ?? null}
      strokeWidth={attrs.stroke ? 5 : undefined}
      opacity={attrs.opacity ?? 1}
      rotation={attrs.rotation ?? 0}
      draggable
      onDragMove={onDragMoveFrame}
      onDragEnd={onDragEndFrame}
    />
  );
};

export default ShapeItem;
