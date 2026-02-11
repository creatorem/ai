"use client";

import { ComponentPropsWithoutRef, forwardRef } from "react";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";

export namespace ThreadListItemMorePrimitiveSeparator {
  export type Element = RuntimeComponents['ThreadListItemMoreSeparator'];
  export type Props = ComponentPropsWithoutRef<RuntimeComponents['ThreadListItemMoreSeparator']>
}

export const ThreadListItemMorePrimitiveSeparator = forwardRef<
  ThreadListItemMorePrimitiveSeparator.Element,
  ThreadListItemMorePrimitiveSeparator.Props
>((props, ref) => {
  const { components: {ThreadListItemMoreSeparator} } = useRuntime();

  return <ThreadListItemMoreSeparator {...props} ref={ref} />;
});

ThreadListItemMorePrimitiveSeparator.displayName =
  "ThreadListItemMorePrimitive.Separator";
