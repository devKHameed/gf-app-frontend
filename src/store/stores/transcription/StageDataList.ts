import { createSelectorHooks } from "auto-zustand-selectors-hook";
import produce from "immer";
import { v4 } from "uuid";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const STAGE_LIST_PREFIX = "STAGE_LIST";

type StageDateType = Record<string | any, TranscriptionsData>;
type ContentListType = Record<string | any, AlternativeContent>;
type List = {
  contentList: ContentListType | any;
  contentIds: { id: string }[];
};
type TranscriptContentType = Record<string | any, List>;

export type StageDataList = {
  stageList: StageDateType;
  stageIds: { id: string }[];
  transcriptContent: TranscriptContentType;
  activeSlide: string;
  activeCanvasItem?: string;
};

type Actions = {
  initialize(list: TranscriptionsData[]): void;
  addItem(items: string[]): void;
  updateItem(items: string | string[]): void;
  removeItem(items: string | string[]): void;
  clearItems(): void;
  setActiveSlide(slideId: string): void;
  sortItems(items: { id: string }[]): void;
  setStageList(list: StageDateType): void;
};

const useStageStoreBase = create<StageDataList & Actions>()(
  devtools(
    immer<StageDataList & Actions>((set, get) => ({
      stageList: {},
      stageIds: [],
      transcriptContent: {},
      activeSlide: "",
      sortItems: (payload) => {
        set((state) => {
          state.stageIds = payload;
        });
      },
      initialize: (payload) => {
        const transcripts = Array.isArray(payload) ? payload : [payload];
        const nextState: StageDateType = {};
        const stateIds: { id: string }[] = [];
        transcripts.forEach((transcript) => {
          const slideId = v4();
          stateIds.push({ id: slideId as string });
          const transcriptWithIds = produce(transcript, (draft) => {
            draft.results.items.forEach((subtitle) => {
              subtitle.id = v4();
              subtitle.content = subtitle.alternatives?.[0]?.content;
            });
          });
          nextState[slideId] = transcriptWithIds;
        });
        set((state) => ({
          ...state,
          stageList: nextState,
          stageIds: stateIds,
        }));
      },
      addItem: (payload) => {
        // const items = Array.isArray(payload) ? payload : [payload];
        // const nextState = { ...get().stageList };
        // const stateIds = [...(get().stageIds || [])];
        // items.forEach((item) => {
        //   const newItem = nextState[item as string];
        //   if (!newItem) {
        //     nextState[item as string] = item;
        //     stateIds.push({ id: item as string });
        //   }
        // });
        // set((state) => ({
        //   ...state,
        //   stageList: nextState,
        //   stageIds: stateIds,
        // }));
      },
      updateItem: (payload) => {},
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
