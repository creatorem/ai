"use client";

import { Primitive } from "@radix-ui/react-primitive";
import { type ComponentRef, forwardRef, ComponentPropsWithoutRef, useMemo } from "react";
import { useMessage } from "../message/message-by-index-provider";

export namespace ErrorPrimitiveMessage {
  export type Element = ComponentRef<typeof Primitive.span>;
  export type Props = ComponentPropsWithoutRef<typeof Primitive.span>;
}

export const ErrorPrimitiveMessage = forwardRef<
  ErrorPrimitiveMessage.Element,
  ErrorPrimitiveMessage.Props
>(({ children, ...props }, forwardRef) => {
  const status = useMessage(s => s.status);
  
  const error = useMemo(() => {
    return status?.type === "incomplete" &&
      status.reason === "error"
      ? status.error
      : undefined;
  }, [status]);

  if (error === undefined) return null;

  return (
    <Primitive.span {...props} ref={forwardRef}>
      {children ?? String(error)}
    </Primitive.span>
  );
});

ErrorPrimitiveMessage.displayName = "ErrorPrimitive.Message";
