import { AssistantStream, createAssistantStreamController } from "@creatorem/stream";
import type {
  ThreadListAdapter,
  RemoteThreadMetadata,
  RemoteThreadListResponse,
  RemoteThreadInitializeResponse,
} from "../../../types/adapters/threadlist-adapter";
import type { ThreadMessage } from "../../../types/assistant-types";
import { generateId } from "../../../internal";

const STORAGE_KEY = "assistant-threadlist";
const THREADS_KEY = `${STORAGE_KEY}-threads`;

type StoredThreadMetadata = RemoteThreadMetadata & {
  createdAt: string;
  updatedAt: string;
};

type ThreadListStorage = {
  threads: Record<string, StoredThreadMetadata>;
};

const getStorage = (): ThreadListStorage => {
  if (typeof window === "undefined") {
    return { threads: {} };
  }
  try {
    const stored = localStorage.getItem(THREADS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load thread list from localStorage:", error);
  }
  return { threads: {} };
};

const setStorage = (storage: ThreadListStorage): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(THREADS_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error("Failed to save thread list to localStorage:", error);
  }
};

const generateThreadTitle = (messages: readonly ThreadMessage[]): string => {
  // Find the first user message with text content
  for (const message of messages) {
    if (message.role === "user") {
      for (const part of message.content) {
        if (part.type === "text" && part.text.trim()) {
          // Truncate to first 50 characters
          const text = part.text.trim();
          return text.length > 50 ? `${text.slice(0, 47)}...` : text;
        }
      }
    }
  }
  return "New conversation";
};

/**
 * Creates a ThreadListAdapter that persists thread metadata to localStorage.
 *
 * @example
 * ```tsx
 * const threadListAdapter = createLocalStorageThreadListAdapter();
 * ```
 */
export const createLocalStorageThreadListAdapter = (): ThreadListAdapter => {
  const adapter: ThreadListAdapter = {
    async list(): Promise<RemoteThreadListResponse> {
      const storage = getStorage();
      const threads = Object.values(storage.threads)
        .map(({ createdAt, updatedAt, ...metadata }) => metadata)
        .sort((a, b) => {
          // Sort by updatedAt descending (most recent first)
          const aTime = storage.threads[a.remoteId]?.updatedAt ?? "";
          const bTime = storage.threads[b.remoteId]?.updatedAt ?? "";
          return bTime.localeCompare(aTime);
        });

      return { threads };
    },

    async initialize(threadId: string): Promise<RemoteThreadInitializeResponse> {
      const storage = getStorage();
      const remoteId = generateId();
      const now = new Date().toISOString();

      storage.threads[remoteId] = {
        remoteId,
        externalId: threadId,
        status: "regular",
        title: undefined,
        createdAt: now,
        updatedAt: now,
      };

      setStorage(storage);

      return {
        remoteId,
        externalId: threadId,
      };
    },

    async rename(remoteId: string, newTitle: string): Promise<void> {
      const storage = getStorage();
      const thread = storage.threads[remoteId];

      if (!thread) {
        throw new Error(`Thread not found: ${remoteId}`);
      }

      storage.threads[remoteId] = {
        ...thread,
        title: newTitle,
        updatedAt: new Date().toISOString(),
      };

      setStorage(storage);
    },

    async archive(remoteId: string): Promise<void> {
      const storage = getStorage();
      const thread = storage.threads[remoteId];

      if (!thread) {
        throw new Error(`Thread not found: ${remoteId}`);
      }

      storage.threads[remoteId] = {
        ...thread,
        status: "archived",
        updatedAt: new Date().toISOString(),
      };

      setStorage(storage);
    },

    async unarchive(remoteId: string): Promise<void> {
      const storage = getStorage();
      const thread = storage.threads[remoteId];

      if (!thread) {
        throw new Error(`Thread not found: ${remoteId}`);
      }

      storage.threads[remoteId] = {
        ...thread,
        status: "regular",
        updatedAt: new Date().toISOString(),
      };

      setStorage(storage);
    },

    async delete(remoteId: string): Promise<void> {
      const storage = getStorage();

      if (!storage.threads[remoteId]) {
        throw new Error(`Thread not found: ${remoteId}`);
      }

      delete storage.threads[remoteId];
      setStorage(storage);

      // Also clean up any associated thread messages
      try {
        const messageStorageKey = `assistant-thread-${remoteId}`;
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(messageStorageKey)) {
            keysToRemove.push(key);
          }
        }
        for (const key of keysToRemove) {
          localStorage.removeItem(key);
        }
      } catch (error) {
        console.error("Failed to clean up thread messages:", error);
      }
    },

    async fetch(threadId: string): Promise<RemoteThreadMetadata> {
      const storage = getStorage();

      // Try to find by remoteId first
      let thread = storage.threads[threadId];

      // If not found, try to find by externalId
      if (!thread) {
        thread = Object.values(storage.threads).find(
          (t) => t.externalId === threadId,
        );
      }

      if (!thread) {
        throw new Error(`Thread not found: ${threadId}`);
      }

      const { createdAt, updatedAt, ...metadata } = thread;
      return metadata;
    },

    async generateTitle(
      remoteId: string,
      unstable_messages: readonly ThreadMessage[],
    ): Promise<AssistantStream> {
      const storage = getStorage();
      const thread = storage.threads[remoteId];

      if (!thread) {
        throw new Error(`Thread not found: ${remoteId}`);
      }

      // Generate title from first user message
      const title = generateThreadTitle(unstable_messages);

      // Update the thread with the new title
      storage.threads[remoteId] = {
        ...thread,
        title,
        updatedAt: new Date().toISOString(),
      };
      setStorage(storage);

      // Return an AssistantStream that yields the title
      const [stream, controller] = createAssistantStreamController();

      // Emit the title as a text part and close
      setTimeout(() => {
        controller.addTextPart();
        controller.appendText(title);
        controller.close();
      }, 0);

      return stream;
    },
  };

  return adapter;
};

/**
 * Clears all thread list data from localStorage.
 */
export const clearLocalStorageThreadList = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(THREADS_KEY);
  } catch (error) {
    console.error("Failed to clear thread list from localStorage:", error);
  }
};

/**
 * Gets the total number of threads stored.
 *
 * @returns Number of threads
 */
export const getLocalStorageThreadCount = (): number => {
  const storage = getStorage();
  return Object.keys(storage.threads).length;
};

/**
 * Exports all thread metadata for backup purposes.
 *
 * @returns All stored thread metadata
 */
export const exportLocalStorageThreadList = (): StoredThreadMetadata[] => {
  const storage = getStorage();
  return Object.values(storage.threads);
};

/**
 * Imports thread metadata from a backup.
 *
 * @param threads - Array of thread metadata to import
 * @param merge - If true, merges with existing data; if false, replaces all data
 */
export const importLocalStorageThreadList = (
  threads: StoredThreadMetadata[],
  merge = true,
): void => {
  const storage = merge ? getStorage() : { threads: {} };

  for (const thread of threads) {
    storage.threads[thread.remoteId] = thread;
  }

  setStorage(storage);
};
