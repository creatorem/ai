"use client";

import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from "react";
// import { ScopedProps , useDropdownMenuScope } from "./scope";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";

export namespace ActionBarMorePrimitiveContent {
  export type Element = ComponentRef<RuntimeComponents['ActionBarContent']>;
  export type Props = ComponentPropsWithoutRef<
    RuntimeComponents['ActionBarContent']
  > & {
    portalProps?:
      | ComponentPropsWithoutRef<RuntimeComponents['ActionBarPortal']>
      | undefined;
  };
}

export const ActionBarMorePrimitiveContent = forwardRef<
  ActionBarMorePrimitiveContent.Element,
  ActionBarMorePrimitiveContent.Props
>(
  (
    {
      // __scopeActionBarMore,
      portalProps,
      sideOffset = 4,
      ...props
    }: ActionBarMorePrimitiveContent.Props,
    forwardedRef,
  ) => {
    // const scope = useDropdownMenuScope(__scopeActionBarMore);
    const {components:{ActionBarPortal, ActionBarContent}} = useRuntime();

    return (
      <ActionBarPortal /* {...scope} */ {...portalProps}>
        <ActionBarContent
          /* {...scope} */
          {...props}
          ref={forwardedRef}
          sideOffset={sideOffset}
        />
      </ActionBarPortal>
    );
  },
);

ActionBarMorePrimitiveContent.displayName = "ActionBarMorePrimitive.Content";
