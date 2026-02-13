"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as MessagePrimitive from "../message";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";

export namespace BranchPickerPrimitiveRoot {
  export type Element = RuntimeComponents['Box'];
  export type Props = ComponentPropsWithoutRef<RuntimeComponents['Box']> & {
    hideWhenSingleBranch?: boolean;
  };
}

/**
 * The root container for branch picker components.
 *
 * This component provides a container for branch navigation controls,
 * with optional conditional rendering based on the number of available branches.
 * It integrates with the message branching system to allow users to navigate
 * between different response variations.
 *
 * @example
 * ```tsx
 * <BranchPickerPrimitive.Root hideWhenSingleBranch={true}>
 *   <BranchPickerPrimitive.Previous />
 *   <BranchPickerPrimitive.Count />
 *   <BranchPickerPrimitive.Next />
 * </BranchPickerPrimitive.Root>
 * ```
 */
export const BranchPickerPrimitiveRoot = forwardRef<
  BranchPickerPrimitiveRoot.Element,
  BranchPickerPrimitiveRoot.Props
>(({ hideWhenSingleBranch, ...rest }, ref) => {
  const { components: {Box} } = useRuntime();

  return (
    <MessagePrimitive.If hasBranches={hideWhenSingleBranch ? true : undefined}>
      <Box {...rest} ref={ref} />
    </MessagePrimitive.If>
  );
});

BranchPickerPrimitiveRoot.displayName = "BranchPickerPrimitive.Root";
