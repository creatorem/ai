"use client";

import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from "react";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";

export namespace ActionBarMorePrimitiveTrigger {
  export type Element = ComponentRef<RuntimeComponents['ActionBarTrigger']>;
  export type Props = ComponentPropsWithoutRef<
    RuntimeComponents['ActionBarTrigger']
  >;
}

export const ActionBarMorePrimitiveTrigger = forwardRef<
  ActionBarMorePrimitiveTrigger.Element,
  ActionBarMorePrimitiveTrigger.Props
>(
  (
    {
      // __scopeActionBarMore,
      ...rest
    // }: ScopedProps<ActionBarMorePrimitiveTrigger.Props>,
    }: ActionBarMorePrimitiveTrigger.Props,
    ref,
  ) => {
    const {components: {ActionBarTrigger}} = useRuntime()
    // const scope = useDropdownMenuScope(__scopeActionBarMore);

    return <ActionBarTrigger /* {...scope} */ {...rest} ref={ref} />;
  },
);

ActionBarMorePrimitiveTrigger.displayName = "ActionBarMorePrimitive.Trigger";
