"use client";

import { ComponentPropsWithoutRef, forwardRef } from "react";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";

export namespace AttachmentPrimitiveRoot {
  export type Element = RuntimeComponents['Box'];
  export type Props = ComponentPropsWithoutRef<RuntimeComponents['Box']>
}

/**
 * The root container component for an attachment.
 *
 * This component provides the foundational wrapper for attachment-related components
 * and content. It serves as the context provider for attachment state and actions.
 *
 * @example
 * ```tsx
 * <AttachmentPrimitive.Root>
 *   <AttachmentPrimitive.Name />
 *   <AttachmentPrimitive.Remove />
 * </AttachmentPrimitive.Root>
 * ```
 */
export const AttachmentPrimitiveRoot = forwardRef<
  AttachmentPrimitiveRoot.Element,
  AttachmentPrimitiveRoot.Props
>((props, ref) => {
  const { components: {Box} } = useRuntime();

  return <Box {...props} ref={ref} />;
});

AttachmentPrimitiveRoot.displayName = "AttachmentPrimitive.Root";
