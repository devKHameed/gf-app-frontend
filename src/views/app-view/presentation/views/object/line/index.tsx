import { Context } from "konva/lib/Context";
import { Group as GroupType } from "konva/lib/Group";
import { KonvaEventObject } from "konva/lib/Node";
import { ShapeConfig, Shape as ShapeType } from "konva/lib/Shape";
import React, { RefObject, useCallback, useRef } from "react";
import { Group, Shape } from "react-konva";
import { StageDataItem } from "store/stores/presentation/StageDataList";
import useItem, {
  OverrideItemProps,
} from "views/app-view/presentation/hook/useItem";
import useTransformer from "views/app-view/presentation/hook/useTransformer";

export type LineItemKind = {
  "data-item-type": string;
  id: string;
  icon: string;
  x: number;
  y: number;
  sides: number;
  radius: number;
};

export type LineItemProps = OverrideItemProps<{
  data: StageDataItem;
  transformer: ReturnType<typeof useTransformer>;
  e?: DragEvent;
}>;

const LineItem: React.FC<LineItemProps> = ({
  data,
  e,
  transformer,
  onSelect,
}) => {
  const {
    attrs: { updatedAt, zIndex, points, ...attrs },
  } = data;
  const lineRef = useRef() as RefObject<GroupType>;
  const { updateCanvasItem } = useItem();

  const draw = (ctx: Context, shape: ShapeType<ShapeConfig>) => {
    ctx.beginPath();
    ctx.moveTo(points[0], points[1]);
    if (points.length === 4) {
      ctx.lineTo(points[2], points[3]);
    } else if (points.length === 6) {
      ctx.quadraticCurveTo(points[2], points[3], points[4], points[5]);
    } else {
      ctx.bezierCurveTo(
        points[2],
        points[3],
        points[4],
        points[5],
        points[6],
        points[7]
      );
    }
    shape.strokeWidth(4);
    ctx.fillStrokeShape(shape);
  };

  const onDragMoveFrame = useCallback((e: KonvaEventObject<DragEvent>) => {
    e.target.getLayer()?.batchDraw();
  }, []);

  const onDragEndFrame = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      e.evt.preventDefault();
      e.evt.stopPropagation();
      updateCanvasItem(e.target.id(), () => ({
        ...e.target.attrs,
      }));
      e.target.getLayer()?.batchDraw();
    },
    [data]
  );

  return (
    <Group>
      <Shape
        ref={lineRef}
        onClick={onSelect}
        sceneFunc={draw}
        name="label-target"
        data-item-type="line"
        id={data.id}
        {...attrs}
        draggable
        onDragMove={onDragMoveFrame}
        onDragEnd={onDragEndFrame}
      />
    </Group>
  );
};

export default LineItem;
