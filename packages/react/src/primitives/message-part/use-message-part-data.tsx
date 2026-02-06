"use client";

import { useAiChat } from "@creatorem/ai-store";
import type { DataMessagePart } from "@creatorem/ai-store/types";

export const useMessagePartData = <T = any>(name?: string) => {
  const part = useAiChat(({ part }) => {
    if (part.type !== "data") {
      return null;
    }
    return part as DataMessagePart<T>;
  });

  if (!part) {
    return null;
  }

  if (name && part.name !== name) {
    return null;
  }

  return part;
};
