"use client";

import { FC, PropsWithChildren, useMemo } from "react";
import { useMessage } from './message-root';

export const MessagePrimitiveError: FC<PropsWithChildren> = ({ children }) => {
  const status = useMessage(s => s.status);

  const hasError = useMemo(
    () =>
      status?.type === "incomplete" &&
      status.reason === "error"
    , [status]);
  return hasError ? children : null;
};

MessagePrimitiveError.displayName = "MessagePrimitive.Error";
