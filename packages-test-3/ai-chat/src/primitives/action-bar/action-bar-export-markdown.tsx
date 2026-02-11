"use client";

import { forwardRef, useCallback, useMemo } from "react";
import { ActionButtonProps } from "../../utils/create-action-button";
import { useMessage, useMessageStore } from "../message/message-by-index-provider";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";

const useActionBarExportMarkdown = ({
  filename,
  onExport,
}: {
  filename?: string | undefined;
  onExport?: ((content: string) => void | Promise<void>) | undefined;
} = {}) => {
  const status = useMessage(s => s.status);
  const parts = useMessage(s => s.parts);
  const role = useMessage(s => s.role);
  const messageStore = useMessageStore();

  const hasExportableContent = useMemo(() => {
    return (
      (role !== "assistant" || status?.type !== "running") &&
      parts.some((c) => c.type === "text" && c.text.length > 0)
    );
  }, [status, parts, role]);

  const callback = useCallback(async () => {
    const content = messageStore.getState().getCopyText();
    if (!content) return;

    if (onExport) {
      await onExport(content);
      return;
    }

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename ?? `message-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [messageStore, filename, onExport]);

  if (!hasExportableContent) return null;
  return callback;
};

export namespace ActionBarPrimitiveExportMarkdown {
  export type Element = RuntimeComponents['Button'];
  export type Props = ActionButtonProps<typeof useActionBarExportMarkdown>;
}

export const ActionBarPrimitiveExportMarkdown = forwardRef<
  ActionBarPrimitiveExportMarkdown.Element,
  ActionBarPrimitiveExportMarkdown.Props
>(({ filename, onExport, onClick, disabled, ...props }, forwardedRef) => {
  const callback = useActionBarExportMarkdown({ filename, onExport });

  const { components } = useRuntime();
  const { Button } = components;

  return (
    // @ts-ignore
    <Button
      type="button"
      {...props}
      ref={forwardedRef}
      disabled={disabled || !callback}
      onClick={((e) => {
        onClick?.(e);
        callback?.();
      })}
    />
  );
});

ActionBarPrimitiveExportMarkdown.displayName =
  "ActionBarPrimitive.ExportMarkdown";
