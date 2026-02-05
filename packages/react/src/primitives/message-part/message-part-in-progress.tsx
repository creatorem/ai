"use client";

import { FC, PropsWithChildren } from "react";
import { useAiChat } from "@creatorem/ai-store";

export namespace MessagePartPrimitiveInProgress {
  export type Props = PropsWithChildren;
}

// TODO should this be renamed to IsRunning?
export const MessagePartPrimitiveInProgress: FC<
  MessagePartPrimitiveInProgress.Props
> = ({ children }) => {
  const isInProgress = useAiChat(
    ({ part }) => part.status.type === "running",
  );

  return isInProgress ? children : null;
};

MessagePartPrimitiveInProgress.displayName = "MessagePartPrimitive.InProgress";
