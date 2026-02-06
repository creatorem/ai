"use client";

import { useAiChat } from "@creatorem/ai-store";
import type { FileMessagePart, MessagePartState } from "@creatorem/ai-store/types";

export const useMessagePartFile = () => {
  const file = useAiChat(({ part }) => {
    if (part.type !== "file")
      throw new Error(
        "MessagePartFile can only be used inside file message parts.",
      );

    return part as MessagePartState & FileMessagePart;
  });

  return file;
};
