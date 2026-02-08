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
  const isRunning = useThread(s => s.isRunning);
  const isLast = useMessage(s => s.isLast);
  const isHovering = useMessage(s => s.isHovering);
  const branchCount = useMessage(s => s.branchCount);

  return useMemo(() => {
    if (hideWhenRunning && isRunning) return HideAndFloatStatus.Hidden;

    const autohideEnabled =
      autohide === "always" || (autohide === "not-last" && !isLast);

    // normal status
    if (!autohideEnabled) return HideAndFloatStatus.Normal;

    // hidden status
    if (!isHovering) return HideAndFloatStatus.Hidden;

    // floating status
    if (
      autohideFloat === "always" ||
      (autohideFloat === "single-branch" && branchCount <= 1)
    )
      return HideAndFloatStatus.Floating;

    return HideAndFloatStatus.Normal;
  }, [isRunning, isLast, isHovering, branchCount, hideWhenRunning, autohide, autohideFloat]);
};
