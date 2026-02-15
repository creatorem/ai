"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createStore, useStore, type StoreApi } from "zustand";
import { useAiContext, useThreads } from "../../ai-provider";
import { emptyStorageThreadAdapter } from "../../adapters/empty-storage-adapter";

export type ThreadListItemMethods = {
  switchToThread(): void;
  archive(): void;
  unarchive(): void;
  delete(): void;
};

export type ThreadListItemState = {
  id: string;
  title: string;
  status: "regular" | "archived";
  index: number;
  archived: boolean;
  methods: ThreadListItemMethods;
};

const ThreadListItemStoreCtx =
  React.createContext<StoreApi<ThreadListItemState> | null>(null);

export function useThreadListItem(): ThreadListItemState;
export function useThreadListItem<T>(
  selector: (state: ThreadListItemState) => T,
): T;
export function useThreadListItem<T>(
  selector?: (state: ThreadListItemState) => T,
) {
  const store = React.useContext(ThreadListItemStoreCtx);
  if (!store)
    throw new Error(
      "useThreadListItem must be used within a ThreadListItemByIndexProvider.",
    );
  return useStore(store, selector as any);
}

export function useThreadListItemStore(): StoreApi<ThreadListItemState> {
  const store = React.useContext(ThreadListItemStoreCtx);
  if (!store)
    throw new Error(
      "useThreadListItemStore must be used within a ThreadListItemByIndexProvider.",
    );
  return store;
}

const removeFromList = (list: string[], id: string) =>
  list.filter((value) => value !== id);
const addUnique = (list: string[], id: string) =>
  list.includes(id) ? list : [...list, id];

export const ThreadListItemByIndexProvider: React.FC<
  React.PropsWithChildren<{ index: number; archived?: boolean }>
> = ({ index, archived = false, children }) => {
  const threadIds = useThreads((threads) =>
    archived ? threads.archivedThreadIds : threads.threadIds,
  );
  const threadId = threadIds[index];

  const setActiveThreadId = useThreads((threads) => threads.setActiveThreadId);
  const setThreadIds = useThreads((threads) => threads.setThreadIds);
  const setArchivedThreadIds = useThreads(
    (threads) => threads.setArchivedThreadIds,
  );
  const activeThreadId = useThreads((threads) => threads.activeThreadId);

  const adapter =
    useAiContext((ctx) => ctx.adapters?.thread) ?? emptyStorageThreadAdapter;
  const eventHandler = useAiContext((ctx) => ctx.eventHandler);

  const [title, setTitle] = useState("New thread");
  const [status, setStatus] = useState<"regular" | "archived">(
    archived ? "archived" : "regular",
  );

  useEffect(() => {
    let cancelled = false;

    if (!threadId) return undefined;

    if (adapter) {
      adapter
        .fetch(threadId)
        .then((thread) => {
          if (cancelled) return;
          setTitle(thread.title || "New thread");
          setStatus(thread.status);
        })
        .catch(() => {
          if (cancelled) return;
          setTitle(`Thread ${index + 1}`);
        });
    } else {
      setTitle(`Thread ${index + 1}`);
    }

    return () => {
      cancelled = true;
    };
  }, [adapter, index, threadId]);

  const storeRef = useRef<StoreApi<ThreadListItemState> | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createStore<ThreadListItemState>(() => ({
      id: threadId ?? "",
      title,
      status,
      index,
      archived,
      methods: {
        switchToThread: () => {
          if (!threadId) return;
          setActiveThreadId(threadId);
          eventHandler.trigger("threadListItem.switchedTo", { threadId });
        },
        archive: () => {
          if (!threadId) return;
          setThreadIds((prev) => removeFromList(prev, threadId));
          setArchivedThreadIds((prev) => addUnique(prev, threadId));
          if (activeThreadId === threadId) {
            setActiveThreadId(null);
          }
          storeRef.current?.setState({ status: "archived" });
        },
        unarchive: () => {
          if (!threadId) return;
          setArchivedThreadIds((prev) => removeFromList(prev, threadId));
          setThreadIds((prev) => addUnique(prev, threadId));
          storeRef.current?.setState({ status: "regular" });
        },
        delete: () => {
          if (!threadId) return;
          setThreadIds((prev) => removeFromList(prev, threadId));
          setArchivedThreadIds((prev) => removeFromList(prev, threadId));
          if (activeThreadId === threadId) {
            setActiveThreadId(null);
          }
        },
      },
    }));
  }

  useLayoutEffect(() => {
    if (!threadId) return;
    storeRef.current!.setState({
      id: threadId,
      title,
      status,
      index,
      archived,
      methods: {
        switchToThread: () => {
          setActiveThreadId(threadId);
          eventHandler.trigger("threadListItem.switchedTo", { threadId });
        },
        archive: () => {
          setThreadIds((prev) => removeFromList(prev, threadId));
          setArchivedThreadIds((prev) => addUnique(prev, threadId));
          if (activeThreadId === threadId) {
            setActiveThreadId(null);
          }
          storeRef.current?.setState({ status: "archived" });
        },
        unarchive: () => {
          setArchivedThreadIds((prev) => removeFromList(prev, threadId));
          setThreadIds((prev) => addUnique(prev, threadId));
          storeRef.current?.setState({ status: "regular" });
        },
        delete: () => {
          setThreadIds((prev) => removeFromList(prev, threadId));
          setArchivedThreadIds((prev) => removeFromList(prev, threadId));
          if (activeThreadId === threadId) {
            setActiveThreadId(null);
          }
        },
      },
    });
  });

  if (!threadId) return null;

  return (
    <ThreadListItemStoreCtx.Provider value={storeRef.current}>
      {children}
    </ThreadListItemStoreCtx.Provider>
  );
};
