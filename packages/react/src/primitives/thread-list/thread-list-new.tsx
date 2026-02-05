"use client";

import {
  ActionButtonElement,
  ActionButtonProps,
} from "../../utils/create-action-button";
import { forwardRef } from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { composeEventHandlers } from "@radix-ui/primitive";
import { useAiChat, useAiChatShallow } from "@creatorem/ai-store";

export namespace ThreadListPrimitiveNew {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<() => void>;
}

export const ThreadListPrimitiveNew = forwardRef<
  ThreadListPrimitiveNew.Element,
  ThreadListPrimitiveNew.Props
>(({ onClick, disabled, ...props }, forwardedRef) => {
  const isMain = useAiChat(
    ({ threads }) => threads.newThreadId === threads.mainThreadId,
  );

  const threadsMethods = useAiChat(({threads}) => threads.methods);

  return (
    <Primitive.button
      type="button"
      {...(isMain ? { "data-active": "true", "aria-current": "true" } : null)}
      {...props}
      ref={forwardedRef}
      disabled={disabled}
      onClick={composeEventHandlers(onClick, () => {
        threadsMethods.switchToNewThread();
      })}
    />
  );
});

ThreadListPrimitiveNew.displayName = "ThreadListPrimitive.New";
