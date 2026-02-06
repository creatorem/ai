"use client";

import type { FC, PropsWithChildren } from "react";
import { useAiChat, AiChatStore } from "./store";

export namespace AiUiIf {
  export type Props = PropsWithChildren<{ condition: AiUiIf.Condition }>;
  export type Condition = (state: AiChatStore) => boolean;
}

export const AiUiIf: FC<AiUiIf.Props> = ({ children, condition }) => {
  const result = useAiChat(condition);
  return result ? children : null;
};

AiUiIf.displayName = "AiUiIf";
