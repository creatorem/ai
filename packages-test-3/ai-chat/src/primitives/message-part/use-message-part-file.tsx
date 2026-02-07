"use client";

import { useMemo } from "react";
import { usePart } from "./part-by-index-provider";
import { FileMessagePart } from "../../types/message-part-types";
import { MessagePartState } from "../../types/message-part-runtime";

export const useMessagePartFile = () => {
  const partState = usePart();

  const file = useMemo(() => {
    if (partState.type !== "file")
      throw new Error(
        "MessagePartFile can only be used inside file message parts.",
      );

      return part as MessagePartState & FileMessagePart;
  }, [partState]);

  return file;
};
