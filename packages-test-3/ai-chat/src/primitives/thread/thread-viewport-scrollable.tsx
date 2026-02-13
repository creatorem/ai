"use client";

import { useComposedRefs } from "@creatorem/ai-chat/utils";
import {
  type ComponentRef,
  forwardRef,
  useCallback,
  type ComponentProps,
} from "react";
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

// const useViewportSizeRef = () => {
//   const register = useThreadViewport((s) => s.registerViewport);
//   const getHeight = useCallback((el: HTMLElement) => el.clientHeight, []);
//   return useSizeHandle(register, getHeight);
// };

export const ThreadPrimitiveViewportScrollable = forwardRef<
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
    // const viewportSizeRef = useViewportSizeRef();
    // const ref = useComposedRefs(forwardedRef, autoScrollRef, viewportSizeRef);
    const ref = useComposedRefs(forwardedRef, autoScrollRef);

    return (
      <ScrollArea {...rest} ref={ref}>
        {children}
      </ScrollArea>
    );
  },
);

ThreadPrimitiveViewportScrollable.displayName =
  "ThreadPrimitive.ViewportScrollable";

