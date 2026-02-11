"use client";

import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import { ComponentProps, forwardRef } from "react";

export namespace ErrorPrimitiveRoot {
  export type Element = RuntimeComponents['Box'];
  export type Props = ComponentProps<RuntimeComponents['Box']>;
}

export const ErrorPrimitiveRoot = forwardRef<
  ErrorPrimitiveRoot.Element,
  ErrorPrimitiveRoot.Props
>((props, forwardRef) => {
  const { components: { Box } } = useRuntime();
  return <Box role="alert" {...props} ref={forwardRef} />;
});

ErrorPrimitiveRoot.displayName = "ErrorPrimitive.Root";
