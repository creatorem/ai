import type { ThreadAdapter } from "../types/adapters";
import type { Thread, Threads } from "../types/entities";

export const emptyStorageThreadAdapter: ThreadAdapter = {
  async list(): Promise<Pick<Threads, "threadIds" | "archivedThreadIds">> {
    return { threadIds: [], archivedThreadIds: [] };
  },

  async fetch(
    _threadId: string,
  ): Promise<Pick<Thread, "title" | "status" | "messages">> {
    return {
      title: "New Thread",
      status: "regular",
      messages: [],
    };
  },

  async save(
    _threadId: string,
    _thread: Pick<Thread, "title" | "status" | "messages">,
  ): Promise<void> {
    // No-op.
  },

  async delete(_threadId: string): Promise<void> {
    // No-op.
  },
};

export function saveThread(
  _threadId: string,
  _thread: Pick<Thread, "title" | "status" | "messages">,
): void {
  // No-op.
}

export function deleteThread(_threadId: string): void {
  // No-op.
}

export function archiveThread(_threadId: string): void {
  // No-op.
}

export function unarchiveThread(_threadId: string): void {
  // No-op.
}

export function renameThread(_threadId: string, _newTitle: string): void {
  // No-op.
}

export function clearAllThreads(): void {
  // No-op.
}
