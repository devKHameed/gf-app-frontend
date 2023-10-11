import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { create } from "zustand";
export const IMAGE_ASSET_LIST_PREFIX = "IMAGE_ASSET_LIST";

export type ImageAssetListItem = {
  type: string;
  id: string;
  name: string;
  src: string;
};

type ImageAssetListState = {
  items: Record<string, ImageAssetListItem>;
};

type ImageAssetListActions = {
  initialize: (items: ImageAssetListItem[]) => void;
  addItem: (item: ImageAssetListItem | ImageAssetListItem[]) => void;
  updateItem: (item: ImageAssetListItem) => void;
  removeItem: (itemId: string | string[]) => void;
};

const useImageAssetListStore = create<
  ImageAssetListState & ImageAssetListActions
>((set, get) => ({
  items: {},

  initialize: (items) => {
    const itemsMap: Record<string, ImageAssetListItem> = {};
    items.forEach((item) => {
      itemsMap[item.id] = item;
    });
    set({ items: itemsMap });
  },

  addItem: (item) => {
    const itemsMap = { ...get().items };
    if (Array.isArray(item)) {
      item.forEach((i) => {
        itemsMap[i.id] = i;
      });
    } else {
      itemsMap[item.id] = item;
    }
    set({ items: itemsMap });
  },

  updateItem: (item) => {
    const itemsMap = { ...get().items };
    itemsMap[item.id] = item;
    set({ items: itemsMap });
  },

  removeItem: (itemId) => {
    const itemsMap = { ...get().items };
    if (Array.isArray(itemId)) {
      itemId.forEach((id) => {
        delete itemsMap[id];
      });
    } else {
      delete itemsMap[itemId];
    }
    set({ items: itemsMap });
  },
}));

export const imageAssetListSelector = (state: {
  imageAssetList: ImageAssetListState;
}) => state.imageAssetList.items;

// export const imageAssetListActions: ImageAssetListActions = {
//   initialize: (items) => useImageAssetListStore.getState().initialize(items),
//   addItem: (item) => useImageAssetListStore.getState().addItem(item),
//   updateItem: (item) => useImageAssetListStore.getState().updateItem(item),
//   removeItem: (itemId) => useImageAssetListStore.getState().removeItem(itemId),
// };
export const usePresentationImageAssetsStore = createSelectorHooks(
  useImageAssetListStore
);
