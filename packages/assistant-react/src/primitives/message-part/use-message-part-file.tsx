"use client";

import { MessagePartState } from "../../runtime/runtime/message-part-runtime";
import { useAuiState } from "@creatorem/ai-assistant-store";
import { FileMessagePart } from "../../types";

export const useMessagePartFile = () => {
  const file = useAuiState(({ part }) => {
    if (part.type !== "file")
      throw new Error(
        "MessagePartFile can only be used inside file message parts.",
      );

    return part as MessagePartState & FileMessagePart;
  });

  return file;
};
