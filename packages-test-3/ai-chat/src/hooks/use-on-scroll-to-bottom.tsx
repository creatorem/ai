"use client";

import { useEffect } from "react";
import { useThreadViewportStore } from "../primitives/thread/thread-viewport-context";
import { useCallbackRef } from "./use-callback-ref";

export const useOnScrollToBottom = (
  callback: (config: { behavior: ScrollBehavior }) => void,
) => {
  const callbackRef = useCallbackRef(callback);
  const viewportStore = useThreadViewportStore();

  useEffect(() => {
    return viewportStore.getState().onScrollToBottom(callbackRef);
  }, [viewportStore, callbackRef]);
};
