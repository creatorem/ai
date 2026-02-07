"use client";

import { FC, PropsWithChildren, useMemo } from "react";
import { usePart } from "./part-by-index-provider";

export namespace MessagePartPrimitiveInProgress {
  export type Props = PropsWithChildren;
}

// TODO should this be renamed to IsRunning?
export const MessagePartPrimitiveInProgress: FC<
  MessagePartPrimitiveInProgress.Props
> = ({ children }) => {
  const { status } = usePart();
  const isInProgress = useMemo(
    () => status.type === "running",
    [status]
  );

  return isInProgress ? children : null;
};

MessagePartPrimitiveInProgress.displayName = "MessagePartPrimitive.InProgress";
