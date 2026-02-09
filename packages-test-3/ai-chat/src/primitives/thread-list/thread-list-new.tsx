'use client';

import {
  ActionButtonElement,
  ActionButtonProps,
} from "../../utils/create-action-button";
import { forwardRef } from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { composeEventHandlers } from "@radix-ui/primitive";
import { useThreads } from "../ai-provider";

export namespace ThreadListPrimitiveNew {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<() => void>;
}

export const ThreadListPrimitiveNew = forwardRef<
  ThreadListPrimitiveNew.Element,
  ThreadListPrimitiveNew.Props
>(({ onClick, disabled, ...props }, forwardedRef) => {
  const activeThreadId = useThreads((threads) => threads.activeThreadId);
  const setActiveThreadId = useThreads((threads) => threads.setActiveThreadId);

  const isMain = activeThreadId === null;

  return (
    <Primitive.button
      type="button"
      {...(isMain ? { "data-active": "true", "aria-current": "true" } : null)}
      {...props}
      ref={forwardedRef}
      disabled={disabled}
      onClick={composeEventHandlers(onClick, () => {
        setActiveThreadId(null);
      })}
    />
  );
});

ThreadListPrimitiveNew.displayName = "ThreadListPrimitive.New";
