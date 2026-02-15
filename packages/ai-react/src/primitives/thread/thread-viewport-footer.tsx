"use client";

import { forwardRef, ComponentPropsWithoutRef, useCallback } from "react";
import { useThreadViewport } from "../../../../ai-chat/src/primitives/thread/thread-viewport-context";
// import { useSizeHandle } from "../../hooks/use-size-handle";
import { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import { useComposedRefs } from "@creatorem/ai-chat/utils";
import { useSizeHandle } from "../../hooks/use-size-handle";

export namespace ThreadPrimitiveViewportFooter {
  export type Element = RuntimeComponents["Box"];
  export type Props = ComponentPropsWithoutRef<RuntimeComponents["Box"]>;
}

/**
 * A footer container that measures its height for scroll calculations.
 *
 * This component measures its height and provides it to the viewport context
 * for use in scroll calculations (e.g., ViewportSlack min-height).
 *
 * Multiple ViewportFooter components can be used - their heights are summed.
 *
 * Typically used with `className="sticky bottom-0"` to keep the footer
 * visible at the bottom of the viewport while scrolling.
 *
 * @example
 * ```tsx
 * <ThreadPrimitive.Viewport>
 *   <ThreadPrimitive.Messages components={{ ... }} />
 *   <ThreadPrimitive.ViewportFooter className="sticky bottom-0">
 *     <Composer />
 *   </ThreadPrimitive.ViewportFooter>
 * </ThreadPrimitive.Viewport>
 * ```
 */
export const ThreadPrimitiveViewportFooter = forwardRef<
  ThreadPrimitiveViewportFooter.Element,
  ThreadPrimitiveViewportFooter.Props
>((props, forwardedRef) => {
  const {
    components: { Box },
  } = useRuntime();
  const setInsetHeight = useThreadViewport((s) => s.setInsetHeight);

  // todo this is web specific, we should use the runtime to get the height
  const getHeight = useCallback((el: HTMLElement) => {
    const marginTop = parseFloat(getComputedStyle(el).marginTop) || 0;
    return el.offsetHeight + marginTop;
  }, []);

  const resizeRef = useSizeHandle(setInsetHeight, getHeight);

  const ref = useComposedRefs(forwardedRef, resizeRef as React.Ref<unknown>);

  return <Box {...props} ref={ref} />;
});

ThreadPrimitiveViewportFooter.displayName = "ThreadPrimitive.ViewportFooter";
