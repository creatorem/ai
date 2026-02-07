"use client";

import { useAiChat } from "@creatorem/ai-store";
import type { ReasoningMessagePart,MessagePartState } from "@creatorem/ai-store/types";

export const useMessagePartReasoning = () => {
  const text = useAiChat(({ part }) => {
    if (part.type !== "reasoning")
      throw new Error(
        "MessagePartReasoning can only be used inside reasoning message parts.",
      );

    return part as MessagePartState & ReasoningMessagePart;
  });

  return text;
};
