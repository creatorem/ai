"use client";

import type { MessagePartState } from "../../runtime/runtime/message-part-runtime";
import { useAuiState } from "@creatorem/ai-assistant-store";
import { SourceMessagePart } from "../../types";

export const useMessagePartSource = () => {
  const source = useAuiState(({ part }) => {
    if (part.type !== "source")
      throw new Error(
        "MessagePartSource can only be used inside source message parts.",
      );

    return part as MessagePartState & SourceMessagePart;
  });

  return source;
};
