import type { StateCreator } from "zustand";
import type { AiChatStore } from "./store";
import type { ThreadListItemState } from "./types/entities";
import type { RemoteThreadInitializeResponse, ThreadListAdapter } from "./types/adapters/threadlist-adapter";
import { DEFAULT_THREAD_ID } from "./threads-slice";
import { ThreadListItemStatus } from "./types/entities/thread-list-item";

type ThreadListItemSlice = StateCreator<
  AiChatStore,
  [],
  [],
  Pick<AiChatStore, 'threadListItem'>
>

class ThreadListItemRuntime {
  private set: Parameters<ThreadListItemSlice>[0]
  private get: Parameters<ThreadListItemSlice>[1]

  private _state: ThreadListItemState
  private _initializeTask: Promise<RemoteThreadInitializeResponse> | undefined;

  constructor(...[set, get]: Parameters<ThreadListItemSlice>) {
    this._state = {
      id: DEFAULT_THREAD_ID,
      remoteId: undefined,
      externalId: undefined,
      status: "new" as ThreadListItemStatus,
      title: undefined,
    };

    this.set = set;
    this.get = get;
  }

  public get state(): ThreadListItemState {
    return this._state;
  }

  private getThreadListAdapter(): ThreadListAdapter | undefined {
    return this.get().adapters.threadList;
  }

  private updateState(updates: Partial<ThreadListItemState>) {
    this._state = { ...this._state, ...updates };

    this.set((store) => ({
      ...store,
      threadListItem: {
        ...store.threadListItem,
        state: this._state,
      }
    }));
  }

  public switchToThread = (): void => {
    // This method is called when this thread list item should become the active thread
    // In a full implementation, this would coordinate with a thread list manager
    // For now, we just update the thread state to reflect this item
    const threadMethods = this.get().thread.methods;

    // Reset the thread with this item's context
    threadMethods.reset();
  }

  public rename = (newTitle: string): void => {
    const adapter = this.getThreadListAdapter();

    if (this._state.status === "new") {
      throw new Error("Thread is not yet initialized");
    }

    // Optimistically update the title
    const previousTitle = this._state.title;
    this.updateState({ title: newTitle });

    // If we have a remote ID and adapter, persist the change
    if (adapter && this._state.remoteId) {
      adapter.rename(this._state.remoteId, newTitle).catch(() => {
        // Rollback on error
        this.updateState({ title: previousTitle });
      });
    }
  }

  public archive = (): void => {
    const adapter = this.getThreadListAdapter();

    if (this._state.status !== "regular") {
      throw new Error("Thread is not initialized or already archived");
    }

    // Optimistically update the status
    this.updateState({ status: "archived" });

    // If we have a remote ID and adapter, persist the change
    if (adapter && this._state.remoteId) {
      adapter.archive(this._state.remoteId).catch(() => {
        // Rollback on error
        this.updateState({ status: "regular" });
      });
    }
  }

  public unarchive = (): void => {
    const adapter = this.getThreadListAdapter();

    if (this._state.status !== "archived") {
      throw new Error("Thread is not archived");
    }

    // Optimistically update the status
    this.updateState({ status: "regular" });

    // If we have a remote ID and adapter, persist the change
    if (adapter && this._state.remoteId) {
      adapter.unarchive(this._state.remoteId).catch(() => {
        // Rollback on error
        this.updateState({ status: "archived" });
      });
    }
  }

  public delete = (): void => {
    const adapter = this.getThreadListAdapter();

    if (this._state.status !== "regular" && this._state.status !== "archived") {
      throw new Error("Thread is not yet initialized");
    }

    const previousStatus = this._state.status;

    // Optimistically update the status
    this.updateState({ status: "deleted" });

    // If we have a remote ID and adapter, persist the change
    if (adapter && this._state.remoteId) {
      adapter.delete(this._state.remoteId).catch(() => {
        // Rollback on error
        this.updateState({ status: previousStatus });
      });
    }
  }

  public generateTitle = (): void => {
    const adapter = this.getThreadListAdapter();

    if (!adapter) {
      throw new Error("ThreadList adapter not configured");
    }

    if (this._state.status === "new") {
      throw new Error("Thread is not yet initialized");
    }

    if (!this._state.remoteId) {
      throw new Error("Thread has no remote ID");
    }

    // Get the current thread messages
    const threadState = this.get().thread;
    const messages = threadState.messages;

    // Generate title asynchronously
    (async () => {
      try {
        const stream = await adapter.generateTitle(this._state.remoteId!, messages);
        const reader = stream.getReader();

        let fullText = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Process the stream chunk to extract text
          if (value && typeof value === 'object' && 'type' in value) {
            if (value.type === 'text-delta' && 'textDelta' in value) {
              fullText += value.textDelta;
              this.updateState({ title: fullText });
            }
          }
        }
      } catch (error) {
        console.error("Failed to generate title:", error);
      }
    })();
  }

  public initialize = async (): Promise<{ remoteId: string; externalId: string | undefined }> => {
    const adapter = this.getThreadListAdapter();

    if (!adapter) {
      throw new Error("ThreadList adapter not configured");
    }

    // If already initialized, return the existing task
    if (this._state.status !== "new" && this._initializeTask) {
      return this._initializeTask;
    }

    // Create the initialize task
    this._initializeTask = adapter.initialize(this._state.id);

    try {
      const result = await this._initializeTask;

      // Update state with the remote ID and external ID
      this.updateState({
        remoteId: result.remoteId,
        externalId: result.externalId,
        status: "regular",
      });

      return result;
    } catch (error) {
      // Clear the task on error so it can be retried
      this._initializeTask = undefined;
      throw error;
    }
  }

  public detach = (): void => {
    // Detach this thread list item from active management
    // This is typically called when switching away from a thread
    // Reset to a clean state while preserving the ID

    if (this._state.status !== "regular" && this._state.status !== "archived") {
      throw new Error("Thread is not yet initialized");
    }

    // In a full implementation, this would notify a thread list manager
    // to stop managing this thread's runtime
  }


  public getState(): ThreadListItemState {
    const {methods, ...state} = this.get().threadListItem;
    return state;
  }

  public getSlice(): AiChatStore['threadListItem'] {
    return {
      // state: this._state,
      ... this._state,
      methods: {
        getState: this.getState,
        switchToThread: this.switchToThread,
        rename: this.rename,
        archive: this.archive,
        unarchive: this.unarchive,
        delete: this.delete,
        generateTitle: this.generateTitle,
        initialize: this.initialize,
        detach: this.detach,
      }
    }
  }
}

export const createThreadListItemSlice: StateCreator<
  AiChatStore,
  [],
  [],
  Pick<AiChatStore, 'threadListItem'>
> = (...a) => ({
  threadListItem: new ThreadListItemRuntime(...a).getSlice()
})
