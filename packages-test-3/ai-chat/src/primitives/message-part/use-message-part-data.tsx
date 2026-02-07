"use client";

import { DataMessagePart } from "../../types/message-part-types";
import { usePart } from "./part-by-index-provider";
import { useMemo } from "react";

export const useMessagePartData = <T = any>(name?: string) => {
  const partState = usePart();

  const part = useMemo(() => {
    if (partState.type !== "data") {
      return null;
    }
    return partState as DataMessagePart<T>;
  }, [partState]);

  if (!part) {
    return null;
  }

  if (name && part.name !== name) {
    return null;
  }

  return part;
};
