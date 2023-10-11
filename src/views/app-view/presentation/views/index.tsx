import { useEffect, useMemo } from "react";
import { Transformer } from "react-konva";
import useItem from "../hook/useItem";
import useSelection from "../hook/useSelection";

import View from "./StageView";
import Frame, { FrameProps } from "./frame";

import usePresentation from "hooks/usePresentation";
import { StageDataItem } from "store/stores/presentation/StageDataList";
import ImageItem, { ImageItemProps } from "./object/image";
import LineItem, { LineItemProps } from "./object/line";
import AddLink from "./object/link";
import ShapeItem, { ShapeItemProps } from "./object/shape";
import TextItem, { TextItemProps } from "./object/text";

export type FileKind = {
  "file-id": string;
  title: string;
  data: Record<string, any>[];
};

export type FileData = Record<string, FileKind>;

function Presentation() {
  const { stage, transformer } = usePresentation();
  const { onSelectItem } = useSelection(transformer);
  const { slideData } = useItem();

  const sortedStageData = useMemo(
    () =>
      [...(slideData?.slide_design || [])].sort((a, b) => {
        if (a.attrs.zIndex === b.attrs.zIndex) {
          if (a.attrs.zIndex < 0) {
            return b.attrs.updatedAt - a.attrs.updatedAt;
          }
          return a.attrs.updatedAt - b.attrs.updatedAt;
        }
        return a.attrs.zIndex - b.attrs.zIndex;
      }),

    [slideData]
  );

  const renderObject = (item: StageDataItem) => {
    switch (item.attrs["data-item-type"]) {
      case "frame":
        return (
          <Frame
            key={`frame-${item.id}`}
            data={item as FrameProps["data"]}
            onSelect={onSelectItem}
          />
        );
      case "image":
        return (
          <ImageItem
            key={`image-${item.id}`}
            data={item as ImageItemProps["data"]}
            onSelect={onSelectItem}
          />
        );
      case "text":
        return (
          <TextItem
            key={`image-${item.id}`}
            data={item as TextItemProps["data"]}
            transformer={transformer}
            onSelect={onSelectItem}
          />
        );
      case "shape":
        return (
          <ShapeItem
            key={`shape-${item.id}`}
            data={item as ShapeItemProps["data"]}
            transformer={transformer}
            onSelect={onSelectItem}
          />
        );

      case "line":
        return (
          <LineItem
            key={`line-${item.id}`}
            data={item as LineItemProps["data"]}
            transformer={transformer}
            onSelect={onSelectItem}
          />
        );
      case "link":
        return (
          <AddLink
            key={`line-${item.id}`}
            data={item as LineItemProps["data"]}
            transformer={transformer}
            onSelect={onSelectItem}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    stage.stageRef.current.setPosition({
      x: Math.max(Math.ceil(stage.stageRef.current.width() - 1280) / 2, 0),
      y: Math.max(Math.ceil(stage.stageRef.current.height() - 760) / 2, 0),
    });
    stage.stageRef.current.batchDraw();
  }, []);

  return (
    <>
      <View onSelect={onSelectItem}>
        {sortedStageData?.length
          ? sortedStageData.map((item) => renderObject(item))
          : null}
        <Transformer
          ref={transformer.transformerRef}
          keepRatio
          // shouldOverdrawWholeArea
          boundBoxFunc={(_, newBox) => newBox}
          onTransformEnd={transformer.onTransformEnd}
        />
      </View>
    </>
  );
}

export default Presentation;
