import { createSelectorFunctions } from "auto-zustand-selectors-hook";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

import React, { RefObject, useCallback, useEffect, useRef } from "react";
import { Text as KonvaText } from "react-konva";
import { StageDataItem } from "store/stores/presentation/StageDataList";
import { useModalOpenStore } from "store/stores/presentation/modal";
import useItem, {
  OverrideItemProps,
} from "views/app-view/presentation/hook/useItem";
import useTransformer from "views/app-view/presentation/hook/useTransformer";
const useStore = createSelectorFunctions(useModalOpenStore);

export type TextItemKind = {
  "data-item-type": string;
  id: string;
  name: string;
  text: string;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
};

export type TextItemProps = OverrideItemProps<{
  data: StageDataItem;
  transformer: ReturnType<typeof useTransformer>;
  e?: DragEvent;
}>;

const AddLink: React.FC<TextItemProps> = ({
  data,
  e,
  transformer,
  onSelect,
}) => {
  const store = useStore();
  const { attrs } = data;
  const textRef = useRef() as RefObject<Konva.Text>;
  const { updateCanvasItem } = useItem();
  useEffect(() => {
    textRef.current?.on("dblclick dbltap", function () {
      onEditStart();
    });
    textRef.current?.on("transform", function () {
      // reset scale, so only with is changing by transformer
      textRef.current?.setAttrs({
        width: textRef.current?.width() * textRef.current?.scaleX(),

        height: textRef.current?.height() * textRef.current?.scaleY(),
        scaleX: 1,
        scaleY: 1,
      });
      const node = textRef?.current;
      // if (node) {
      //   updateCanvasItem(textRef.current!.id(), () => ({
      //     ...node!.attrs,
      //     scaleX: 1,
      //     width: node?.width() * node?.scaleX(),
      //     height: node.height() * node?.scaleY(),
      //     updatedAt: Date.now(),
      //   }));
      // }
    });
    return () => {
      textRef.current?.removeEventListener("dblclick");
      textRef.current?.removeEventListener("dbltap");
      textRef.current?.removeEventListener("transform");
    };
  }, []);
  const onEditStart = () => {
    if (textRef.current === null) {
      console.error("textRef is null");
      return;
    }
    store.setIsModalOpen(true);
    store.setHyperLinkValues({ text: attrs.text, url: attrs.url });
  };
  const onDragMoveFrame = useCallback((e: KonvaEventObject<DragEvent>) => {
    e.target.getLayer()?.batchDraw();
  }, []);

  const onDragEndFrame = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      e.evt.preventDefault();
      e.evt.stopPropagation();
      console.log(e.target.attrs);
      updateCanvasItem(e.target.id(), () => ({
        ...e.target.attrs,
      }));
      e.target.getLayer()?.batchDraw();
    },
    [data]
  );

  const onClickText = (e: KonvaEventObject<MouseEvent>) => {
    onSelect(e);
  };
  return (
    <KonvaText
      {...attrs}
      ref={textRef}
      text={attrs.text}
      fontFamily={attrs.fontFamily}
      fontSize={attrs.fontSize}
      onClick={onClickText}
      name="label-target"
      data-item-type="link"
      data-frame-type="text"
      id={data.id}
      x={attrs.x}
      y={attrs.y}
      align={attrs.align ?? "left"}
      verticalAlign={attrs.verticalAlign ?? "middel"}
      width={attrs.width}
      height={attrs.height}
      scaleX={attrs.scaleX}
      scaleY={attrs.scaleY}
      fill={attrs.fill ?? "#000000"}
      stroke={attrs.stroke ?? null}
      strokeWidth={attrs.stroke ? 1 : undefined}
      opacity={attrs.opacity ?? 1}
      rotation={attrs.rotation ?? 0}
      draggable
      onDragMove={onDragMoveFrame}
      onDragEnd={onDragEndFrame}
    />
  );
};

export default AddLink;
