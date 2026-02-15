"use client";

import { useMemo } from "react";
import { usePart } from "./part-by-index-provider";
import { MessagePartState } from "../../types/message-part-runtime";
import { ImageMessagePart } from "../../types/message-part-types";

export const useMessagePartImage = () => {
  const part = usePart();

  const image = useMemo(() => {
    if (part.type !== "image")
      throw new Error(
        "MessagePartImage can only be used inside image message parts.",
      );

    return part as MessagePartState & ImageMessagePart;
  }, [part]);

  return image;
};
