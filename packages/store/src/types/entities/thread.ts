import type { ReadonlyJSONObject, ReadonlyJSONValue } from "@creatorem/stream/utils";
import type { MessageMethods, MessageState } from "./message";
import type { ComposerState } from "./composer";
import { SpeechState } from "../adapters/speech";
import { DataMessagePart, ImageMessagePart, MessageStatus, ReasoningMessagePart, RunConfig, SourceMessagePart, TextMessagePart, ThreadMessage, Unstable_AudioMessagePart, ThreadStep, FileMessagePart, AppendMessage, ToolCallMessagePart, ThreadAssistantMessagePart } from "../assistant-types";
import { CompleteAttachment } from "../attachment-types";


type ChatModelRunResult = {
  readonly content?: readonly ThreadAssistantMessagePart[] | undefined;
  readonly status?: MessageStatus | undefined;
  readonly metadata?: {
    readonly unstable_state?: ReadonlyJSONValue;
    readonly unstable_annotations?: readonly ReadonlyJSONValue[] | undefined;
    readonly unstable_data?: readonly ReadonlyJSONValue[] | undefined;
    readonly steps?: readonly ThreadStep[] | undefined;
    readonly custom?: Record<string, unknown> | undefined;
  };
};

type ChatModelRunOptions = {
  readonly messages: readonly ThreadMessage[];
  readonly runConfig: RunConfig;
  readonly abortSignal: AbortSignal;
  // readonly context: ModelContext;

  /**
   * @deprecated This field was renamed to `context`.
   */
  // readonly config: ModelContext;

  readonly unstable_assistantMessageId?: string | undefined;
  readonly unstable_threadId?: string | undefined;
  readonly unstable_parentId?: string | null | undefined;
  unstable_getMessage(): ThreadMessage;
};

export type CreateStartRunConfig = {
  parentId: string | null;
  sourceId?: string | null | undefined;
  runConfig?: RunConfig | undefined;

};
export type CreateResumeRunConfig = CreateStartRunConfig & {
  stream?: (
    options: ChatModelRunOptions,
  ) => AsyncGenerator<ChatModelRunResult, void, unknown>;
};


export type CreateAppendMessage =
  | string
  | {
      parentId?: string | null | undefined;
      sourceId?: string | null | undefined;
      role?: AppendMessage["role"] | undefined;
      content: AppendMessage["content"];
      attachments?: AppendMessage["attachments"] | undefined;
      metadata?: AppendMessage["metadata"] | undefined;
      createdAt?: Date | undefined;
      runConfig?: AppendMessage["runConfig"] | undefined;
      startRun?: boolean | undefined;
    };


export type ThreadMessageLike = {
  readonly role: "assistant" | "user" | "system";
  readonly content:
  | string
  | readonly (
    | TextMessagePart
    | ReasoningMessagePart
    | SourceMessagePart
    | ImageMessagePart
    | FileMessagePart
    | DataMessagePart
    | Unstable_AudioMessagePart
    | {
      readonly type: "tool-call";
      readonly toolCallId?: string;
      readonly toolName: string;
      readonly args?: ReadonlyJSONObject;
      readonly argsText?: string;
      readonly artifact?: any;
      readonly result?: any | undefined;
      readonly isError?: boolean | undefined;
      readonly parentId?: string | undefined;
      readonly messages?: readonly ThreadMessage[] | undefined;
    }
  )[];
  readonly id?: string | undefined;
  readonly createdAt?: Date | undefined;
  readonly status?: MessageStatus | undefined;
  readonly attachments?: readonly CompleteAttachment[] | undefined;
  readonly metadata?:
  | {
    readonly unstable_state?: ReadonlyJSONValue;
    readonly unstable_annotations?:
    | readonly ReadonlyJSONValue[]
    | undefined;
    readonly unstable_data?: readonly ReadonlyJSONValue[] | undefined;
    readonly steps?: readonly ThreadStep[] | undefined;
    readonly submittedFeedback?: { readonly type: "positive" | "negative" };
    readonly custom?: Record<string, unknown> | undefined;
  }
  | undefined;
};

type ThreadSuggestion = {
  prompt: string;
};

export type ExportedMessageRepository = {
  /** ID of the head message, or null/undefined if no head */
  headId?: string | null;
  /** Array of all messages with their parent references */
  messages: Array<{
    message: ThreadMessage;
    parentId: string | null;
    runConfig?: RunConfig;
  }>;
};


export type RuntimeCapabilities = {
  readonly switchToBranch: boolean;
  readonly switchBranchDuringRun: boolean;
  readonly edit: boolean;
  readonly reload: boolean;
  readonly cancel: boolean;
  readonly unstable_copy: boolean;
  readonly speech: boolean;
  readonly dictation: boolean;
  readonly attachments: boolean;
  readonly feedback: boolean;
};

export type ThreadState = {
  /**
   * Whether the thread is empty. A thread is considered empty when it has no messages and is not loading.
   */
  readonly isEmpty: boolean;
  /**
   * Whether the thread is disabled. Disabled threads cannot receive new messages.
   */
  readonly isDisabled: boolean;
  /**
   * Whether the thread is loading its history.
   */
  readonly isLoading: boolean;
  /**
   * Whether the thread is running. A thread is considered running when there is an active stream connection to the backend.
   */
  readonly isRunning: boolean;
  /**
   * The capabilities of the thread, such as whether the thread supports editing, branch switching, etc.
   */
  readonly capabilities: RuntimeCapabilities;
  /**
   * The messages in the currently selected branch of the thread.
   */
  readonly messages: readonly MessageState[];
  /**
   * The thread state.
   * @deprecated This feature is experimental
   */
  readonly state: ReadonlyJSONValue;
  /**
   * Follow up message suggestions to show the user.
   */
  readonly suggestions: readonly ThreadSuggestion[];
  /**
   * Custom extra information provided by the runtime.
   */
  readonly extras: unknown;
  /** @deprecated This API is still under active development and might change without notice. */
  readonly speech: SpeechState | undefined;
  readonly composer: ComposerState;
};

export type ThreadMethods = {
  getState(): ThreadState
  /**
   * The thread composer runtime.
   */
  // composer: ComposerMethods;
  /**
   * Append a new message to the thread.
   *
   * @example ```ts
   * // append a new user message with the text "Hello, world!"
   * threadRuntime.append("Hello, world!");
   * ```
   *
   * @example ```ts
   * // append a new assistant message with the text "Hello, world!"
   * threadRuntime.append({
   *   role: "assistant",
   *   content: [{ type: "text", text: "Hello, world!" }],
   * });
   * ```
   */
  append(message: CreateAppendMessage): void;
  /**
   * Start a new run with the given configuration.
   * @param config The configuration for starting the run
   */
  startRun(config: CreateStartRunConfig): void;
  /**
   * Resume a run with the given configuration.
   * @param config The configuration for resuming the run
   */
  unstable_resumeRun(config: CreateResumeRunConfig): void;
  cancelRun(): void;
  // getModelContext(): ModelContext;
  export(): ExportedMessageRepository;
  import(repository: ExportedMessageRepository): void;
  /**
   * Reset the thread with optional initial messages.
   * @param initialMessages - Optional array of initial messages to populate the thread
   */
  reset(initialMessages?: readonly ThreadMessageLike[]): void;
  message(selector: { id: string } | { index: number }): MessageMethods;
  /** @deprecated This API is still under active development and might change without notice. */
  stopSpeaking(): void;
  /**
   * Start the voice session for the thread. Establishes any necessary media connections.
   */
  startVoice(): Promise<void>;
  /**
   * Stop the currently active voice session.
   */
  stopVoice(): Promise<void>;
};

export type ThreadMeta = {
  source: "threads";
  query: { type: "main" };
};

export type ThreadEvents = {
  "thread.runStart": { threadId: string };
  "thread.runEnd": { threadId: string };
  "thread.initialize": { threadId: string };
  "thread.modelContextUpdate": { threadId: string };
};

export type ThreadClientSchema = {
  state: ThreadState;
  methods: ThreadMethods;
  meta: ThreadMeta;
  events: ThreadEvents;
};
