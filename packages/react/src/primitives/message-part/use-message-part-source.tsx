"use client";

import type { MessagePartState } from "../../runtime/runtime/message-part-runtime";
import { useAiChat } from "@creatorem/ai-store";
import { SourceMessagePart } from "../../types";

export const useMessagePartSource = () => {
  const source = useAiChat(({ part }) => {
    if (part.type !== "source")
      throw new Error(
        "MessagePartSource can only be used inside source message parts.",
      );

    return part as MessagePartState & SourceMessagePart;
  });

  return source;
};
