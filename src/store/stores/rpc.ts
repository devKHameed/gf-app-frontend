import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
  rpcMap: Record<string, unknown>;
};

type Actions = {
  addRpcData: (rpc: string, data: unknown) => void;
};

export const useRPCStore = create(
  devtools(
    immer<State & Actions>((set) => ({
      rpcMap: {},
      addRpcData: (rpc: string, data: unknown) => {
        set((state) => {
          state.rpcMap = { ...state.rpcMap, [rpc]: data };
        });
      },
    }))
  )
);
