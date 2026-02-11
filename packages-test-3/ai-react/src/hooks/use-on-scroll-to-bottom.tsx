"use client";

import { useEffect } from "react";
import { useThreadViewport } from "@creatorem/ai-chat/primitives/thread";
import { useCallbackRef } from "@creatorem/ai-chat/hooks";

export const useOnScrollToBottom = (
  callback: (config: { behavior: ScrollBehavior }) => void,
) => {
  const callbackRef = useCallbackRef(callback);
  const onScrollToBottom = useThreadViewport((vp) => vp.onScrollToBottom);

  useEffect(() => {
    return onScrollToBottom(callbackRef);
  }, [onScrollToBottom, callbackRef]);
};
