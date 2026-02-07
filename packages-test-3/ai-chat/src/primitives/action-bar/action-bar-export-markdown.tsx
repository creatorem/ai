"use client";

import { forwardRef, useCallback, useMemo } from "react";
import { ActionButtonProps } from "../../utils/create-action-button";
import { composeEventHandlers } from "@radix-ui/primitive";
import { Primitive } from "@radix-ui/react-primitive";
import { useMessage } from "../message/message-by-index-provider";

const useActionBarExportMarkdown = ({
  filename,
  onExport,
}: {
  filename?: string | undefined;
  onExport?: ((content: string) => void | Promise<void>) | undefined;
} = {}) => {
  const {status, parts,getCopyText, role} = useMessage();
  const hasExportableContent = useMemo(() => {
    return (
      (role !== "assistant" || status?.type !== "running") &&
      parts.some((c) => c.type === "text" && c.text.length > 0)
    );
  }, [status, parts, role]);

  const callback = useCallback(async () => {
    const content = getCopyText();
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
  }, [getCopyText, filename, onExport]);

  if (!hasExportableContent) return null;
  return callback;
};

export namespace ActionBarPrimitiveExportMarkdown {
  export type Element = HTMLButtonElement;
  export type Props = ActionButtonProps<typeof useActionBarExportMarkdown>;
}

export const ActionBarPrimitiveExportMarkdown = forwardRef<
  ActionBarPrimitiveExportMarkdown.Element,
  ActionBarPrimitiveExportMarkdown.Props
>(({ filename, onExport, onClick, disabled, ...props }, forwardedRef) => {
  const callback = useActionBarExportMarkdown({ filename, onExport });
  return (
    <Primitive.button
      type="button"
      {...props}
      ref={forwardedRef}
      disabled={disabled || !callback}
      onClick={composeEventHandlers(onClick, () => {
        callback?.();
      })}
    />
  );
});

ActionBarPrimitiveExportMarkdown.displayName =
  "ActionBarPrimitive.ExportMarkdown";
