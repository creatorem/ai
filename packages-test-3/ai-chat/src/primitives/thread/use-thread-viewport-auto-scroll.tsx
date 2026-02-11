"use client";

import { AutoScrollConfig } from "@creatorem/ai-chat/hook-types";
import { useRuntime } from "@creatorem/ai-chat/runtime";

export const useThreadViewportAutoScroll = (
  options?: AutoScrollConfig
) => {
  const { useAutoScroll } = useRuntime().hooks;
  const { ref } = useAutoScroll(options);
  // We return the ref directly as the hook expects to return a ref callback
  return ref;
};
