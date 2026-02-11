"use client";

import { type ComponentRef, forwardRef, ComponentPropsWithoutRef, useMemo } from "react";
import { useMessage } from "../message/message-by-index-provider";
import { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import { useRuntime } from "@creatorem/ai-chat/runtime";

export namespace ErrorPrimitiveMessage {
  export type Element = ComponentRef<RuntimeComponents['Text']>;
  export type Props = ComponentPropsWithoutRef<RuntimeComponents['Text']>;
}

export const ErrorPrimitiveMessage = forwardRef<
  ErrorPrimitiveMessage.Element,
  ErrorPrimitiveMessage.Props
>(({ children, ...props }, forwardRef) => {
  const {components: {Text}} = useRuntime()
  const status = useMessage(s => s.status);
  
  const error = useMemo(() => {
    return status?.type === "incomplete" &&
      status.reason === "error"
      ? status.error
      : undefined;
  }, [status]);

  if (error === undefined) return null;

  return (
    <Text {...props} ref={forwardRef}>
      {children ?? String(error)}
    </Text>
  );
});

ErrorPrimitiveMessage.displayName = "ErrorPrimitive.Message";
