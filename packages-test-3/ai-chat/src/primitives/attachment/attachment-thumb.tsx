"use client";

import { ComponentPropsWithoutRef, forwardRef, useMemo } from "react";
import { useAttachment } from "../attachment/attachment-by-index-provider";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";

export namespace AttachmentPrimitiveThumb {
  export type Element = RuntimeComponents["Box"];
  export type Props = ComponentPropsWithoutRef<RuntimeComponents["Box"]>;
}

export const AttachmentPrimitiveThumb = forwardRef<
  AttachmentPrimitiveThumb.Element,
  AttachmentPrimitiveThumb.Props
>((props, ref) => {
  const name = useAttachment((s) => s.name);
  const ext = useMemo(() => {
    const parts = name.split(".");
    return parts.length > 1 ? parts.pop()! : "";
  }, [name]);

  const {
    components: { Box },
  } = useRuntime();

  return (
    <Box {...props} ref={ref}>
      .{ext}
    </Box>
  );
});

AttachmentPrimitiveThumb.displayName = "AttachmentPrimitive.Thumb";
