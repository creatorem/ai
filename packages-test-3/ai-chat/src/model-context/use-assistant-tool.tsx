"use client";

import { useEffect } from "react";
import { useThread } from "../primitives/thread";
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
  const setToolUI = useThread((s) => s.tools.methods.setToolUI);
  const registerTool = useThread((s) => s.tools.methods.registerTool);

  useEffect(() => {
    if (!tool?.toolName) return undefined;
    if (!tool.render) return undefined;
    return setToolUI(tool.toolName, tool.render);
  }, [setToolUI, tool?.toolName, tool?.render]);

  useEffect(() => {
    if (!tool?.toolName) return undefined;
    const { toolName, render, ...rest } = tool;
    return registerTool(toolName, rest);
  }, [registerTool, tool]);
};
