"use client";

import {
  ActionButtonElement,
} from "../../utils/create-action-button";
import { ComponentProps, forwardRef, useContext } from "react";
import { ThreadViewportContext } from "./thread-viewport-context";
import { useRuntime } from "../../runtime";
import { composeEventHandlers } from "../../utils/compose-event-handlers";


export const ThreadPrimitiveShowScrollToBottom: React.FC<{children:React.ReactNode}> = (({ children }) => {
  const viewportContext = useContext(ThreadViewportContext);
  if (!viewportContext) {
    throw new Error(
      "This component must be used within ThreadPrimitive.Viewport.",
    );
  }
  const viewportStore = viewportContext.useThreadViewport;
  const isAtBottom = viewportStore((s) => s.isAtBottom);

  return !isAtBottom ? children : null;
});

export namespace ThreadPrimitiveScrollToBottom {
  export type Element = ActionButtonElement;
  export type Props = ComponentProps<ActionButtonElement>
}

export const ThreadPrimitiveScrollToBottom = forwardRef<
  ThreadPrimitiveScrollToBottom.Element,
  ThreadPrimitiveScrollToBottom.Props & {
    behavior?: ScrollBehavior | undefined;
    noAutoHide?:boolean
  }
>(({ behavior = 'smooth', disabled, onClick, noAutoHide = false, ...props }, forwardedRef) => {
  const {
    components: { Button },
  } = useRuntime();

  const viewportContext = useContext(ThreadViewportContext);
  if (!viewportContext) {
    throw new Error(
      "This component must be used within ThreadPrimitive.Viewport.",
    );
  }
  const viewportStore = viewportContext.useThreadViewport;
  const isAtBottom = viewportStore((s) => s.isAtBottom);

  if(isAtBottom && !noAutoHide) {
    return null;
  }
  return (
    <Button
      type="button"
      {...props}
      ref={forwardedRef}
      disabled={disabled}
      onClick={composeEventHandlers(
        onClick as ((...params: unknown[]) => void) | undefined,
        isAtBottom
          ? undefined
          : () => {
              viewportStore.getState().scrollToBottom({ behavior });
            },
      )}
    />
  );
});

ThreadPrimitiveScrollToBottom.displayName = "ThreadPrimitive.ScrollToBottom";
