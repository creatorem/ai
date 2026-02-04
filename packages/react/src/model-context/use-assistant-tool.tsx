"use client";

import { useEffect } from "react";
import { useAui } from "@creatorem/ai-store";
import type { ToolCallMessagePartComponent } from "../types/message-part-component-types";
import type { Tool } from "@creatorem/stream";

export type AssistantToolProps<
  TArgs extends Record<string, unknown>,
  TResult,
> = Tool<TArgs, TResult> & {
  toolName: string;
  render?: ToolCallMessagePartComponent<TArgs, TResult> | undefined;
};

export const useAssistantTool = <
  TArgs extends Record<string, unknown>,
  TResult,
>(
  tool: AssistantToolProps<TArgs, TResult>,
) => {
  const aui = useAui();

  useEffect(() => {
    if (!tool.render) return undefined;
    return aui.tools().setToolUI(tool.toolName, tool.render);
  }, [aui, tool.toolName, tool.render]);

  useEffect(() => {
    const { toolName, render, ...rest } = tool;
    const context = {
      tools: {
        [toolName]: rest,
      },
    };
    return aui.modelContext().register({
      getModelContext: () => context,
    });
  }, [aui, tool]);
};
