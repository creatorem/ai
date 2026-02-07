"use client";

import { useAiChat } from "@creatorem/ai-store";
import type { SourceMessagePart, MessagePartState } from "@creatorem/ai-store/types";

export const useMessagePartSource = () => {
  const source = useAiChat(({ part }) => {
    if (part.type !== "source")
      throw new Error(
        "MessagePartSource can only be used inside source message parts.",
      );

    return part as MessagePartState & SourceMessagePart;
  });

  return source;
};
