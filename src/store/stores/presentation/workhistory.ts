import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { StageDataItem } from "./StageDataList";

export const STAGE_LIST_PREFIX = "STAGE_LIST";

export type StageHistoryItem = {
  past: StageDataItem[][];
  future: StageDataItem[][];
};
export type StageDataList = {
  history: Record<string, StageHistoryItem>;
  slideId: string;
  current: StageDataItem[];
  allowPastHistory?: boolean;
};

type Actions = {
  updateCanvasItemsPastHistory(items: StageDataItem[][]): void;
  updateCanvasItemsFutrueHistory(items: StageDataItem[][]): void;
  addCurrent(items: StageDataItem[]): void;
  clearActiveSlideHistory(slideId?: string): void;
  setSlideId(slideId?: string): void;
  setAllowWorkHistory(allowWorkHistory: boolean): void;
};

const useWorkHistoryStoreBase = create<StageDataList & Actions>()(
  devtools(
    immer<StageDataList & Actions>((set, get) => ({
      history: {},
      slideId: "",
      current: [],
      allowPastHistory: true,
      clearActiveSlideHistory: (slideId) => {
        set((state) => {
          const activeSlide = slideId || state.slideId;

          const activeSlideHistory = {
            ...(get().history?.[activeSlide] || {}),
          };

          if (!!activeSlideHistory) {
            state.history[activeSlide] = { past: [], future: [] };
          }
        });
      },
      updateCanvasItemsPastHistory: (payload) => {
        set((state) => {
          const items = Array.isArray(payload) ? payload : [payload];

          const activeSlideHistory = {
            ...(get().history?.[state.slideId] || {}),
          };
          if (!!activeSlideHistory) {
            state.history[state.slideId].past = items;
          }
        });
      },
      updateCanvasItemsFutrueHistory: (payload) => {
        set((state) => {
          const items = Array.isArray(payload) ? payload : [payload];

          const activeSlideHistory = {
            ...(get().history?.[state.slideId] || {}),
          };

          if (!!activeSlideHistory) {
            state.history[state.slideId].future = items;
          }
        });
      },

      addCurrent: (payload) => {
        const items = Array.isArray(payload) ? payload : [payload];

        set((state) => ({
          current: items,
        }));
      },
      setAllowWorkHistory: (payload) => {
        set((state) => ({
          allowPastHistory: payload,
        }));
      },
      setSlideId: (slideId: string) => {
        set((state) => ({
          slideId: slideId,
        }));
      },
    }))
  )
);

export const useWorkHistoryStore = createSelectorHooks(useWorkHistoryStoreBase);
export const addHistoryItem = (props: {
  id: string;
  history: {
    past: [];
    future: [];
  };
}) =>
  useWorkHistoryStoreBase.setState((state) => {
    if (props.id) {
      state.history[props.id] = props.history;
    }
  });
