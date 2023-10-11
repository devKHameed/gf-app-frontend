import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { SocketState } from "enums";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
  state: SocketState;
  messages: any[];
  lastMessage?: any;
};

type Actions = {
  wsSetState(state: SocketState): void;
  wsUnsubscribe(type: string, key: string): void;
  wsSubscribe(type: string, key: string, callback: (data: any) => void): void;
  wsReceive(data: string): void;
};

const subscriptions: Record<string, any> = {};

const messageHandler = (message: any) => {
  if (message.chat_id) {
    if (subscriptions.chat) {
      const subscriptionKeys = Object.keys(subscriptions.chat);
      const callbacks = subscriptionKeys.map((key) => {
        return subscriptions.chat[key];
      });
      callbacks.forEach((callback) => {
        callback(message);
      });
    }
  }
  // else if (message.type === "chart-data") {
  //   const type = message.type;
  //   const key = message.data.fusion_slug;
  //   const data = message.data.data;
  //   const callback = subscriptions[type]?.[key];
  //   callback?.(data);
  // }
  else {
    const subscriptionType = subscriptions[message.type];
    if (subscriptionType) {
      const callbacks = Object.keys(subscriptionType).map((key) => {
        return subscriptionType[key];
      });
      callbacks.forEach((callback) => {
        callback(message);
      });
    }
  }
};

const useSocketStoreBase = create(
  devtools(
    immer<State & Actions>((set) => ({
      state: SocketState.Close,
      messages: [],
      lastMessage: null,
      wsSetState(s) {
        set((state) => {
          state.state = s;
        });
      },
      wsSubscribe(type, key, callback) {
        if (!subscriptions[type]) {
          subscriptions[type] = {};
        }
        subscriptions[type][key] = callback;
      },
      wsUnsubscribe(type, key) {
        if (!subscriptions) {
          return;
        }
        if (!subscriptions[type]) {
          return;
        }
        delete subscriptions[type][key];
      },
      wsReceive(data) {
        try {
          const json = JSON.parse(data);
          messageHandler(json);
        } catch (e) {}
      },
    }))
  )
);

export const useSocketStore = createSelectorHooks(useSocketStoreBase);
