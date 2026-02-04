"use client";

import { useEffect } from "react";
import { useAui } from "@creatorem/ai-assistant-store";
import type { ToolCallMessagePartComponent } from "../types/message-part-component-types";

export type AssistantToolUIProps<TArgs, TResult> = {
  toolName: string;
  render: ToolCallMessagePartComponent<TArgs, TResult>;
};

export const useAssistantToolUI = (
  tool: AssistantToolUIProps<any, any> | null,
) => {
  const aui = useAui();
  useEffect(() => {
    if (!tool?.toolName || !tool?.render) return undefined;
    return aui.tools().setToolUI(tool.toolName, tool.render);
  }, [aui, tool?.toolName, tool?.render]);
};
