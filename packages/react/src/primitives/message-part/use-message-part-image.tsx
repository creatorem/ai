"use client";

import { MessagePartState } from "../../runtime/runtime/message-part-runtime";
import { useAiChat } from "@creatorem/ai-store";
import { ImageMessagePart } from "../../types";

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
