"use client";

import { FC, PropsWithChildren } from "react";
import { useAiChat } from "@creatorem/ai-store";

export const MessagePrimitiveError: FC<PropsWithChildren> = ({ children }) => {
  const hasError = useAiChat(
    ({ message }) =>
      message.status?.type === "incomplete" &&
      message.status.reason === "error",
  );
  return hasError ? children : null;
};

MessagePrimitiveError.displayName = "MessagePrimitive.Error";
