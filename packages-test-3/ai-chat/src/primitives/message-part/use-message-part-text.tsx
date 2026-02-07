"use client";

import { useMemo } from "react";
import { usePart } from "./part-by-index-provider";
import { MessagePartState } from "../../types/message-part-runtime";
import { ReasoningMessagePart, TextMessagePart } from "../../types/message-part-types";

export const useMessagePartText = () => {
  const part = usePart();

  const text = useMemo(() => {
    if (part.type !== "text" && part.type !== "reasoning")
      throw new Error(
        "MessagePartText can only be used inside text or reasoning message parts.",
      );

    return part as MessagePartState & (TextMessagePart | ReasoningMessagePart);
  }, [part]);

  return text;
};
