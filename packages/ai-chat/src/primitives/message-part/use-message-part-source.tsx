"use client";

import { MessagePartState } from "../../types/message-part-runtime";
import { SourceMessagePart } from "../../types/message-part-types";
import { usePart } from "./part-by-index-provider";
import { useMemo } from "react";

export const useMessagePartSource = () => {
  const part = usePart();

  const source = useMemo(() => {
    if (part.type !== "source")
      throw new Error(
        "MessagePartSource can only be used inside source message parts.",
      );

    return part as MessagePartState & SourceMessagePart;
  }, [part]);

  return source;
};
