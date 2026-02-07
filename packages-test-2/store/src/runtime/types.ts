import type { AppendMessage, ThreadMessage } from "../types";
import type { ThreadMessageLike, ThreadState } from "../types/entities/thread";
import type { ExportedMessageRepository, ExportedMessageRepositoryItem } from "../utils/message-repository";
import type { AttachmentAdapter } from "../types/adapters/attachment-adapter";
import type { FeedbackAdapter } from "../types/adapters/feedback";
import type { SpeechSynthesisAdapter, DictationAdapter } from "../types/adapters/speech";
import type { ReadonlyJSONValue } from "@creatorem/stream/utils";
import type { Unsubscribe } from "../types";
// import type { ModelContext, ModelContextProvider } from "../model-context/model-context-types";
import type { MessageFormatAdapter, MessageFormatItem, MessageFormatRepository } from "../ai-sdk/ui/adapters/thread-history";
import { ModelContext } from "../store";

// Thread runtime core types
export type ThreadSuggestion = {
  prompt: string;
};

export type AddToolResultOptions = {
  toolCallId: string;
  result: unknown;
  isError?: boolean;
};

export type StartRunConfig = {
  parentId?: string | null;
  runConfig?: Record<string, unknown>;
};

export type ResumeRunConfig = {
  runConfig?: Record<string, unknown>;
};

// External store types
export type ExternalStoreThreadData<TState extends "regular" | "archived"> = {
  status: TState;
  id: string;
  remoteId?: string | undefined;
  externalId?: string | undefined;
  title?: string | undefined;
};

export type ExternalStoreThreadListAdapter = {
  threadId?: string | undefined;
  isLoading?: boolean | undefined;
  threads?: readonly ExternalStoreThreadData<"regular">[] | undefined;
  archivedThreads?: readonly ExternalStoreThreadData<"archived">[] | undefined;
  onSwitchToNewThread?: (() => Promise<void> | void) | undefined;
  onSwitchToThread?: ((threadId: string) => Promise<void> | void) | undefined;
  onRename?: (
    threadId: string,
    newTitle: string,
  ) => (Promise<void> | void) | undefined;
  onArchive?: ((threadId: string) => Promise<void> | void) | undefined;
  onUnarchive?: ((threadId: string) => Promise<void> | void) | undefined;
  onDelete?: ((threadId: string) => Promise<void> | void) | undefined;
};

export type ExternalStoreMessageConverter<T> = (
  message: T,
  idx: number,
) => ThreadMessageLike;

type ExternalStoreMessageConverterAdapter<T> = {
  convertMessage: ExternalStoreMessageConverter<T>;
};

type ExternalStoreAdapterBase<T> = {
  isDisabled?: boolean | undefined;
  isRunning?: boolean | undefined;
  isLoading?: boolean | undefined;
  messages?: readonly T[];
  messageRepository?: ExportedMessageRepository;
  suggestions?: readonly ThreadSuggestion[] | undefined;
  state?: ReadonlyJSONValue | undefined;
  extras?: unknown;

  setMessages?: ((messages: readonly T[]) => void) | undefined;
  onImport?: ((messages: readonly ThreadMessage[]) => void) | undefined;
  onLoadExternalState?: ((state: any) => void) | undefined;
  onNew: (message: AppendMessage) => Promise<void>;
  onEdit?: ((message: AppendMessage) => Promise<void>) | undefined;
  onReload?:
    | ((parentId: string | null, config: StartRunConfig) => Promise<void>)
    | undefined;
  onResume?: ((config: ResumeRunConfig) => Promise<void>) | undefined;
  onCancel?: (() => Promise<void>) | undefined;
  onAddToolResult?:
    | ((options: AddToolResultOptions) => Promise<void> | void)
    | undefined;
  onResumeToolCall?:
    | ((options: { toolCallId: string; payload: unknown }) => void)
    | undefined;
  convertMessage?: ExternalStoreMessageConverter<T> | undefined;
  adapters?:
    | {
        attachments?: AttachmentAdapter | undefined;
        speech?: SpeechSynthesisAdapter | undefined;
        dictation?: DictationAdapter | undefined;
        feedback?: FeedbackAdapter | undefined;
        threadList?: ExternalStoreThreadListAdapter | undefined;
      }
    | undefined;
  unstable_capabilities?:
    | {
        copy?: boolean | undefined;
      }
    | undefined;
};

export type ExternalStoreAdapter<T = ThreadMessage> =
  ExternalStoreAdapterBase<T> &
    (T extends ThreadMessage
      ? object
      : ExternalStoreMessageConverterAdapter<T>);

// Thread history adapter types
export type GenericThreadHistoryAdapter<TMessage> = {
  load(): Promise<MessageFormatRepository<TMessage>>;
  append(item: MessageFormatItem<TMessage>): Promise<void>;
};

export type ChatModelRunOptions = {
  messages: ThreadMessage[];
  abortSignal: AbortSignal;
  config: ModelContext;
  unstable_assistantMessageId?: string;
  unstable_getMessage?: () => ThreadMessage | undefined;
};

export type ChatModelRunResult = {
  content: ThreadMessage["content"];
  metadata?: ThreadMessage["metadata"];
  status?: ThreadMessage["status"];
};

export type ThreadHistoryAdapter = {
  load(): Promise<ExportedMessageRepository & { unstable_resume?: boolean }>;
  resume?(
    options: ChatModelRunOptions,
  ): AsyncGenerator<ChatModelRunResult, void, unknown>;
  append(item: ExportedMessageRepositoryItem): Promise<void>;
  withFormat?<TMessage, TStorageFormat>(
    formatAdapter: MessageFormatAdapter<TMessage, TStorageFormat>,
  ): GenericThreadHistoryAdapter<TMessage>;
};

// Thread runtime types
export type ThreadListItemState = {
  id: string;
  remoteId?: string | undefined;
  externalId?: string | undefined;
  title?: string | undefined;
  status: "regular" | "archived" | "new" | "deleted";
  isMain: boolean;
};

export type ThreadListItemRuntime = {
  getState(): ThreadListItemState;
  initialize(): Promise<ThreadListItemState>;
  subscribe(callback: () => void): Unsubscribe;
};

export type ThreadListState = {
  mainThreadId: string;
  newThread: string | undefined;
  threads: readonly ThreadListItemState[];
  archivedThreads: readonly ThreadListItemState[];
  isLoading: boolean;
};

export type ThreadListRuntime = {
  getState(): ThreadListState;
  subscribe(callback: () => void): Unsubscribe;
  readonly main: ThreadRuntime;
  readonly mainItem: ThreadListItemRuntime;
  getItemById(threadId: string): ThreadListItemRuntime | undefined;
  getItemByRemoteId(remoteId: string): ThreadListItemRuntime | undefined;
  switchToThread(threadId: string): Promise<void>;
  switchToNewThread(): Promise<void>;
  rename(threadId: string, newTitle: string): Promise<void>;
  archive(threadId: string): Promise<void>;
  unarchive(threadId: string): Promise<void>;
  delete(threadId: string): Promise<void>;
};

export type ThreadRuntime = {
  getState(): ThreadState;
  getModelContext(): ModelContext;
  subscribe(callback: () => void): Unsubscribe;
  import(repository: ExportedMessageRepository): void;
  export(): ExportedMessageRepository;
};

// export type AssistantRuntime = {
//   readonly threads: ThreadListRuntime;
//   readonly thread: ThreadRuntime;
//   readonly threadList: ThreadListRuntime;
//   switchToNewThread(): void;
//   switchToThread(threadId: string): void;
//   registerModelContextProvider(provider: ModelContextProvider): Unsubscribe;
//   registerModelConfigProvider(provider: ModelContextProvider): Unsubscribe;
//   reset: unknown;
// };

// Runtime adapters
export type RuntimeAdapters = {
  history?: ThreadHistoryAdapter | undefined;
  attachments?: AttachmentAdapter | undefined;
  speech?: SpeechSynthesisAdapter | undefined;
  dictation?: DictationAdapter | undefined;
  feedback?: FeedbackAdapter | undefined;
};
