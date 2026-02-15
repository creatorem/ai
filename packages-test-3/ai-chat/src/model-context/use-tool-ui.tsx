"use client";

import { useEffect } from "react";
import {  useAiContext } from "../ai-provider";
import { UITool } from "../types/tools-types";

export const useToolUI = <TArgs, TResult>(
  tool: UITool<TArgs, TResult> | null,
) => {
  const upsertTool = useAiContext((s) => s.upsertTool);

  useEffect(() => {
    if (!tool?.toolName || !tool?.render) return undefined;
    return upsertTool(tool);
  }, [upsertTool, tool?.toolName, tool?.render]);
};
