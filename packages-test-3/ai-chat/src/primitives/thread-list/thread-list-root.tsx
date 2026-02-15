"use client";

import { ComponentPropsWithoutRef, forwardRef } from "react";
import { ThreadListProvider } from "./thread-list-provider";
import { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import { useRuntime } from "@creatorem/ai-chat/runtime";

export namespace ThreadListPrimitiveRoot {
  export type Element = RuntimeComponents["Box"];
  export type Props = ComponentPropsWithoutRef<RuntimeComponents["Box"]>;
}

export const ThreadListPrimitiveRoot = forwardRef<
  ThreadListPrimitiveRoot.Element,
  ThreadListPrimitiveRoot.Props
>((props, ref) => {
  const {
    components: { Box },
  } = useRuntime();
  return (
    <ThreadListProvider>
      <Box {...props} ref={ref} />
    </ThreadListProvider>
  );
});

ThreadListPrimitiveRoot.displayName = "ThreadListPrimitive.Root";
