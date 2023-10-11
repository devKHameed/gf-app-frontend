import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { Vector2d } from "konva/lib/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
const FILE_META_PREFIX = "FILE_META";

export type FileMeta = {
  scale: Vector2d;
  position: Vector2d;
};

const initialFileMeta: FileMeta = {
  scale: {
    x: 1,
    y: 1,
  },
  position: {
    x: 0,
    y: 0,
  },
};

type Actions = {
  setFileMeta(meta: FileMeta): void;
};

const useFileMetaStore = create<FileMeta & Actions>()(
  devtools(
    immer<FileMeta & Actions>((set) => ({
      ...initialFileMeta,
      setFileMeta(data) {
        set((state) => {
          const { scale, position } = data;
          state.scale = scale;
          state.position = position;
        });
      },
    }))
  )
);

export const usePresentationFileMetaStore =
  createSelectorHooks(useFileMetaStore);
