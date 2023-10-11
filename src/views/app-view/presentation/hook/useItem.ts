import Konva from "konva";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";

import { createSelectorFunctions } from "auto-zustand-selectors-hook";

import usePresentation from "hooks/usePresentation";
import { useCallback } from "react";
import {
  StageDataItem,
  useStageStore,
} from "store/stores/presentation/StageDataList";
import { useSlideSelectedItemsStore } from "store/stores/presentation/selectedStage";
import useSelection from "./useSelection";

export type ItemData = {
  "data-item-type": string;
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  draggable: boolean;
} & Node<NodeConfig>[] &
  Record<string, any>;

export type ItemProps = {
  key: string;
  data: ItemData;
  e?: Event;
} & Record<string, any>;

export type OverrideItemProps<T> = Omit<ItemProps, keyof T> &
  T &
  Pick<ITEMS_CONTEXT, "onSelect">;

export type OverrideItemData<T> = Omit<ItemData, keyof T> & T;

export type ITEMS_CONTEXT = {
  selectedItems: Konva.Node[];
  onCreate: (newItem: StageDataItem) => void;
  onDelete: (targetItemId: string | string[]) => void;
  onSelect: (e?: KonvaEventObject<MouseEvent>, itemList?: Konva.Node[]) => void;
  onClear: () => void;
  onAlter: (dataList: StageDataItem[]) => void;
};
const useSelectedStore = createSelectorFunctions(useSlideSelectedItemsStore);
const useStore = createSelectorFunctions(useStageStore);
const useItem = () => {
  const { transformer } = usePresentation();
  const { clearSelection } = useSelection(transformer);
  const store = useStore();
  const selectedStore = useSelectedStore();
  const createCanvasItem = useCallback((newItem: StageDataItem) => {
    store.addCanvasItem(newItem);
  }, []);

  const updateCanvasItem = (
    id: string,
    attrsFunc: (attrs: StageDataItem["attrs"]) => StageDataItem["attrs"]
  ) => {
    // const targetItem = stageData.find(
    //   (data) => data.id === id || data.attrs.id === id
    // );

    const targetItem = store.stageList[store.activeSlide]?.slide_design?.find(
      (a) => a.id === id
    );
    const updatedObject = {
      ...(targetItem ?? {}),
      attrs: {
        ...(targetItem ? targetItem.attrs : {}),
        ...attrsFunc(targetItem),
      },
    } as StageDataItem;
    store.updateCanvasItem(updatedObject);

    selectedStore.updateSelectedItems(updatedObject.attrs);
  };

  const removeCanvasItem = (targetItemId: string | string[]) => {
    store.removeCanvasItem(targetItemId);
    clearSelection();
  };
  const alterCanvasItems = (dataList: StageDataItem[]) => {
    store.clearCanvasItems();
    store.addCanvasItem(dataList);
  };
  const clearCanvasItems = useCallback(() => {
    store.clearCanvasItems();
  }, []);

  return {
    slideData: store.stageList?.[store?.activeSlide || ""],
    createCanvasItem,
    updateCanvasItem,
    removeCanvasItem,
    alterCanvasItems,
    clearCanvasItems,
  };
};

export default useItem;
