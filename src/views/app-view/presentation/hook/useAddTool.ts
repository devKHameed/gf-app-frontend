import Konva from "konva";
import { Group } from "konva/lib/Group";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { nanoid } from "nanoid";
import { MutableRefObject, useCallback } from "react";
import TRIGGER from "../config/trigger";
import { getFramePos } from "../views/frame";
import useItem from "./useItem";
// import  } from "../redux/currentStageData";
export type DropCallback = (dragSrc: any, e: any) => void;
const useAddTool = (stageRef: MutableRefObject<Konva.Stage>) => {
  const { createCanvasItem, updateCanvasItem } = useItem();

  const insertImage = (e: DragEvent, data: { [key: string]: any }) => {
    console.log({ data });
    const newImage = {
      id: nanoid(),
      attrs: {
        name: "label-target",
        "data-item-type": "image",
        x: stageRef.current.width() / 2,
        y: stageRef.current.height() / 2,

        zIndex: 0,
        brightness: 0,
        _filters: ["Brighten"],
        updatedAt: Date.now(),
        ...data,
      },
      className: "sample-image",
      children: [],
    };

    createCanvasItem(newImage);
  };

  const insertText = (e: DragEvent, data: { [key: string]: any }) => {
    const newText = {
      id: nanoid(),
      attrs: {
        name: "label-target",
        "data-item-type": "text",
        width: 70,
        // width: data.text
        //   .split("")
        //   .reduce(
        //     (acc: number, curr: string) =>
        //       curr.charCodeAt(0) >= 32 && curr.charCodeAt(0) <= 126
        //         ? acc + data.fontSize * (3 / 5)
        //         : acc + data.fontSize,
        //     0,
        //   ),
        height: 20,
        fill: "#ffffff",
        // x: position.x,
        // y: position.y,
        x: stageRef.current.width() / 2,
        y: stageRef.current.height() / 2,
        fontSize: 18,
        fontFamily: "serif",
        text: "Add text",
        textAlign: "left",
        verticalAlign: "top",
        fontWeight: 400,
        // zIndex: 0,
        brightness: 0,
        updatedAt: Date.now(),
      },
      className: "sample-text",
      children: [],
    };
    createCanvasItem(newText);
  };
  const insertLink = (e: any, data: { [key: string]: any }) => {
    const newText = {
      id: nanoid(),
      attrs: {
        name: "label-target",
        "data-item-type": "link",
        width: 70,
        height: 20,
        fill: "blue",
        x: stageRef.current.width() / 2,
        y: stageRef.current.height() / 2,
        text: e?.name || "Url",
        url: e?.url || "url",
        textDecoration: "underline",
        brightness: 0,
        updatedAt: Date.now(),
      },
      className: "sample-link",
      children: [],
    };
    createCanvasItem(newText);
  };
  const insertShape = (e: any, data: { [key: string]: any }) => {
    const width = Math.sqrt(data.radius);
    const position = getFramePos(stageRef.current, e, width, width);
    const newShape = {
      id: nanoid(),
      attrs: {
        name: e!.icon || "label-target",
        "data-item-type": "shape",
        fill: "#ffffff",
        x: stageRef.current.width() / 2,
        y: stageRef.current.height() / 2,
        width: 50,
        height: 50,
        sides: data!.sides || 4,
        radius: data!.radius || 0,
        zIndex: 0,
        brightness: 0,
        updatedAt: Date.now(),
        shape_name: data.shape_name,
      },
      className: "sample-shape",
      children: [],
    };
    createCanvasItem(newShape);
  };

  const insertIcon = (e: DragEvent, data: { [key: string]: any }) => {
    const position = getFramePos(stageRef.current, e, 100, 100);
    const newIcon = {
      id: nanoid(),
      attrs: {
        name: "label-target",
        "data-item-type": "icon",
        width: 100,
        height: 100,
        fill: "#00000",
        x: position.x,
        y: position.y,
        icon: data.icon,
        brightness: 0,
        zIndex: 0,
        updatedAt: Date.now(),
      },
      className: "sample-icon",
      children: [],
    };
    createCanvasItem(newIcon);
  };

  const insertLine = (e: DragEvent, data: { [key: string]: any }) => {
    const position = getFramePos(stageRef.current, e, 100, 100);
    const curvePoints =
      data.name.indexOf("curve") !== -1
        ? data.name.indexOf("one") !== -1
          ? [110, -10]
          : [80, -10, 10, 110]
        : [];
    const newLine = {
      id: nanoid(),
      attrs: {
        name: "label-target",
        "data-item-type": "line",
        // stroke: "#000000",
        stroke: "#ffffff",

        x: position.x,
        y: position.y,
        width: 100,
        height: 100,
        points: [0, 0, ...curvePoints, 100, 100],
        arrow: data.name.indexOf("arrow") !== -1,
        curve: data.name.indexOf("curve") !== -1,
        // zIndex: 0,
        brightness: 0,
        updatedAt: Date.now(),
      },
      className: "sample-line",
      children: [],
    };
    createCanvasItem(newLine);
  };

  const onAddItem: DropCallback = (dragSrc, e) => {
    if (!stageRef.current) {
      return;
    }
    const { trigger, ...data } = dragSrc;
    data.id = nanoid();
    switch (trigger) {
      case TRIGGER.INSERT.IMAGE:
        return insertImage(e, data);
      case TRIGGER.INSERT.TEXT:
        return insertText(e, data);
      case TRIGGER.INSERT.SHAPE:
        return insertShape(e, data);
      case TRIGGER.INSERT.ICON:
        return insertIcon(e, data);
      case TRIGGER.INSERT.LINE:
        return insertLine(e, data);
      case TRIGGER.INSERT.LINK:
        return insertLink(e, data);
      default:
    }
  };

  const getItemsInThisFrame = (frame: Node<NodeConfig>) => {
    const stage = frame.getStage();
    if (!stage) {
      return;
    }
    const items = stage
      .getChildren()[0]
      .getChildren(
        (_item) =>
          _item.attrs.name === "label-target" &&
          _item.attrs["data-item-type"] !== "frame"
      )
      .filter((_item) => isInFrame(frame, _item));
    return items;
  };

  const checkIsInFrame = (item: Node<NodeConfig>) => {
    const stage = item.getStage();
    if (!stage) {
      return;
    }
    const frameGroups = stage
      .getChildren()[0]
      .getChildren((_item) => _item.attrs.name === "label-group");
    const frame = frameGroups.find((_item) => {
      const targetFrame = (_item as Group).findOne("Rect");
      if (!targetFrame) {
        return false;
      }
      return isInFrame(targetFrame, item);
    });
    if (frame) {
      (frame as Group).add(item as Shape<ShapeConfig>);
      (frame as Group).getLayer()?.batchDraw();
      return true;
    }
    return false;
  };

  const moveToLayer = (item: Shape<ShapeConfig>) => {
    const newParent = item.getLayer();
    item.getParent().children =
      (item.getParent().children as Node<NodeConfig>[])?.filter(
        (_item) => _item.id() !== item.id()
      ) ?? item.getParent().children;
    if (newParent) {
      newParent.add(item);
    }
    item.getLayer()?.batchDraw();
  };

  const onDragMoveFrame = useCallback((e: KonvaEventObject<DragEvent>) => {
    if (checkIsInFrame(e.target)) {
      return;
    }
    if (e.target.getLayer() !== e.target.getParent()) {
      moveToLayer(e.target as Shape<ShapeConfig>);
    }
  }, []);

  const onDragEndFrame = (e: KonvaEventObject<DragEvent>) => {
    e.evt.preventDefault();
    e.evt.stopPropagation();
    updateCanvasItem(e.target.id(), () => ({
      ...e.target.attrs,
    }));
    e.target.getLayer()?.batchDraw();
  };

  return {
    onAddItem,
    checkIsInFrame,
    getItemsInThisFrame,
    onDragMoveFrame,
    onDragEndFrame,
    moveToLayer,
  };
};

export default useAddTool;

const isInFrame = (targetFrame: Node<NodeConfig>, item: Node<NodeConfig>) => {
  const x = item.position().x;
  const y = item.position().y;
  const width = item.size().width;
  const height = item.size().height;
  const position = {
    x,
    y,
  };
  const size = {
    width: width * item.scaleX(),
    height: height * item.scaleY(),
  };
  return (
    (position.x >= targetFrame.x() &&
      position.x <= targetFrame.x() + targetFrame.width() &&
      position.y >= targetFrame.y() &&
      position.y <= targetFrame.y() + targetFrame.height()) ||
    (position.x + size.width >= targetFrame.x() &&
      position.x + size.width <= targetFrame.x() + targetFrame.width() &&
      position.y + size.height >= targetFrame.y() &&
      position.y + size.height <= targetFrame.y() + targetFrame.height()) ||
    (position.x >= targetFrame.x() &&
      position.x <= targetFrame.x() + targetFrame.width() &&
      position.y + size.height >= targetFrame.y() &&
      position.y + size.height <= targetFrame.y() + targetFrame.height()) ||
    (position.x + size.width >= targetFrame.x() &&
      position.x + size.width <= targetFrame.x() + targetFrame.width() &&
      position.y >= targetFrame.y() &&
      position.y <= targetFrame.y() + targetFrame.height()) ||
    (position.x + size.width / 2 >= targetFrame.x() &&
      position.x + size.width / 2 <= targetFrame.x() + targetFrame.width() &&
      position.y + size.height / 2 >= targetFrame.y() &&
      position.y + size.height / 2 <= targetFrame.y() + targetFrame.height())
  );
};
