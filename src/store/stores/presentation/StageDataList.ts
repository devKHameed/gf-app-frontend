import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { OverrideItemData } from "views/app-view/presentation/hook/useItem";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { addHistoryItem } from "./workhistory";

export const STAGE_LIST_PREFIX = "STAGE_LIST";
export type StageDataItem = {
  id: string;
  attrs: OverrideItemData<any>;

  className: string;
  children?: StageDataItem[];
};
export type StageDataListItem = Partial<
  Omit<PresentationSlide, "slide_design">
> & {
  slide_design: StageDataItem[];
  sort_order?: number;
  thumbnail?: string;
};
export type StageHistoryItem = {
  past: StageDataItem[][];
  future: StageDataItem[][];
};
type StageDateType = Record<string | any, StageDataListItem>;
export type StageDataList = {
  stageList: StageDateType;
  stageIds: { id: string }[];
  activeSlide: string;
  activeCanvasItem?: string;
};

type Actions = {
  initialize(list: StageDataListItem[]): void;
  addItem(items: StageDataListItem | StageDataListItem[]): void;
  updateItem(items: StageDataListItem | StageDataListItem[]): void;
  removeItem(items: string | string[]): void;
  clearItems(): void;
  setActiveSlide(slideId: string): void;
  updateOrCreatePreview(
    slideData: Pick<StageDataListItem, "id" | "thumbnail">
  ): void;
  addCanvasItem(items: StageDataItem | StageDataItem[]): void;
  updateCanvasItem(items: StageDataItem | StageDataItem[]): void;
  removeCanvasItem(items: string | string[]): void;
  clearCanvasItems(): void;
  sortItems(items: { id: string }[]): void;
  setActiveCanvasItem(slideId: string): void;
  setStageList(list: StageDateType): void;
};

const useStageStoreBase = create<StageDataList & Actions>()(
  devtools(
    immer<StageDataList & Actions>((set, get) => ({
      stageList: {},
      stageIds: [],
      activeSlide: "",
      activeCanvasItem: "",

      addCanvasItem: (payload) => {
        set((state) => {
          const items = Array.isArray(payload) ? payload : [payload];

          const nextState = { ...get().stageList };
          const newItem = { ...nextState[state.activeSlide] };
          if (newItem) {
            const data = [...(newItem.slide_design || [])];
            items.forEach((item) => {
              data.push(item);
            });
            newItem.slide_design = data;
            state.stageList[state.activeSlide] = newItem;
          }
        });
      },
      updateCanvasItem: (payload) => {
        set((state) => {
          const items = Array.isArray(payload) ? payload : [payload];
          const nextState = { ...get().stageList };
          const item = { ...nextState[state.activeSlide] };
          if (item) {
            const data = [...(item.slide_design || [])];
            items.forEach((item) => {
              const isExist = data.findIndex((a) => a.id === item.id);
              if (isExist > -1) {
                data[isExist] = { ...data[isExist], ...item };
              }
            });
            item.slide_design = data;
            state.stageList[state.activeSlide] = item;
          }
        });
      },
      removeCanvasItem: (payload) => {
        set((state) => {
          const ids = Array.isArray(payload) ? payload : [payload];
          const nextState = { ...get().stageList };
          const item = { ...nextState[state.activeSlide] };
          if (item) {
            const data = [...(item.slide_design || [])];
            ids.forEach((id) => {
              const index = data.findIndex((a) => a.id === id);
              if (index > -1) {
                data.splice(index, 1);
              }
            });
            item.slide_design = data;
            state.stageList[state.activeSlide] = item;
          }
        });
      },
      sortItems: (payload) => {
        set((state) => {
          state.stageIds = payload;
        });
      },
      clearCanvasItems: () => {
        set((state) => {
          const item = { ...(state.stageList?.[state.activeSlide] || {}) };
          if (item?.slug) {
            item.slide_design = [];
            item.thumbnail = "";
            state.stageList[state.activeSlide] = item;
          }
        });
      },
      setActiveCanvasItem: (id) => {
        set((state) => {
          state.activeCanvasItem = id;
        });
      },
      initialize: (payload) => {
        const items = Array.isArray(payload) ? payload : [payload];

        const nextState = { ...get().stageList };
        const newIds = [...(get().stageIds || [])];

        items.forEach((item) => {
          const newItem = nextState[item.slug as string];

          if (!newItem) {
            nextState[item.slug as string] = { ...item };
            newIds.push({ id: item.slug as string });
          }

          addHistoryItem({
            id: item.slug as string,
            history: {
              past: [],
              future: [],
            },
          });
        });
        set({
          stageList: nextState,
          stageIds: newIds,
          activeSlide: !!newIds?.length ? newIds[0].id : "",
        });
      },
      addItem: (payload) => {
        const items = Array.isArray(payload) ? payload : [payload];
        const nextState = { ...get().stageList };
        const stateIds = [...(get().stageIds || [])];

        items.forEach((item) => {
          const newItem = nextState[item.slug as string];
          if (!newItem) {
            nextState[item.slug as string] = { ...item };
            stateIds.push({ id: item.slug as string });
          }
          addHistoryItem({
            id: item.slug as string,
            history: {
              past: [],
              future: [],
            },
          });
        });
        set((state) => ({
          ...state,
          stageList: nextState,
          stageIds: stateIds,
          activeCanvasItem: "",
        }));
      },
      updateItem: (payload) => {
        const items = Array.isArray(payload) ? payload : [payload];
        const nextState = { ...get().stageList };
        items.forEach((item) => {
          nextState[item.slug as string] = {
            ...nextState[item.slug as string],
            ...item,
          };
        });
        set((state) => ({ ...state, stageList: nextState }));
      },
      updateOrCreatePreview: (payload) => {
        const items = Array.isArray(payload) ? payload : [payload];
        const nextState = { ...get().stageList };
        items.forEach((item: any) => {
          nextState[item.slug] = { ...nextState[item.slug], ...item };
        });

        set((state) => ({ ...state, stageList: nextState }));
      },
      setActiveSlide: (slideId) => {
        set((state) => {
          if (state.stageList[slideId]) {
            state.activeSlide = slideId;
          }
        });
      },

      removeItem: (payload) => {
        const ids = Array.isArray(payload) ? payload : [payload];
        const nextState = { ...get().stageList };
        const stateIds = [...(get().stageIds || [])];
        ids.forEach((id) => {
          const isExist = nextState[id];
          if (!!isExist) {
            delete nextState[id];
            const index = stateIds.findIndex((a) => a.id === id);
            if (index > -1) {
              stateIds.splice(index, 1);
            }
          }
        });
        set((state) => {
          state.stageList = nextState;
          state.stageIds = stateIds;
        });
      },
      setStageList(payload) {
        set((state) => {
          state.stageList = payload;
        });
      },
      clearItems() {
        set((state) => {
          state.stageList = {};
          state.stageIds = [];
          state.activeSlide = "";
        });
      },
    }))
  )
);

export const useStageStore = createSelectorHooks(useStageStoreBase);
