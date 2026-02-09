"use client";

import { type FC, type PropsWithChildren, useMemo } from "react";
import { PartProvider } from "../message-part/part-by-index-provider";
import { PartState } from "../../types/entities";

export const TextMessagePartProvider: FC<
  PropsWithChildren<{
    text: string;
    isRunning?: boolean;
  }>
> = ({ text, isRunning = false, children }) => {
  const part = useMemo<PartState>(
    () => ({
      type: "text",
      text,
      status: isRunning ? { type: "running" } : { type: "complete" },
    }),
    [text, isRunning],
  );

  return <PartProvider part={part}>{children}</PartProvider>;
};
