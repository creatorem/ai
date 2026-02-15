"use client";

import {
  ActionButtonElement,
  ActionButtonProps,
} from "../../utils/create-action-button";
import { forwardRef } from "react";
import { useThreadList } from "./thread-list-provider";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import { composeEventHandlers } from "@creatorem/ai-chat/utils";

export namespace ThreadListPrimitiveNew {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<() => void>;
}

export const ThreadListPrimitiveNew = forwardRef<
  ThreadListPrimitiveNew.Element,
  ThreadListPrimitiveNew.Props
>(({ onClick, disabled, ...props }, forwardedRef) => {
  const {
    components: { Button },
  } = useRuntime();
  const activeThreadId = useThreadList((s) => s.activeThreadId);
  const switchToNewThread = useThreadList((s) => s.switchToNewThread);

  const isMain = activeThreadId === null;

  return (
    <Button
      type="button"
      {...(isMain ? { "data-active": "true", "aria-current": "true" } : null)}
      {...props}
      ref={forwardedRef}
      disabled={disabled}
      onClick={composeEventHandlers(onClick, switchToNewThread)}
    />
  );
});

ThreadListPrimitiveNew.displayName = "ThreadListPrimitive.New";
