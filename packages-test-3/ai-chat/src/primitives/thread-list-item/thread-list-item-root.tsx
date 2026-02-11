'use client';

import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import { ComponentProps, forwardRef } from "react";
import { useThreadListItem } from "./thread-list-item-by-index-provider";
import { useThreads } from "../../ai-provider";

export namespace ThreadListItemPrimitiveRoot {
  export type Element = RuntimeComponents['Box'];
  export type Props = ComponentProps<RuntimeComponents['Box']>;
}

export const ThreadListItemPrimitiveRoot = forwardRef<
  ThreadListItemPrimitiveRoot.Element,
  ThreadListItemPrimitiveRoot.Props
>((props, ref) => {
  const { components: { Box } } = useRuntime();
  const threadId = useThreadListItem((thread) => thread.id);
  const activeThreadId = useThreads((threads) => threads.activeThreadId);

  const isActive = activeThreadId === threadId;

  return (
    <Box
      {...(isActive ? { "data-active": "true", "aria-current": "true" } : null)}
      {...props}
      ref={ref}
    />
  );
});

ThreadListItemPrimitiveRoot.displayName = "ThreadListItemPrimitive.Root";
