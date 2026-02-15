"use client";

import type { FC, ReactNode } from "react";
import { useThreadListItem } from "./thread-list-item-by-index-provider";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import { RuntimeComponents } from "@creatorem/ai-chat/component-types";

export namespace ThreadListItemPrimitiveTitle {
  export type Props = React.ComponentPropsWithoutRef<
    RuntimeComponents["Text"]
  > & {
    fallback?: ReactNode;
  };
}

export const ThreadListItemPrimitiveTitle: FC<
  ThreadListItemPrimitiveTitle.Props
> = ({ fallback, ...props }) => {
  const title = useThreadListItem((thread) => thread.title);
  const { Text } = useRuntime().components;
  return <Text {...props}>{title ? title + "..." : fallback}</Text>;
};

ThreadListItemPrimitiveTitle.displayName = "ThreadListItemPrimitive.Title";
