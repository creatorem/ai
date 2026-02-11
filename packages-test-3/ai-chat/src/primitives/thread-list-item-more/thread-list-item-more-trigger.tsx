"use client";

import { ComponentPropsWithoutRef, forwardRef, useCallback } from "react";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";
// import { useThreadListItemMoreContext } from "./scope";

export namespace ThreadListItemMorePrimitiveTrigger {
  export type Element = RuntimeComponents['ThreadListItemMoreTrigger'];
  export type Props = ComponentPropsWithoutRef<RuntimeComponents['ThreadListItemMoreTrigger']>
}

export const ThreadListItemMorePrimitiveTrigger = forwardRef<
  ThreadListItemMorePrimitiveTrigger.Element,
  ThreadListItemMorePrimitiveTrigger.Props
>((props, ref) => {
  const { components: {ThreadListItemMoreTrigger} } = useRuntime();

  return <ThreadListItemMoreTrigger {...props} ref={ref} />;
});

ThreadListItemMorePrimitiveTrigger.displayName =
  "ThreadListItemMorePrimitive.Trigger";
