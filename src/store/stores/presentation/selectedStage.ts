import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { Node, NodeConfig } from "konva/lib/Node";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
export const STAGE_PREFIX = "STAGE";
export type StageData = {
  currentSelectedItems: any;
};

type Actions = {
  setSelectedItems(items: Node<NodeConfig>[]): void;
  updateSelectedItems(items: Node<NodeConfig>[] | Node<NodeConfig>[]): void;
};

const useSelectedItems = create<StageData & Actions>()(
  devtools(
    immer<StageData & Actions>((set, get) => ({
      currentSelectedItems: [],
      setSelectedItems: (items) => {
        set({ currentSelectedItems: items });
      },
      updateSelectedItems: (payload) => {
        set((state) => {
          const items = Array.isArray(payload) ? payload : [payload];
          const data = [...get().currentSelectedItems];

          items.forEach((item) => {
            const isExist = data.findIndex((a) => a.id === item.id);
            if (isExist > -1) {
              data[isExist] = { ...data[isExist], ...item };
            }
          });
          state.currentSelectedItems = data;
        });
      },
    }))
  )
);

export const useSlideSelectedItemsStore = createSelectorHooks(useSelectedItems);
