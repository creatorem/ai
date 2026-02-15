import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ThreadAdapter } from "@creatorem/ai-chat/types/adapters";
import type { Thread, Threads } from "@creatorem/ai-chat/types/entities";
import type { UIMessage } from "ai";
import type { CustomUIDataTypes } from "@creatorem/ai-chat/primitives/thread";

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

async function getStoredData(): Promise<StoredData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { threads: {}, threadOrder: [] };
    return JSON.parse(raw) as StoredData;
  } catch {
    return { threads: {}, threadOrder: [] };
  }
}

async function setStoredData(data: StoredData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore write errors to keep the adapter resilient.
  }
}

export const asyncStorageThreadAdapter: ThreadAdapter = {
  async list(): Promise<Pick<Threads, "threadIds" | "archivedThreadIds">> {
    const data = await getStoredData();
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
    threadId: string,
  ): Promise<Pick<Thread, "title" | "status" | "messages">> {
    const data = await getStoredData();
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
    thread: Pick<Thread, "title" | "status" | "messages">,
  ): Promise<void> {
    await saveThread(threadId, thread);
  },

  async delete(threadId: string): Promise<void> {
    await deleteThread(threadId);
  },
};

export async function saveThread(
  threadId: string,
  thread: Pick<StoredThread, "title" | "status" | "messages">,
): Promise<void> {
  const data = await getStoredData();
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

  await setStoredData(data);
}

export async function deleteThread(threadId: string): Promise<void> {
  const data = await getStoredData();
  delete data.threads[threadId];
  data.threadOrder = data.threadOrder.filter((id) => id !== threadId);
  await setStoredData(data);
}

export async function archiveThread(threadId: string): Promise<void> {
  const data = await getStoredData();
  const thread = data.threads[threadId];
  if (thread) {
    thread.status = "archived";
    thread.updatedAt = Date.now();
    await setStoredData(data);
  }
}

export async function unarchiveThread(threadId: string): Promise<void> {
  const data = await getStoredData();
  const thread = data.threads[threadId];
  if (thread) {
    thread.status = "regular";
    thread.updatedAt = Date.now();
    await setStoredData(data);
  }
}

export async function renameThread(
  threadId: string,
  newTitle: string,
): Promise<void> {
  const data = await getStoredData();
  const thread = data.threads[threadId];
  if (thread) {
    thread.title = newTitle;
    thread.updatedAt = Date.now();
    await setStoredData(data);
  }
}

export async function clearAllThreads(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore remove errors to keep the adapter resilient.
  }
}
