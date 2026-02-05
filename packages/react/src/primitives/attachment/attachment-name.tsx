"use client";

import type { FC } from "react";
import { useAiChat } from "@creatorem/ai-store";

export namespace AttachmentPrimitiveName {
  export type Props = Record<string, never>;
}

export const AttachmentPrimitiveName: FC<
  AttachmentPrimitiveName.Props
> = () => {
  const name = useAiChat(({ attachment }) => attachment.name);
  return <>{name}</>;
};

AttachmentPrimitiveName.displayName = "AttachmentPrimitive.Name";
