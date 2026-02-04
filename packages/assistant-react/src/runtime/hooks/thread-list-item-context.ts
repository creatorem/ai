"use client";

import { ThreadListItemRuntime } from "../runtime/thread-list-item-runtime";
import { createStateHookForRuntime } from "../../context/react/utils/create-state-hook-for-runtime";
import { useAui, useAuiState } from "@creatorem/ai-store";

/**
 * @deprecated Use `useAui()` with `aui.threadListItem()` instead. See migration guide: https://assistant-ui.com/docs/migrations/v0-12
 */
export function useThreadListItemRuntime(options?: {
  optional?: false | undefined;
}): ThreadListItemRuntime;
export function useThreadListItemRuntime(options?: {
  optional?: boolean | undefined;
}): ThreadListItemRuntime | null;
export function useThreadListItemRuntime(options?: {
  optional?: boolean | undefined;
}) {
  const aui = useAui();
  const runtime = useAuiState(() =>
    aui.threadListItem.source
      ? (aui.threadListItem().__internal_getRuntime?.() ?? null)
      : null,
  );
  if (!runtime && !options?.optional) {
    throw new Error("ThreadListItemRuntime is not available");
  }
  return runtime;
}

/**
 * @deprecated Use `useAuiState(({ threadListItem }) => threadListItem)` instead. See migration guide: https://assistant-ui.com/docs/migrations/v0-12
 */
export const useThreadListItem = createStateHookForRuntime(
  useThreadListItemRuntime,
);
