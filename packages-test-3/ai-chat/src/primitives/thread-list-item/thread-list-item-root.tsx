'use client';

import { Primitive } from "@radix-ui/react-primitive";
import { type ComponentRef, forwardRef, ComponentPropsWithoutRef } from "react";
import { useThreadListItem } from "./thread-list-item-by-index-provider";
import { useThreads } from "../ai-provider";

type PrimitiveDivProps = ComponentPropsWithoutRef<typeof Primitive.div>;

export namespace ThreadListItemPrimitiveRoot {
  export type Element = ComponentRef<typeof Primitive.div>;
  export type Props = PrimitiveDivProps;
}

export const ThreadListItemPrimitiveRoot = forwardRef<
  ThreadListItemPrimitiveRoot.Element,
  ThreadListItemPrimitiveRoot.Props
>((props, ref) => {
  const threadId = useThreadListItem((thread) => thread.id);
  const activeThreadId = useThreads((threads) => threads.activeThreadId);

  const isActive = activeThreadId === threadId;

  return (
    <Primitive.div
      {...(isActive ? { "data-active": "true", "aria-current": "true" } : null)}
      {...props}
      ref={ref}
    />
  );
});

ThreadListItemPrimitiveRoot.displayName = "ThreadListItemPrimitive.Root";
