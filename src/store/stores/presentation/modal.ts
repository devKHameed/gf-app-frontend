import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
export const STAGE_PREFIX = "STAGE";
export type StageData = {
  isOpen: boolean;
  items: { text: string; url: string };
};

type Actions = {
  setIsModalOpen(items: any): void;
  setHyperLinkValues(items: any): void;
};

const useModalOpen = create<StageData & Actions>()(
  devtools(
    immer<StageData & Actions>((set, get) => ({
      isOpen: false,
      items: { text: "", url: "" },
      setIsModalOpen: (items) => {
        set({ isOpen: items });
      },
      setHyperLinkValues: (items) => {
        set({ items: items });
      },
    }))
  )
);

export const useModalOpenStore = createSelectorHooks(useModalOpen);
