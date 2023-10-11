import { useCallback, useEffect } from "react";
import { getLocalStorage, getUser } from "utils";
import { v4 } from "uuid";
import useSocket from "./useSocket";

const responseCallbacks = new Map();

const useSocketWithResponse = (event: string) => {
  const socket = useSocket();

  const sendAndWaitForResponse = useCallback(
    (
      message: { action: string; metadata: { [key: string]: any } },
      // responseCondition:
      { requestId = v4() }: { requestId?: number | string } = {}
    ) => {
      const messageId = requestId; // Use a unique ID for each message.
      responseCallbacks.set(messageId, {
        isLoading: true,
      });

      socket.send(
        JSON.stringify({
          ...message,
          metadata: {
            ...message.metadata,
            uid: messageId,
            user_id: getUser()?.slug,
            account_id: getLocalStorage("account-id", false),
          },
        })
      );

      return messageId;
    },
    [socket]
  );

  const sendAndWaitForResponsePromise = useCallback(
    (
      message: { action: string; metadata: { [key: string]: any } },
      { requestId = v4() }: { requestId?: number | string } = {}
    ) => {
      const messageId = requestId;

      const responsePromise = new Promise((resolve, reject) => {
        responseCallbacks.set(messageId, {
          resolve,
          reject,
          promise: true,
        });
      });

      socket.send(
        JSON.stringify({
          ...message,

          metadata: {
            ...message.metadata,
            uid: messageId,
            user_id: getUser()?.slug,
            account_id: getLocalStorage("account-id", false),
          },
        })
      );

      return responsePromise;
    },
    [socket]
  );

  const isLoading = useCallback((messageId: string) => {
    const messageState = responseCallbacks.get(messageId);
    return messageState?.isLoading || false;
  }, []);

  const handleMessage = (res: { [key: string]: any }) => {
    const data = res.data;
    const messageState = responseCallbacks.get(data.uid);
    if (messageState) {
      responseCallbacks.delete(data.uid);
      messageState.isLoading = false;
      if (messageState.promise) {
        messageState.resolve(data);
      }
    }
  };

  const handleDisconnect = () => {
    responseCallbacks.forEach((callback, messageId) => {
      callback.reject(new Error("Socket disconnected"));
      responseCallbacks.delete(messageId);
    });
  };

  const handleError = (res: { [key: string]: any }) => {
    const data = res.data;
    const messageState = responseCallbacks.get(data.uid);
    if (messageState) {
      responseCallbacks.delete(data.uid);
      messageState.isLoading = false;
      if (messageState.promise) {
        messageState.reject(data);
      }
    }
  };
  useEffect(() => {
    socket.subscribe("response", event, handleMessage);
    socket.subscribe("disconnect", "disconnectListener", handleDisconnect);
    socket.subscribe("error", "useSocketWithResponse", handleError);

    return () => {
      socket.unsubscribe("response", event);
      socket.unsubscribe("disconnect", "disconnectListener");
      socket.unsubscribe("error", "useSocketWithResponse");
    };
  }, [socket]);

  return {
    ...socket,
    sendAndWaitForResponse,
    isLoading,
    sendAndWaitForResponsePromise,
  };
};

export default useSocketWithResponse;
