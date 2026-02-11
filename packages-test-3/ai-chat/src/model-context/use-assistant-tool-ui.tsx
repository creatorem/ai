"use client";

import { useEffect } from "react";
import { useThread } from "@creatorem/ai-chat/primitives/thread";
import type { ToolCallMessagePartComponent } from "../types/message-part-component-types";

export type AssistantToolUIProps<TArgs, TResult> = {
  toolName: string;
  render: ToolCallMessagePartComponent<TArgs, TResult>;
};

export const useAssistantToolUI = (
  tool: AssistantToolUIProps<any, any> | null,
) => {
  const setToolUI = useThread((s) => s.tools.methods.setToolUI);

  useEffect(() => {
    if (!tool?.toolName || !tool?.render) return undefined;
    return setToolUI(tool.toolName, tool.render);
  }, [setToolUI, tool?.toolName, tool?.render]);
};
