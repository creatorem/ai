"use client";

import { MessagePartState } from "../../runtime/runtime/message-part-runtime";
import { useAuiState } from "@creatorem/ai-assistant-store";
import { ImageMessagePart } from "../../types";

export const useMessagePartImage = () => {
  const image = useAuiState(({ part }) => {
    if (part.type !== "image")
      throw new Error(
        "MessagePartImage can only be used inside image message parts.",
      );

    return part as MessagePartState & ImageMessagePart;
  });

  return image;
};
