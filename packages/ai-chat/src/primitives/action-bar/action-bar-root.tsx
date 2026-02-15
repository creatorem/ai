"use client";

import { forwardRef, ComponentPropsWithoutRef } from "react";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import {
  useActionBarFloatStatus,
  HideAndFloatStatus,
} from "./use-action-bar-float-status";

export namespace ActionBarPrimitiveRoot {
  export type Element = RuntimeComponents["Box"];
  export type Props = ComponentPropsWithoutRef<RuntimeComponents["Box"]> & {
    /**
     * Whether to hide the action bar when the thread is running.
     * @default false
     */
    hideWhenRunning?: boolean | undefined;
    /**
     * Controls when the action bar should automatically hide.
     * - "always": Always hide unless hovered
     * - "not-last": Hide unless this is the last message
     * - "never": Never auto-hide
     * @default "never"
     */
    autohide?: "always" | "not-last" | "never" | undefined;
    /**
     * Controls floating behavior when auto-hidden.
     * - "always": Always float when hidden
     * - "single-branch": Float only for single-branch messages
     * - "never": Never float
     * @default "never"
     */
    autohideFloat?: "always" | "single-branch" | "never" | undefined;
  };
}

/**
 * The root container for action bar components.
 *
 * This component provides intelligent visibility and floating behavior for action bars,
 * automatically hiding and showing based on message state, hover status, and configuration.
 * It supports floating mode for better UX when space is limited.
 *
 * @example
 * ```tsx
 * <ActionBarPrimitive.Root
 *   hideWhenRunning={true}
 *   autohide="not-last"
 *   autohideFloat="single-branch"
 * >
 *   <ActionBarPrimitive.Copy />
 *   <ActionBarPrimitive.Edit />
 *   <ActionBarPrimitive.Reload />
 * </ActionBarPrimitive.Root>
 * ```
 */
export const ActionBarPrimitiveRoot = forwardRef<
  ActionBarPrimitiveRoot.Element,
  ActionBarPrimitiveRoot.Props
>(({ hideWhenRunning, autohide, autohideFloat, ...rest }, ref) => {
  const hideAndfloatStatus = useActionBarFloatStatus({
    hideWhenRunning,
    autohide,
    autohideFloat,
  });

  const {
    components: { Box },
  } = useRuntime();

  if (hideAndfloatStatus === HideAndFloatStatus.Hidden) return null;

  return (
    <Box
      {...(hideAndfloatStatus === HideAndFloatStatus.Floating
        ? { "data-floating": "true" }
        : null)}
      {...rest}
      ref={ref}
    />
  );
});

ActionBarPrimitiveRoot.displayName = "ActionBarPrimitive.Root";
