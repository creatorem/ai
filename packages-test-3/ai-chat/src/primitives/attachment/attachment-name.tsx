"use client";

import type { FC } from "react";
import { useAttachment } from "./attachment-by-index-provider";

export namespace AttachmentPrimitiveName {
  export type Props = Record<string, never>;
}

export const AttachmentPrimitiveName: FC<
  AttachmentPrimitiveName.Props
> = () => {
  const name = useAttachment(s => s.name);
  return <>{name}</>;
};

AttachmentPrimitiveName.displayName = "AttachmentPrimitive.Name";
