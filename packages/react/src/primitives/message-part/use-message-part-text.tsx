"use client";

import { useAiChat } from "@creatorem/ai-store";
import type { TextMessagePart, ReasoningMessagePart, MessagePartState } from "@creatorem/ai-store/types";

export const useMessagePartText = () => {
  const text = useAiChat(({ part }) => {
    if (part.type !== "text" && part.type !== "reasoning")
      throw new Error(
        "MessagePartText can only be used inside text or reasoning message parts.",
      );

    return part as MessagePartState & (TextMessagePart | ReasoningMessagePart);
  });

  return text;
};
