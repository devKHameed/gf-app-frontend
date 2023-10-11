import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import createGlobalSlice, { IGlobal } from "./slices/createGlobalSlice";

import { createSelectorHooks } from "auto-zustand-selectors-hook";
import cloneDeep from "lodash/cloneDeep";

export { useSystemLayoutStore as default } from "./stores/systemLayout";

interface IStore extends IGlobal {
  resetStore: () => void;
}
let initialState: IStore | undefined;
export const useStoreBase = create(
  devtools(
    immer<IStore>((set, get) => {
      const store = {
        ...createGlobalSlice(set, get),
        // ...createLayoutSlice(set, get),
        resetStore: () => {
          set(() => initialState);
        },
      };

      if (!!initialState) initialState = cloneDeep(store);
      return store;
    })
  )
);

export const useStore = createSelectorHooks<IStore>(useStoreBase);
