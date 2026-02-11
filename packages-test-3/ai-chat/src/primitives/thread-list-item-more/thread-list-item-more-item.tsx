"use client";

import { ComponentPropsWithoutRef, forwardRef, useCallback } from "react";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";
// import { useThreadListItemMoreContext } from "./scope";

export namespace ThreadListItemMorePrimitiveItem {
  export type Element = RuntimeComponents['ThreadListItemMoreItem'];
  export type Props = ComponentPropsWithoutRef<RuntimeComponents['ThreadListItemMoreItem']>;
}

export const ThreadListItemMorePrimitiveItem = forwardRef<
  ThreadListItemMorePrimitiveItem.Element,
  ThreadListItemMorePrimitiveItem.Props
>(({ ...rest }, ref) => {
  const { components } = useRuntime();
  const { ThreadListItemMoreItem } = components;


  return <ThreadListItemMoreItem {...rest} ref={ref} />;
});

ThreadListItemMorePrimitiveItem.displayName =
  "ThreadListItemMorePrimitive.Item";
