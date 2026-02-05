"use client";

import { MessagePartState } from "../../runtime/runtime/message-part-runtime";
import { useAiChat } from "@creatorem/ai-store";
import { ReasoningMessagePart } from "../../types";

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
