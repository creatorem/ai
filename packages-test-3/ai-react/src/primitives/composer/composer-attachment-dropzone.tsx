"use client";

import { forwardRef, useCallback, useState } from "react";
import React from "react";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import { useComposerStore } from "@creatorem/ai-chat/primitives/composer";

export namespace ComposerPrimitiveAttachmentDropzone {
  export type Element = RuntimeComponents['Box'];
  export type Props = React.ComponentPropsWithoutRef<RuntimeComponents['Box']> & {
    disabled?: boolean | undefined;
  };
}

export const ComposerPrimitiveAttachmentDropzone = forwardRef<
  ComposerPrimitiveAttachmentDropzone.Element,
  ComposerPrimitiveAttachmentDropzone.Props
>(({ disabled, children, ...rest }, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const composerStore = useComposerStore();
  const { components: { Box } } = useRuntime();

  const handleDragEnterCapture = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(true);
    },
    [disabled],
  );

  const handleDragOverCapture = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      if (!isDragging) setIsDragging(true);
    },
    [disabled, isDragging],
  );

  const handleDragLeaveCapture = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      const next = e.relatedTarget as Node | null;
      if (next && e.currentTarget.contains(next)) {
        return;
      }
      setIsDragging(false);
    },
    [disabled],
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(false);
      for (const file of e.dataTransfer.files) {
        try {
          await composerStore.getState().addAttachment(file);
        } catch (error) {
          console.error("Failed to add attachment:", error);
        }
      }
    },
    [disabled, composerStore],
  );

  const dragProps = {
    onDragEnterCapture: handleDragEnterCapture,
    onDragOverCapture: handleDragOverCapture,
    onDragLeaveCapture: handleDragLeaveCapture,
    onDropCapture: handleDrop,
  };

  return (
    <Box
      {...(isDragging ? { "data-dragging": "true" } : null)}
      ref={ref}
      {...dragProps}
      {...rest}
    >
      {children}
    </Box>
  );
});

ComposerPrimitiveAttachmentDropzone.displayName =
  "ComposerPrimitive.AttachmentDropzone";
