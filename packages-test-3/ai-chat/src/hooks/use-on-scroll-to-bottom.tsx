"use client";

import { useEffect } from "react";
import { useThreadViewport } from "../primitives/thread/thread-viewport-context";
import { useCallbackRef } from "./use-callback-ref";

export const useOnScrollToBottom = (
  callback: (config: { behavior: ScrollBehavior }) => void,
) => {
  // const callbackRef = useCallbackRef(callback);
  // const onScrollToBottom = useThreadViewport((vp) => vp.onScrollToBottom);

  // useEffect(() => {
  //   return onScrollToBottom(callbackRef);
  // }, [onScrollToBottom, callbackRef]);
};
