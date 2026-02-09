"use client";

import type { ThreadAdapter } from "../types/adapters";
import type { Thread, Threads } from "../types/entities";
import type { UIMessage } from "ai";
import type { CustomUIDataTypes } from "../primitives/thread/thread-root";

const STORAGE_KEY = "ai-chat-threads";

type StoredThread = {
  id: string;
  title: string;
  status: "regular" | "archived";
  messages: UIMessage<unknown, CustomUIDataTypes>[];
  createdAt: number;
  updatedAt: number;
};

type StoredData = {
  threads: Record<string, StoredThread>;
  threadOrder: string[];
};

function getStoredData(): StoredData {
  if (typeof window === "undefined") {
    return { threads: {}, threadOrder: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { threads: {}, threadOrder: [] };
    return JSON.parse(raw) as StoredData;
  } catch {
    return { threads: {}, threadOrder: [] };
  }
}

function setStoredData(data: StoredData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const localStorageThreadAdapter: ThreadAdapter = {
  async list(): Promise<Pick<Threads, "threadIds" | "archivedThreadIds">> {
    const data = getStoredData();
    const threadIds: string[] = [];
    const archivedThreadIds: string[] = [];

    for (const id of data.threadOrder) {
      const thread = data.threads[id];
      if (thread) {
        if (thread.status === "archived") {
          archivedThreadIds.push(id);
        } else {
          threadIds.push(id);
        }
      }
    }

    return { threadIds, archivedThreadIds };
  },

  async fetch(
    threadId: string
  ): Promise<Pick<Thread, "title" | "status" | "messages">> {
    const data = getStoredData();
    const thread = data.threads[threadId];

    if (!thread) {
      return {
        title: "New Thread",
        status: "regular",
        messages: [],
      };
    }

    return {
      title: thread.title,
      status: thread.status,
      messages: thread.messages,
    };
  },

  async save(
    threadId: string,
    thread: Pick<Thread, "title" | "status" | "messages">
  ): Promise<void> {
    saveThread(threadId, thread);
  },

  async delete(threadId: string): Promise<void> {
    deleteThread(threadId);
  },
};

// Helper functions for saving threads (to be used externally)
export function saveThread(
  threadId: string,
  thread: Pick<StoredThread, "title" | "status" | "messages">
): void {
  const data = getStoredData();
  const existing = data.threads[threadId];
  const now = Date.now();

  data.threads[threadId] = {
    id: threadId,
    title: thread.title,
    status: thread.status,
    messages: thread.messages,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  if (!data.threadOrder.includes(threadId)) {
    data.threadOrder.unshift(threadId);
  }

  setStoredData(data);
}

export function deleteThread(threadId: string): void {
  const data = getStoredData();
  delete data.threads[threadId];
  data.threadOrder = data.threadOrder.filter((id) => id !== threadId);
  setStoredData(data);
}

export function archiveThread(threadId: string): void {
  const data = getStoredData();
  const thread = data.threads[threadId];
  if (thread) {
    thread.status = "archived";
    thread.updatedAt = Date.now();
    setStoredData(data);
  }
}

export function unarchiveThread(threadId: string): void {
  const data = getStoredData();
  const thread = data.threads[threadId];
  if (thread) {
    thread.status = "regular";
    thread.updatedAt = Date.now();
    setStoredData(data);
  }
}

export function renameThread(threadId: string, newTitle: string): void {
  const data = getStoredData();
  const thread = data.threads[threadId];
  if (thread) {
    thread.title = newTitle;
    thread.updatedAt = Date.now();
    setStoredData(data);
  }
}

export function clearAllThreads(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
