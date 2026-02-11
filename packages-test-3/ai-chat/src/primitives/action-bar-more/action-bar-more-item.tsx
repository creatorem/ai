"use client";

import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from "react";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";

export namespace ActionBarMorePrimitiveItem {
  export type Element = ComponentRef<RuntimeComponents['ActionBarItem']>;
  export type Props = ComponentPropsWithoutRef<
    RuntimeComponents['ActionBarItem']
  >;
}

export const ActionBarMorePrimitiveItem = forwardRef<
  ActionBarMorePrimitiveItem.Element,
  ActionBarMorePrimitiveItem.Props
>(
  (
    {
      // __scopeActionBarMore,
      ...rest
    }: ActionBarMorePrimitiveItem.Props,
    ref,
  ) => {
        const {components:{ActionBarItem}} = useRuntime();
    // const scope = useDropdownMenuScope(__scopeActionBarMore);

    return <ActionBarItem /* {...scope} */ {...rest} ref={ref} />;
  },
);

ActionBarMorePrimitiveItem.displayName = "ActionBarMorePrimitive.Item";
