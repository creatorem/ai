"use client";

import { type FC, type PropsWithChildren } from "react";
import { useAui, AuiProvider, Derived } from "@creatorem/ai-store";
import type { ThreadListItemRuntime } from "../../runtime/runtime/thread-list-item-runtime";
import { ThreadListItemClient } from "../../runtime/client/thread-list-item-runtime-client";

export const ThreadListItemByIndexProvider: FC<
  PropsWithChildren<{
    index: number;
    archived: boolean;
  }>
> = ({ index, archived, children }) => {
  const aui = useAui({
    threadListItem: Derived({
      source: "threads",
      query: { type: "index", index, archived },
      get: (aui) => aui.threads().item({ index, archived }),
    }),
  });

  return <AuiProvider value={aui}>{children}</AuiProvider>;
};

export const ThreadListItemRuntimeProvider: FC<
  PropsWithChildren<{
    runtime: ThreadListItemRuntime;
  }>
> = ({ runtime, children }) => {
  const aui = useAui({
    threadListItem: ThreadListItemClient({ runtime }),
  });

  return <AuiProvider value={aui}>{children}</AuiProvider>;
};
