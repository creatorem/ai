"use client";

import { FC, ReactNode, useState, useCallback, ComponentPropsWithoutRef } from "react";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";

export namespace ThreadListItemMorePrimitiveRoot {
  export type Props = ComponentPropsWithoutRef<RuntimeComponents['ThreadListItemMoreRoot']>
}

export const ThreadListItemMorePrimitiveRoot: FC<
  ThreadListItemMorePrimitiveRoot.Props
> = (props) => {
  const {components: { ThreadListItemMoreRoot }} = useRuntime();

  return <ThreadListItemMoreRoot {...props}/>
};

ThreadListItemMorePrimitiveRoot.displayName =
  "ThreadListItemMorePrimitive.Root";
