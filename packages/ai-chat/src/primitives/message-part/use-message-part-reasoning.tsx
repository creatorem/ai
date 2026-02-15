"use client";

import { useMemo } from "react";
import { usePart } from "./part-by-index-provider";
import { MessagePartState } from "../../types/message-part-runtime";
import { ReasoningMessagePart } from "../../types/message-part-types";

export const useMessagePartReasoning = () => {
  const part = usePart();

  const text = useMemo(() => {
    if (part.type !== "reasoning")
      throw new Error(
        "MessagePartReasoning can only be used inside reasoning message parts.",
      );

    return part as MessagePartState & ReasoningMessagePart;
  }, [part]);

  return text;
};
