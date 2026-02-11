"use client";

import { ComponentPropsWithoutRef, forwardRef } from "react";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";
// import { useThreadListItemMoreContext } from "./scope";

export namespace ThreadListItemMorePrimitiveContent {
  export type Element = RuntimeComponents['ThreadListItemMoreContent'];
  export type Props = ComponentPropsWithoutRef<
    RuntimeComponents['ThreadListItemMoreContent']
  > & {
    portalProps?: ComponentPropsWithoutRef<RuntimeComponents['ThreadListItemMorePortal']>
  };
}

export const ThreadListItemMorePrimitiveContent = forwardRef<
  ThreadListItemMorePrimitiveContent.Element,
  ThreadListItemMorePrimitiveContent.Props
>(({ sideOffset,portalProps, ...props }, forwardedRef) => {
  // const { open } = useThreadListItemMoreContext();
  const { components } = useRuntime();
  const { ThreadListItemMoreContent, ThreadListItemMorePortal } = components;

  if (!open) return null;

  // return <Box {...props} ref={forwardedRef} />;
      return (
      <ThreadListItemMorePortal /* {...scope} */ {...portalProps}>
        <ThreadListItemMoreContent
          // {...scope}
          {...props}
          ref={forwardedRef}
          sideOffset={sideOffset}
        />
      </ThreadListItemMorePortal>
    );
});

ThreadListItemMorePrimitiveContent.displayName =
  "ThreadListItemMorePrimitive.Content";
