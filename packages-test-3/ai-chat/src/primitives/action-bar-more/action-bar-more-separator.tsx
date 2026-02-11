"use client";

import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from "react";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";

export namespace ActionBarMorePrimitiveSeparator {
  export type Element = ComponentRef<RuntimeComponents['ActionBarSeparator']>;
  export type Props = ComponentPropsWithoutRef<
    RuntimeComponents['ActionBarSeparator']
  >;
}

export const ActionBarMorePrimitiveSeparator = forwardRef<
  ActionBarMorePrimitiveSeparator.Element,
  ActionBarMorePrimitiveSeparator.Props
>(
  (
    {
      // __scopeActionBarMore,
      ...rest
    // }: ScopedProps<ActionBarMorePrimitiveSeparator.Props>,
    }: ActionBarMorePrimitiveSeparator.Props,
    ref,
  ) => {
    const {components:{ActionBarSeparator}} = useRuntime();
    // const scope = useDropdownMenuScope(__scopeActionBarMore);

    return <ActionBarSeparator /* {...scope} */ {...rest} ref={ref} />;
  },
);

ActionBarMorePrimitiveSeparator.displayName =
  "ActionBarMorePrimitive.Separator";
