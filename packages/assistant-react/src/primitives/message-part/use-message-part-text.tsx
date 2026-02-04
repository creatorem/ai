"use client";

import { MessagePartState } from "../../runtime/runtime/message-part-runtime";
import { useAuiState } from "@creatorem/ai-store";
import { TextMessagePart, ReasoningMessagePart } from "../../types";

export const useMessagePartText = () => {
  const text = useAuiState(({ part }) => {
    if (part.type !== "text" && part.type !== "reasoning")
      throw new Error(
        "MessagePartText can only be used inside text or reasoning message parts.",
      );

    return part as MessagePartState & (TextMessagePart | ReasoningMessagePart);
  });

  return text;
};
