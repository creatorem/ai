"use client";

import { useMemo } from "react";
import { useThread } from "../thread/thread-root";
import { useMessage } from "../message/message-by-index-provider";

export enum HideAndFloatStatus {
  Hidden = "hidden",
  Floating = "floating",
  Normal = "normal",
}

export type UseActionBarFloatStatusProps = {
  hideWhenRunning?: boolean | undefined;
  autohide?: "always" | "not-last" | "never" | undefined;
  autohideFloat?: "always" | "single-branch" | "never" | undefined;
};

export const useActionBarFloatStatus = ({
  hideWhenRunning,
  autohide,
  autohideFloat,
}: UseActionBarFloatStatusProps) => {
  const thread = useThread();
  const message = useMessage();

  return useMemo(() => {
    if (hideWhenRunning && thread.isRunning) return HideAndFloatStatus.Hidden;

    const autohideEnabled =
      autohide === "always" || (autohide === "not-last" && !message.isLast);

    // normal status
    if (!autohideEnabled) return HideAndFloatStatus.Normal;

    // hidden status
    if (!message.isHovering) return HideAndFloatStatus.Hidden;

    // floating status
    if (
      autohideFloat === "always" ||
      (autohideFloat === "single-branch" && message.branchCount <= 1)
    )
      return HideAndFloatStatus.Floating;

    return HideAndFloatStatus.Normal;
  }, [thread, message]);
};
