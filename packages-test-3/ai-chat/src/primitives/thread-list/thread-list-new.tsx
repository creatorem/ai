'use client';

import {
  ActionButtonElement,
  ActionButtonProps,
} from "../../utils/create-action-button";
import { forwardRef } from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { composeEventHandlers } from "@radix-ui/primitive";
import { useThreadList } from "./thread-list-provider";

export namespace ThreadListPrimitiveNew {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<() => void>;
}

export const ThreadListPrimitiveNew = forwardRef<
  ThreadListPrimitiveNew.Element,
  ThreadListPrimitiveNew.Props
>(({ onClick, disabled, ...props }, forwardedRef) => {
  const activeThreadId = useThreadList((s) => s.activeThreadId);
  const switchToNewThread = useThreadList((s) => s.switchToNewThread);

  const isMain = activeThreadId === null;

  return (
    <Primitive.button
      type="button"
      {...(isMain ? { "data-active": "true", "aria-current": "true" } : null)}
      {...props}
      ref={forwardedRef}
      disabled={disabled}
      onClick={composeEventHandlers(onClick, () => {
        switchToNewThread();
      })}
    />
  );
});

ThreadListPrimitiveNew.displayName = "ThreadListPrimitive.New";

