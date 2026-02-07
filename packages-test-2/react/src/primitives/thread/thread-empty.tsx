"use client";

import type { FC, PropsWithChildren } from "react";
import { useAiChat } from "@creatorem/ai-store";

export namespace ThreadPrimitiveEmpty {
  export type Props = PropsWithChildren;
}

export const ThreadPrimitiveEmpty: FC<ThreadPrimitiveEmpty.Props> = ({
  children,
}) => {
  const empty = useAiChat(
    ({ thread }) => thread.messages.length === 0 && !thread.isLoading,
  );
  return empty ? children : null;
};

ThreadPrimitiveEmpty.displayName = "ThreadPrimitive.Empty";
