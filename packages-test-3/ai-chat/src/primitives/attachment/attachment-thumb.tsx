"use client";

import { ComponentPropsWithoutRef, forwardRef, useMemo, type ComponentRef } from "react";
import { Primitive } from "@radix-ui/react-primitive";
import { useAttachment } from "./attachment-by-index-provider";

type PrimitiveDivProps = ComponentPropsWithoutRef<typeof Primitive.div>;

export namespace AttachmentPrimitiveThumb {
  export type Element = ComponentRef<typeof Primitive.div>;
  export type Props = PrimitiveDivProps;
}

export const AttachmentPrimitiveThumb = forwardRef<
  AttachmentPrimitiveThumb.Element,
  AttachmentPrimitiveThumb.Props
>((props, ref) => {
  const name = useAttachment(s => s.name);
  const ext = useMemo(() => {
    const parts = name.split(".");
    return parts.length > 1 ? parts.pop()! : "";
  }, [name]);
  return (
    <Primitive.div {...props} ref={ref}>
      .{ext}
    </Primitive.div>
  );
});

AttachmentPrimitiveThumb.displayName = "AttachmentPrimitive.Thumb";
