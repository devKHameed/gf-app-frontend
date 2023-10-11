import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { RefObject, useCallback, useRef } from "react";
import transformerList from "../config/transformer.json";
import useItem from "./useItem";
const useMemoizedStoreProp = () => {
  const updateCanvasItem = useItem().updateCanvasItem;
  const useStore = useCallback(() => updateCanvasItem, []);
  return useStore;
};
const useTransformer = () => {
  const transformerRef = useRef() as RefObject<Konva.Transformer>;
  const updateCanvasItem = useMemoizedStoreProp()();

  const onTransformEnd = (e: KonvaEventObject<Event>) => {
    updateCanvasItem(e.target.id(), () => ({
      ...e.target.attrs,
      updatedAt: Date.now(),
    }));
    e.target.getStage()?.batchDraw();
  };

  const setTransformerConfig = useCallback((transformer: Konva.Transformer) => {
    let nodeStatus = "default";
    if (transformer.nodes().length === 1) {
      nodeStatus = transformer.getNode().attrs["data-item-type"];
    }

    for (const field in (
      transformerList as Record<string, Konva.TransformerConfig>
    )[nodeStatus]) {
      transformer.attrs[field] = (
        transformerList as Record<string, Konva.TransformerConfig>
      )[nodeStatus][field];
    }
    transformer.update();
  }, []);

  return {
    transformerRef,
    onTransformEnd,
    setTransformerConfig,
  };
};

export default useTransformer;
