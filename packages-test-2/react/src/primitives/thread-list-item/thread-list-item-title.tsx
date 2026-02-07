"use client";

import type { FC, ReactNode } from "react";
import { useAiChat } from "@creatorem/ai-store";

export namespace ThreadListItemPrimitiveTitle {
  export type Props = {
    fallback?: ReactNode;
  };
}

export const ThreadListItemPrimitiveTitle: FC<
  ThreadListItemPrimitiveTitle.Props
> = ({ fallback }) => {
  const title = useAiChat(({ threadListItem }) => threadListItem.title);
  return <>{title || fallback}</>;
};

ThreadListItemPrimitiveTitle.displayName = "ThreadListItemPrimitive.Title";
