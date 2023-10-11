import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type TranscriptAudioType = {
  isPlaying?: boolean;
  time?: number;
  duration?: number;
};

type Actions = {
  initialize(list: TranscriptAudioType): void;
  setAudioValues(items?: TranscriptAudioType): void;
};

const useTranscriptAudio = create<TranscriptAudioType & Actions>()(
  devtools(
    immer<TranscriptAudioType & Actions>((set, get) => ({
      isPlaying: false,
      time: 0,
      duration: 0,
      initialize: (payload) => {},
      setAudioValues: (payload) => {
        set((state) => ({
          ...state,
          ...payload,
        }));
      },
      clearItems() {
        set((state) => {
          state.isPlaying = false;
          state.time = 0;
        });
      },
    }))
  )
);

export const useTranscriptAudioStore = createSelectorHooks(useTranscriptAudio);
