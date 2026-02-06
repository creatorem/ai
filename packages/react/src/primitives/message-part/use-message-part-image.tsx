"use client";

import { useAiChat } from "@creatorem/ai-store";
import type { ImageMessagePart, MessagePartState } from "@creatorem/ai-store/types";

export const useMessagePartImage = () => {
  const image = useAiChat(({ part }) => {
    if (part.type !== "image")
      throw new Error(
        "MessagePartImage can only be used inside image message parts.",
      );

    return part as MessagePartState & ImageMessagePart;
  });

  return image;
};
