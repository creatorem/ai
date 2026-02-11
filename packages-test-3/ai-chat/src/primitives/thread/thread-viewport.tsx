"use client";

import { useComposedRefs } from "@creatorem/ai-chat/utils";
import {
  type ComponentRef,
  forwardRef,
  useCallback,
  type ComponentProps,
} from "react";
import { useThreadViewport } from "../../primitives/thread/thread-viewport-context";
import { ThreadPrimitiveViewportProvider } from "../../primitives/thread/thread-viewport-provider";
import { useSizeHandle } from "../../hooks/use-size-handle";
import { useThreadViewportAutoScroll } from "./use-thread-viewport-auto-scroll";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";

export namespace ThreadPrimitiveViewport {
  export type Element = RuntimeComponents['ScrollArea']; 
  export type Props = ComponentProps<RuntimeComponents['ScrollArea']> & {
    /**
     * Whether to automatically scroll to the bottom when new messages are added.
     * When enabled, the viewport will automatically scroll to show the latest content.
     *
     * Default false if `turnAnchor` is "top", otherwise defaults to true.
     */
    autoScroll?: boolean | undefined;

    /**
     * Controls scroll anchoring behavior for new messages.
     * - "bottom" (default): Messages anchor at the bottom, classic chat behavior.
     * - "top": New user messages anchor at the top of the viewport for a focused reading experience.
     */
    turnAnchor?: "top" | "bottom" | undefined;

    /**
     * Whether to scroll to bottom when a new run starts.
     *
     * Defaults to true.
     */
    scrollToBottomOnRunStart?: boolean | undefined;

    /**
     * Whether to scroll to bottom when thread history is first loaded.
     *
     * Defaults to true.
     */
    scrollToBottomOnInitialize?: boolean | undefined;

    /**
     * Whether to scroll to bottom when switching to a different thread.
     *
     * Defaults to true.
     */
    scrollToBottomOnThreadSwitch?: boolean | undefined;
  };
}

const useViewportSizeRef = () => {
  const register = useThreadViewport((s) => s.registerViewport);
  const getHeight = useCallback((el: HTMLElement) => el.clientHeight, []);
  return useSizeHandle(register, getHeight);
};

const ThreadPrimitiveViewportScrollable = forwardRef<
  ThreadPrimitiveViewport.Element,
  ThreadPrimitiveViewport.Props
>(
  (
    {
      autoScroll,
      scrollToBottomOnRunStart,
      scrollToBottomOnInitialize,
      scrollToBottomOnThreadSwitch,
      children,
      ...rest
    },
    forwardedRef,
  ) => {
    const { components: { ScrollArea } } = useRuntime();
    const autoScrollRef = useThreadViewportAutoScroll({
      autoScroll,
      scrollToBottomOnRunStart,
      scrollToBottomOnInitialize,
      scrollToBottomOnThreadSwitch,
    });
    const viewportSizeRef = useViewportSizeRef();
    const ref = useComposedRefs(forwardedRef, autoScrollRef, viewportSizeRef);

    return (
      <ScrollArea {...rest} ref={ref}>
        {children}
      </ScrollArea>
    );
  },
);

ThreadPrimitiveViewportScrollable.displayName =
  "ThreadPrimitive.ViewportScrollable";

/**
 * A scrollable viewport container for thread messages.
 *
 * This component provides a scrollable area for displaying thread messages with
 * automatic scrolling capabilities. It manages the viewport state and provides
 * context for child components to access viewport-related functionality.
 *
 * @example
 * ```tsx
 * <ThreadPrimitive.Viewport turnAnchor="top">
 *   <ThreadPrimitive.Messages components={{ Message: MyMessage }} />
 * </ThreadPrimitive.Viewport>
 * ```
 */
export const ThreadPrimitiveViewport = forwardRef<
  ThreadPrimitiveViewport.Element,
  ThreadPrimitiveViewport.Props
>(({ turnAnchor, ...props }, ref) => {
  return (
    <ThreadPrimitiveViewportProvider options={{ turnAnchor }}>
      <ThreadPrimitiveViewportScrollable {...props} ref={ref} />
    </ThreadPrimitiveViewportProvider>
  );
});

ThreadPrimitiveViewport.displayName = "ThreadPrimitive.Viewport";
