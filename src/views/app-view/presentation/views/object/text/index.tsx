import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import React, { RefObject, useCallback, useEffect, useRef } from "react";
import { Text as KonvaText } from "react-konva";
import { StageDataItem } from "store/stores/presentation/StageDataList";
import useItem, {
  OverrideItemProps,
} from "views/app-view/presentation/hook/useItem";
import useTransformer from "views/app-view/presentation/hook/useTransformer";

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

const TextItem: React.FC<TextItemProps> = ({
  data,
  e,
  transformer,
  onSelect,
}) => {
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
  const createTExtARea = (id = "temptextarea") => {
    const textarea = document.createElement("pre");
    document.body.appendChild(textarea);
    const keys = Object.keys(textRef.current!.attrs || {});
    keys?.forEach((k) => {
      textarea.style[k as any] = textRef.current?.attrs[k];
    });
    const fontStyle = textRef.current!.attrs["fontStyle"];
    const fontWeight = textRef.current!.attrs["fontWeight"] || 400;
    const newFontSTyle = fontStyle?.replace(fontWeight, "");
    textarea.style.fontStyle = newFontSTyle;
    textarea.style.fontWeight = fontWeight;
    const stage = textRef.current!.getStage();
    textarea.id = id;
    textarea.innerText = textRef.current!.text() + " ";
    textarea.style.display = "inline-block";
    textarea.style.zIndex = "100";
    textarea.style.position = "absolute";
    textarea.style.top = `${0}px`;
    textarea.style.left = `${0}px`;
    textarea.style.fontSize = `${
      textRef.current!.fontSize() * stage!.scaleY() * textRef.current!.scaleY()
    }px`;
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    // textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = textRef.current!.lineHeight().toString();
    textarea.style.fontFamily = textRef.current!.fontFamily();
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = textRef.current!.align();
    textarea.style.color = textRef.current!.fill();
    textarea.style.visibility = "hidden";
  };
  const onEditStart = () => {
    if (textRef.current === null) {
      console.error("textRef is null");
      return;
    }
    const area = document.getElementById("temptextarea");
    let areael = document.getElementById("widthtextarea");
    if (area) {
      area?.parentNode?.removeChild(area);
    }
    if (areael) {
      areael?.parentNode?.removeChild(areael);
    }
    // createTExtARea("widthtextarea");
    areael = document.getElementById("widthtextarea");
    textRef.current.hide();
    transformer.transformerRef.current!.hide();
    const textPosition = textRef.current.absolutePosition();
    const stage = textRef.current.getStage();
    const container = stage!.container().getBoundingClientRect();
    const areaPosition = {
      x: container.x + textPosition.x,
      y: container.y + textPosition.y,
    };
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    const keys = Object.keys(textRef.current.attrs || {});
    keys.forEach((k) => {
      textarea.style[k as any] = textRef.current?.attrs[k];
    });
    const fontStyle = textRef.current.attrs["fontStyle"];
    const fontWeight = textRef.current.attrs["fontWeight"] || 400;
    const newFontSTyle = fontStyle?.replace(fontWeight, "");
    textarea.style.fontStyle = newFontSTyle;
    console.log({ fontStyle });
    textarea.style.fontWeight = fontWeight;
    textarea.id = "current_text_editor";
    textarea.value = textRef.current.text();
    textarea.style.zIndex = "100";
    textarea.style.position = "absolute";
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.fontSize = `${
      textRef.current.fontSize() * stage!.scaleY() * textRef.current.scaleY()
    }px`;
    // textarea.style.width = `${textarea.value
    //   .split("\n")
    //   .sort((a, b) => b.length - a.length)[0]
    //   .split("")
    //   .reduce(
    //     (acc, curr) =>
    //       curr.charCodeAt(0) >= 32 && curr.charCodeAt(0) <= 126
    //         ? acc +
    //           textRef.current!.fontSize() *
    //             stage!.scaleY() *
    //             textRef.current!.scaleY() *
    //             (3 / 5)
    //         : acc +
    //           textRef.current!.fontSize() *
    //             stage!.scaleY() *
    //             textRef.current!.scaleY(),
    //     0
    //   )}px`;
    textarea.style.width =
      textRef.current.width() - textRef.current.padding() * 2 + "px";
    textarea.style.height = `${
      textRef.current.height() + textRef.current.padding() * 2 + 5
    }px`;
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = textRef.current.lineHeight().toString();
    textarea.style.fontFamily = textRef.current.fontFamily();
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = textRef.current.align();
    textarea.style.color = textRef.current.fill();
    const rotation = textRef.current.rotation();
    let transform = "";
    if (rotation) {
      transform += `rotateZ(${rotation}deg)`;
    }

    let px = 0;
    // also we need to slightly move textarea on firefox
    // because it jumps a bit
    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    if (isFirefox) {
      px += 2 + Math.round(textRef.current.fontSize() / 20);
    }
    transform += `translateY(-${px}px)`;

    textarea.style.transform = transform;

    // reset height
    textarea.style.height = "auto";
    // after browsers resized it we can set actual value
    textarea.style.height = `${textarea.scrollHeight + 3}px`;

    textarea.focus();
    function removeTextarea() {
      window.removeEventListener("click", handleOutsideClick);
      createTExtARea();
      const area = document.getElementById("temptextarea");
      const width =
        area?.getBoundingClientRect().width ||
        textarea.getBoundingClientRect().width;
      area?.parentNode?.removeChild(area);
      textRef!.current!.show();
      transformer.transformerRef.current!.show();

      updateCanvasItem(textRef.current!.id(), () => ({
        ...textRef.current!.attrs,
        width: width / stage!.scaleY() / textRef.current!.scaleY(),
        // height: height,
        height:
          textarea.value.split("\n").length * textRef.current!.fontSize() * 1.2,
        updatedAt: Date.now(),
      }));
      transformer.transformerRef.current?.forceUpdate();
      textarea.parentNode!.removeChild(textarea);
    }

    function setTextareaWidth() {
      let newWidth = textarea.value
        .split("\n")
        .sort((a, b) => b.length - a.length)[0]
        .split("")
        .reduce(
          (acc, curr) =>
            curr.charCodeAt(0) >= 32 && curr.charCodeAt(0) <= 126
              ? acc +
                textRef.current!.fontSize() *
                  stage!.scaleY() *
                  textRef.current!.scaleY() *
                  (3 / 5)
              : acc +
                textRef.current!.fontSize() *
                  stage!.scaleY() *
                  textRef.current!.scaleY(),
          0
        );
      createTExtARea();
      const areael = document.getElementById("temptextarea");

      if (areael) {
        areael.innerText = textarea.value;
        newWidth =
          (areael?.getBoundingClientRect().width ||
            textarea.getBoundingClientRect().width) +
          textRef.current!.fontSize() *
            stage!.scaleY() *
            textRef.current!.scaleY();
        areael?.parentNode?.removeChild(areael);
      }
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      const isFirefox =
        navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isSafari || isFirefox) {
        newWidth = Math.ceil(newWidth);
      }
      textarea.style.width = `${newWidth}px`;
    }

    textarea.addEventListener("keydown", (e) => {
      // hide on enter
      // but don't hide on shift + enter
      if (e.keyCode === 13 && !e.shiftKey) {
        textRef!.current!.text(textarea.value);
        removeTextarea();
      }
      // on esc do not set value back to node
      if (e.keyCode === 27) {
        removeTextarea();
      }
    });

    textarea.addEventListener("keydown", (e) => {
      setTextareaWidth();
      textarea.style.height = "auto";
      textarea.style.height = `${
        textarea.scrollHeight + textRef!.current!.fontSize()
      }px`;
    });

    function handleOutsideClick(e: MouseEvent) {
      if (areael) {
        document.body.removeChild(areael);
      }
      if (e.target !== textarea) {
        textRef!.current!.text(textarea.value);
        removeTextarea();
      }
    }

    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    });
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
    // if (e.evt.detail === 1) {
    //   setTimeout(() => {
    //     if (document.getElementById("current_text_editor")) {
    //       return;
    //     }
    onSelect(e);
    // }, 200);
    // }
  };

  return (
    <>
      <KonvaText
        {...attrs}
        ref={textRef}
        text={attrs.text}
        fontFamily={attrs.fontFamily}
        fontSize={attrs.fontSize}
        onClick={onClickText}
        name="label-target"
        data-item-type="text"
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
    </>
  );
};

export default TextItem;
