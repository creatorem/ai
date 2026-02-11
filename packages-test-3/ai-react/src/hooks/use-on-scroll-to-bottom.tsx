"use client";

import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { useEffect } from "react";
import { useThreadViewport } from "@creatorem/ai-chat/primitives/thread";

export const useOnScrollToBottom = (
  callback: (config: { behavior: ScrollBehavior }) => void,
) => {
  const callbackRef = useCallbackRef(callback);
  const onScrollToBottom = useThreadViewport((vp) => vp.onScrollToBottom);

  useEffect(() => {
    return onScrollToBottom(callbackRef);
  }, [onScrollToBottom, callbackRef]);
};
