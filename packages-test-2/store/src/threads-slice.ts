// took ex on : class RemoteThreadListThreadListRuntimeCore

import type { StateCreator } from "zustand";
import type { AiChatStore } from "./store";
import type { ThreadListItemState, ThreadsState, ThreadListItemMethods, ThreadMethods } from "./types/entities";
import type { RemoteThreadInitializeResponse, ThreadListAdapter } from "./types/adapters/threadlist-adapter";
import { generateId } from "./internal";
import { AssistantMessageStream } from "@creatorem/stream";

export const DEFAULT_THREAD_ID = "__DEFAULT_THREAD_ID__";

type ThreadsSlice = StateCreator<
  AiChatStore,
  [],
  [],
  Pick<AiChatStore, 'threads'>
>

// Internal thread data with initialization task
type ThreadData = ThreadListItemState & {
  readonly initializeTask?: Promise<RemoteThreadInitializeResponse>;
};

// Internal state for managing threads
type InternalThreadsState = {
  readonly isLoading: boolean;
  readonly newThreadId: string | null;
  readonly mainThreadId: string;
  readonly threadIds: readonly string[];
  readonly archivedThreadIds: readonly string[];
  readonly threadIdMap: Readonly<Record<string, string>>;
  readonly threadData: Readonly<Record<string, ThreadData>>;
};

const getThreadData = (
  state: InternalThreadsState,
  threadIdOrRemoteId: string,
): ThreadData | undefined => {
  const idx = state.threadIdMap[threadIdOrRemoteId];
  if (idx === undefined) return undefined;
  return state.threadData[idx];
};

const updateStatusReducer = (
  state: InternalThreadsState,
  threadIdOrRemoteId: string,
  newStatus: "new" | "regular" | "archived" | "deleted",
): InternalThreadsState => {
  const data = getThreadData(state, threadIdOrRemoteId);
  if (!data) return state;

  const { id, remoteId, status: lastStatus } = data;
  if (lastStatus === newStatus) return state;

  const newState = { ...state };

  // Remove from previous status list
  switch (lastStatus) {
    case "new":
      newState.newThreadId = null;
      break;
    case "regular":
      newState.threadIds = newState.threadIds.filter((t) => t !== id);
      break;
    case "archived":
      newState.archivedThreadIds = newState.archivedThreadIds.filter((t) => t !== id);
      break;
    case "deleted":
      // Already deleted, nothing to remove
      break;
    default: {
      const _exhaustiveCheck: never = lastStatus;
      throw new Error(`Unsupported state: ${_exhaustiveCheck}`);
    }
  }

  // Add to new status list
  switch (newStatus) {
    case "new":
      newState.newThreadId = id;
      break;
    case "regular":
      newState.threadIds = [id, ...newState.threadIds];
      break;
    case "archived":
      newState.archivedThreadIds = [id, ...newState.archivedThreadIds];
      break;
    case "deleted":
      newState.threadData = Object.fromEntries(
        Object.entries(newState.threadData).filter(([key]) => key !== id),
      );
      newState.threadIdMap = Object.fromEntries(
        Object.entries(newState.threadIdMap).filter(
          ([key]) => key !== id && key !== remoteId,
        ),
      );
      break;
    default: {
      const _exhaustiveCheck: never = newStatus;
      throw new Error(`Unsupported state: ${_exhaustiveCheck}`);
    }
  }

  if (newStatus !== "deleted") {
    newState.threadData = {
      ...newState.threadData,
      [id]: {
        ...data,
        status: newStatus,
      },
    };
  }

  return newState;
};

class ThreadsRuntime {
  private set: Parameters<ThreadsSlice>[0]
  private get: Parameters<ThreadsSlice>[1]

  private _internalState: InternalThreadsState;
  private _loadThreadsPromise: Promise<void> | undefined;

  constructor(...[set, get]: Parameters<ThreadsSlice>) {
    // Create initial default thread
    const defaultThreadId = DEFAULT_THREAD_ID;

    this._internalState = {
      isLoading: false,
      newThreadId: defaultThreadId,
      mainThreadId: defaultThreadId,
      threadIds: [],
      archivedThreadIds: [],
      threadIdMap: {
        [defaultThreadId]: defaultThreadId,
      },
      threadData: {
        [defaultThreadId]: {
          id: defaultThreadId,
          remoteId: undefined,
          externalId: undefined,
          status: "new",
          title: undefined,
        },
      },
    };

    this.set = set;
    this.get = get;
  }

  private getThreadListAdapter(): ThreadListAdapter | undefined {
    return this.get().adapters.threadList;
  }

  private getPublicState(): ThreadsState {
    const threadItems: ThreadListItemState[] = [];

    // Build thread items from internal state
    for (const id of this._internalState.threadIds) {
      const data = this._internalState.threadData[id];
      if (data) {
        threadItems.push({
          id: data.id,
          remoteId: data.remoteId,
          externalId: data.externalId,
          status: data.status,
          title: data.title,
        });
      }
    }

    // Add new thread if exists
    if (this._internalState.newThreadId) {
      const data = this._internalState.threadData[this._internalState.newThreadId];
      if (data) {
        threadItems.unshift({
          id: data.id,
          remoteId: data.remoteId,
          externalId: data.externalId,
          status: data.status,
          title: data.title,
        });
      }
    }

    return {
      mainThreadId: this._internalState.mainThreadId,
      newThreadId: this._internalState.newThreadId,
      isLoading: this._internalState.isLoading,
      threadIds: this._internalState.threadIds,
      archivedThreadIds: this._internalState.archivedThreadIds,
      threadItems,
      main: this.get().thread,
    };
  }

  private updateInternalState(newState: InternalThreadsState) {
    this._internalState = newState;

    this.set((store) => ({
      ...store,
      threads: {
        ...store.threads,
        state: this.getPublicState(),
      }
    }));
  }

  public loadThreads = async (): Promise<void> => {
    if (this._loadThreadsPromise) {
      return this._loadThreadsPromise;
    }

    const adapter = this.getThreadListAdapter();
    if (!adapter) {
      return;
    }

    // Set loading state
    this.updateInternalState({
      ...this._internalState,
      isLoading: true,
    });

    this._loadThreadsPromise = (async () => {
      try {
        const response = await adapter.list();

        const newThreadIds: string[] = [];
        const newArchivedThreadIds: string[] = [];
        const newThreadIdMap: Record<string, string> = {};
        const newThreadData: Record<string, ThreadData> = {};

        for (const thread of response.threads) {
          switch (thread.status) {
            case "regular":
              newThreadIds.push(thread.remoteId);
              break;
            case "archived":
              newArchivedThreadIds.push(thread.remoteId);
              break;
            default: {
              const _exhaustiveCheck: never = thread.status;
              throw new Error(`Unsupported state: ${_exhaustiveCheck}`);
            }
          }

          newThreadIdMap[thread.remoteId] = thread.remoteId;
          newThreadData[thread.remoteId] = {
            id: thread.remoteId,
            remoteId: thread.remoteId,
            externalId: thread.externalId,
            status: thread.status,
            title: thread.title,
            initializeTask: Promise.resolve({
              remoteId: thread.remoteId,
              externalId: thread.externalId,
            }),
          };
        }

        this.updateInternalState({
          ...this._internalState,
          isLoading: false,
          threadIds: newThreadIds,
          archivedThreadIds: newArchivedThreadIds,
          threadIdMap: {
            ...this._internalState.threadIdMap,
            ...newThreadIdMap,
          },
          threadData: {
            ...this._internalState.threadData,
            ...newThreadData,
          },
        });
      } catch (error) {
        this.updateInternalState({
          ...this._internalState,
          isLoading: false,
        });
        throw error;
      }
    })();

    return this._loadThreadsPromise;
  }

  public switchToThread = async (threadIdOrRemoteId: string): Promise<void> => {
    let data = getThreadData(this._internalState, threadIdOrRemoteId);

    // If thread not found locally, try to fetch it
    if (!data) {
      const adapter = this.getThreadListAdapter();
      if (!adapter) {
        throw new Error("Thread not found and no adapter configured");
      }

      const remoteMetadata = await adapter.fetch(threadIdOrRemoteId);

      const newThreadData: ThreadData = {
        id: remoteMetadata.remoteId,
        remoteId: remoteMetadata.remoteId,
        externalId: remoteMetadata.externalId,
        status: remoteMetadata.status,
        title: remoteMetadata.title,
        initializeTask: Promise.resolve({
          remoteId: remoteMetadata.remoteId,
          externalId: remoteMetadata.externalId,
        }),
      };

      const newThreadIds =
        remoteMetadata.status === "regular"
          ? [...this._internalState.threadIds, remoteMetadata.remoteId]
          : this._internalState.threadIds;

      const newArchivedThreadIds =
        remoteMetadata.status === "archived"
          ? [...this._internalState.archivedThreadIds, remoteMetadata.remoteId]
          : this._internalState.archivedThreadIds;

      this.updateInternalState({
        ...this._internalState,
        threadIds: newThreadIds,
        archivedThreadIds: newArchivedThreadIds,
        threadIdMap: {
          ...this._internalState.threadIdMap,
          [remoteMetadata.remoteId]: remoteMetadata.remoteId,
        },
        threadData: {
          ...this._internalState.threadData,
          [remoteMetadata.remoteId]: newThreadData,
        },
      });

      data = getThreadData(this._internalState, threadIdOrRemoteId);
    }

    if (!data) throw new Error("Thread not found");

    // If already the main thread, nothing to do
    if (this._internalState.mainThreadId === data.id) return;

    // If archived, unarchive it first
    if (data.status === "archived") {
      await this._unarchiveThread(data.id);
    }

    // Update main thread ID
    this.updateInternalState({
      ...this._internalState,
      mainThreadId: data.id,
    });

    // Reset the thread state for the new thread
    const threadMethods = this.get().thread.methods;
    threadMethods.reset();
  }

  public switchToNewThread = async (): Promise<void> => {
    // If there's already a new thread, switch to it
    if (this._internalState.newThreadId) {
      const existingNewThread = getThreadData(this._internalState, this._internalState.newThreadId);
      if (existingNewThread && existingNewThread.status === "new") {
        this.updateInternalState({
          ...this._internalState,
          mainThreadId: this._internalState.newThreadId,
        });

        // Reset the thread state for the new thread
        const threadMethods = this.get().thread.methods;
        threadMethods.reset();
        return;
      }
    }

    // Create a new thread ID
    let newId: string;
    do {
      newId = `__LOCALID_${generateId()}`;
    } while (this._internalState.threadIdMap[newId]);

    const newThreadData: ThreadData = {
      id: newId,
      remoteId: undefined,
      externalId: undefined,
      status: "new",
      title: undefined,
    };

    this.updateInternalState({
      ...this._internalState,
      newThreadId: newId,
      mainThreadId: newId,
      threadIdMap: {
        ...this._internalState.threadIdMap,
        [newId]: newId,
      },
      threadData: {
        ...this._internalState.threadData,
        [newId]: newThreadData,
      },
    });

    // Reset the thread state for the new thread
    const threadMethods = this.get().thread.methods;
    threadMethods.reset();
  }

  private _initializeThread = async (threadId: string): Promise<RemoteThreadInitializeResponse> => {
    const data = getThreadData(this._internalState, threadId);
    if (!data) throw new Error("Thread not found");

    // If not a new thread, return existing initialize task
    if (data.status !== "new") {
      if (data.initializeTask) {
        return data.initializeTask;
      }
      throw new Error("Thread already initialized but no initialize task found");
    }

    const adapter = this.getThreadListAdapter();
    if (!adapter) {
      throw new Error("ThreadList adapter not configured");
    }

    // Create the initialize task
    const initializeTask = adapter.initialize(threadId);

    // Optimistically update status to regular
    let newState = updateStatusReducer(this._internalState, threadId, "regular");

    // Store the initialize task
    newState = {
      ...newState,
      threadData: {
        ...newState.threadData,
        [threadId]: {
          ...newState.threadData[threadId]!,
          initializeTask,
        },
      },
    };

    this.updateInternalState(newState);

    try {
      const result = await initializeTask;

      // Update with remote ID
      this.updateInternalState({
        ...this._internalState,
        threadIdMap: {
          ...this._internalState.threadIdMap,
          [result.remoteId]: threadId,
        },
        threadData: {
          ...this._internalState.threadData,
          [threadId]: {
            ...this._internalState.threadData[threadId]!,
            remoteId: result.remoteId,
            externalId: result.externalId,
            initializeTask: Promise.resolve(result),
          },
        },
      });

      return result;
    } catch (error) {
      // Rollback status on error
      this.updateInternalState(
        updateStatusReducer(this._internalState, threadId, "new")
      );
      throw error;
    }
  }

  private _renameThread = async (threadId: string, newTitle: string): Promise<void> => {
    const data = getThreadData(this._internalState, threadId);
    if (!data) throw new Error("Thread not found");
    if (data.status === "new") throw new Error("Thread is not yet initialized");

    const previousTitle = data.title;

    // Optimistically update the title
    this.updateInternalState({
      ...this._internalState,
      threadData: {
        ...this._internalState.threadData,
        [threadId]: {
          ...data,
          title: newTitle,
        },
      },
    });

    const adapter = this.getThreadListAdapter();
    if (adapter && data.remoteId) {
      try {
        await adapter.rename(data.remoteId, newTitle);
      } catch (error) {
        // Rollback on error
        this.updateInternalState({
          ...this._internalState,
          threadData: {
            ...this._internalState.threadData,
            [threadId]: {
              ...this._internalState.threadData[threadId]!,
              title: previousTitle,
            },
          },
        });
        throw error;
      }
    }
  }

  private _archiveThread = async (threadId: string): Promise<void> => {
    const data = getThreadData(this._internalState, threadId);
    if (!data) throw new Error("Thread not found");
    if (data.status !== "regular") throw new Error("Thread is not initialized or already archived");

    // If this is the main thread, switch to a new thread first
    if (threadId === this._internalState.mainThreadId) {
      await this.switchToNewThread();
    }

    // Optimistically update status
    this.updateInternalState(
      updateStatusReducer(this._internalState, threadId, "archived")
    );

    const adapter = this.getThreadListAdapter();
    if (adapter && data.remoteId) {
      try {
        await adapter.archive(data.remoteId);
      } catch (error) {
        // Rollback on error
        this.updateInternalState(
          updateStatusReducer(this._internalState, threadId, "regular")
        );
        throw error;
      }
    }
  }

  private _unarchiveThread = async (threadId: string): Promise<void> => {
    const data = getThreadData(this._internalState, threadId);
    if (!data) throw new Error("Thread not found");
    if (data.status !== "archived") throw new Error("Thread is not archived");

    // Optimistically update status
    this.updateInternalState(
      updateStatusReducer(this._internalState, threadId, "regular")
    );

    const adapter = this.getThreadListAdapter();
    if (adapter && data.remoteId) {
      try {
        await adapter.unarchive(data.remoteId);
      } catch (error) {
        // Rollback on error
        this.updateInternalState(
          updateStatusReducer(this._internalState, threadId, "archived")
        );
        throw error;
      }
    }
  }

  private _deleteThread = async (threadId: string): Promise<void> => {
    const data = getThreadData(this._internalState, threadId);
    if (!data) throw new Error("Thread not found");
    if (data.status !== "regular" && data.status !== "archived") {
      throw new Error("Thread is not yet initialized");
    }

    // If this is the main thread, switch to a new thread first
    if (threadId === this._internalState.mainThreadId) {
      await this.switchToNewThread();
    }

    const previousStatus = data.status;

    // Optimistically update status
    this.updateInternalState(
      updateStatusReducer(this._internalState, threadId, "deleted")
    );

    const adapter = this.getThreadListAdapter();
    if (adapter && data.remoteId) {
      try {
        await adapter.delete(data.remoteId);
      } catch (error) {
        // Rollback on error - need to re-add the thread data
        this.updateInternalState({
          ...this._internalState,
          threadIdMap: {
            ...this._internalState.threadIdMap,
            [threadId]: threadId,
            ...(data.remoteId ? { [data.remoteId]: threadId } : {}),
          },
          threadData: {
            ...this._internalState.threadData,
            [threadId]: {
              ...data,
              status: previousStatus,
            },
          },
          threadIds: previousStatus === "regular"
            ? [threadId, ...this._internalState.threadIds]
            : this._internalState.threadIds,
          archivedThreadIds: previousStatus === "archived"
            ? [threadId, ...this._internalState.archivedThreadIds]
            : this._internalState.archivedThreadIds,
        });
        throw error;
      }
    }
  }

  private _generateTitle = async (threadId: string): Promise<void> => {
    const data = getThreadData(this._internalState, threadId);
    if (!data) throw new Error("Thread not found");
    if (data.status === "new") throw new Error("Thread is not yet initialized");
    if (!data.remoteId) throw new Error("Thread has no remote ID");

    const adapter = this.getThreadListAdapter();
    if (!adapter) {
      throw new Error("ThreadList adapter not configured");
    }

    // Get the current thread messages
    const threadState = this.get().thread;
    const messages = threadState.messages;

    try {
      const stream = await adapter.generateTitle(data.remoteId, messages);
      const messageStream = AssistantMessageStream.fromAssistantStream(stream);

      for await (const result of messageStream) {
        const newTitle = result.parts.filter((c) => c.type === "text")[0]?.text;
        if (newTitle) {
          this.updateInternalState({
            ...this._internalState,
            threadData: {
              ...this._internalState.threadData,
              [threadId]: {
                ...this._internalState.threadData[threadId]!,
                title: newTitle,
              },
            },
          });
        }
      }
    } catch (error) {
      console.error("Failed to generate title:", error);
    }
  }

  private _detachThread = (threadId: string): void => {
    const data = getThreadData(this._internalState, threadId);
    if (!data) throw new Error("Thread not found");
    if (data.status !== "regular" && data.status !== "archived") {
      throw new Error("Thread is not yet initialized");
    }

    // If this is the main thread, we need to switch first
    if (threadId === this._internalState.mainThreadId) {
      throw new Error("Cannot detach the main thread");
    }

    // Nothing specific to do for detachment in this implementation
    // In a full implementation, this would stop any active runtime for the thread
  }

  // public getState(): ThreadsState {
  //   const {methods, ...state} = this.get().threads;
  //   return state;
  // }

  public item = (
    threadIdOrOptions: "main" | { id: string } | { index: number; archived?: boolean }
  ): ThreadListItemMethods => {
    let threadId: string;

    if (threadIdOrOptions === "main") {
      threadId = this._internalState.mainThreadId;
    } else if ("id" in threadIdOrOptions) {
      threadId = threadIdOrOptions.id;
    } else {
      const { index, archived = false } = threadIdOrOptions;
      const list = archived ? this._internalState.archivedThreadIds : this._internalState.threadIds;
      threadId = list[index] ?? "";
      if (!threadId) {
        throw new Error(`Thread at index ${index} not found`);
      }
    }

    const data = getThreadData(this._internalState, threadId);
    if (!data) throw new Error("Thread not found");

    return {
      // getState: this.getState,
      switchToThread: () => {
        this.switchToThread(threadId);
      },
      rename: (newTitle: string) => {
        this._renameThread(threadId, newTitle);
      },
      archive: () => {
        this._archiveThread(threadId);
      },
      unarchive: () => {
        this._unarchiveThread(threadId);
      },
      delete: () => {
        this._deleteThread(threadId);
      },
      generateTitle: () => {
        this._generateTitle(threadId);
      },
      initialize: () => {
        return this._initializeThread(threadId);
      },
      detach: () => {
        this._detachThread(threadId);
      },
    };
  }

  public thread = (selector: "main"): ThreadMethods => {
    if (selector !== "main") {
      throw new Error("Only 'main' selector is supported");
    }

    return this.get().thread.methods;
  }

  public getSlice(): AiChatStore['threads'] {
    return {
      ...this.getPublicState(),
      methods: {
        switchToThread: this.switchToThread,
        switchToNewThread: this.switchToNewThread,
        item: this.item,
        thread: this.thread,
      }
    }
  }
}


export const createThreadsSlice: StateCreator<
  AiChatStore,
  [],
  [],
  Pick<AiChatStore, 'threads'>
> = (...a) => ({
  threads: new ThreadsRuntime(...a).getSlice()
})
