"use client";

import { AutoScrollConfig } from "@creatorem/ai-chat/hook-types";
import { ThreadPrimitiveViewportProvider } from "./thread-viewport-provider";

export namespace ThreadPrimitiveViewport {
  export type Props = {
    children: React.ReactNode;
  } & AutoScrollConfig;
}

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
export const ThreadPrimitiveViewport = ({
  turnAnchor,
  children,
}: ThreadPrimitiveViewport.Props) => {
  return (
    <ThreadPrimitiveViewportProvider options={{ turnAnchor }}>
      {children}
    </ThreadPrimitiveViewportProvider>
  );
};
