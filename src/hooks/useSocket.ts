import { SocketState } from "enums";
import { useCallback } from "react";
import { useSocketStore } from "store/stores/socket";
import AppSocket from "utils/socket";

let socketInitConfig: Record<string, any> | null;

const useSocket = () => {
  const wsSubscribe = useSocketStore.useWsSubscribe();
  const wsUnsubscribe = useSocketStore.useWsUnsubscribe();
  const wsSetState = useSocketStore.useWsSetState();
  const wsReceive = useSocketStore.useWsReceive();

  const subscribe = useCallback(
    (type: string, key: string, callback: (data: any) => void) => {
      wsSubscribe(type, key, callback);
    },
    [wsSubscribe]
  );

  const unsubscribe = useCallback(
    (type: string, key: string) => {
      wsUnsubscribe(type, key);
    },
    [wsUnsubscribe]
  );

  const send = useCallback((message: string) => {
    AppSocket.send(message);
  }, []);

  const initialize = useCallback(
    (config: Record<string, any>, action: string = "initial") => {
      socketInitConfig = config;
      send(
        JSON.stringify({
          action,
          ...config,
        })
      );
    },
    [send]
  );

  const connect = useCallback(
    (
      host: string,
      onOpen?: (e: Event) => void,
      onMessage?: (e: MessageEvent) => void,
      onClose?: (e: CloseEvent) => void
    ) => {
      AppSocket.connect(
        host,
        (e) => {
          //console.log('websocket open', e);
          wsSetState(SocketState.Open);
          if (socketInitConfig) {
            //console.log('websocket send init config');
            initialize(socketInitConfig);
          }
          onOpen?.(e);
        },
        (e) => {
          if (e.data) {
            wsReceive(e.data);
          }
          onMessage?.(e);
        },
        (e) => {
          //console.log('websocket close', e);
          if (e.code === 1001) {
            connect(host, onOpen, onMessage, onClose);
          }
          wsSetState(SocketState.Close);
          onClose?.(e);
        }
      );
    },
    [wsSetState, initialize, wsReceive]
  );

  const disconnect = useCallback(() => {
    AppSocket.disconnect();
    socketInitConfig = null;
  }, []);

  return {
    subscribe,
    unsubscribe,
    connect,
    disconnect,
    send,
    initialize,
  };
};

export default useSocket;
