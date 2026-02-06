import type { Unsubscribe, AppendMessage, ThreadMessage } from "./types/index";
import type { RunConfig, MessagePartStatus } from "./types/assistant-types";
import type { SpeechState, SpeechSynthesisAdapter } from "./types/adapters/speech";
import type { StateCreator } from "zustand";
import type { AiChatStore } from "./store";
import type { ComposerState, MessageMethods, MessageState, PartState, ThreadState } from "./types/entities";
import type { FeedbackAdapter } from "./types/adapters/feedback";
import type { AttachmentAdapter } from "./types/adapters/attachment-adapter";
import type { ReadonlyJSONValue } from "@creatorem/stream/utils";
import {
  MessageRepository,
  ExportedMessageRepository as ExportedMessageRepositoryUtils,
} from "./utils/message-repository";
import { getThreadMessageText } from "./utils/get-thread-message-text";
import type { CreateResumeRunConfig, CreateAppendMessage, ExportedMessageRepository, RuntimeCapabilities, ThreadMessageLike, CreateStartRunConfig } from "./types/entities/thread";
import { ModelContext } from "./model-context/model-context-types";

type ThreadRuntimeEventType =
  | "runStart"
  | "runEnd"
  | "initialize"
  | "modelContextUpdate";


type StartRunConfig = {
  parentId: string | null;
  sourceId: string | null;
  runConfig: RunConfig;
};

type ThreadSlice = StateCreator<
  AiChatStore,
  [],
  [],
  Pick<AiChatStore, 'thread'>
>

type ThreadAdapters = {
  speech?: SpeechSynthesisAdapter | undefined;
  feedback?: FeedbackAdapter | undefined;
  attachments?: AttachmentAdapter | undefined;
};

// Helper to extract ComposerState from the flat store structure
const extractComposerState = (composer: AiChatStore['composer']): ComposerState => {
  const { methods: _, ...state } = composer;
  return state;
};

class ThreadRuntime {
  private set: Parameters<ThreadSlice>[0]
  private get: Parameters<ThreadSlice>[1]

  private _state: ThreadState
  private _repository = new MessageRepository();
  private _abortController: AbortController | null = null;
  private _isInitialized = false;
  private _speech: SpeechState | undefined;
  private _stopSpeaking: Unsubscribe | undefined;
  private _eventSubscribers = new Map<ThreadRuntimeEventType, Set<() => void>>();
  private _lastRunConfig: RunConfig = {};

  constructor(...[set, get]: Parameters<ThreadSlice>) {
    this._state = {
      composer: extractComposerState(get().composer),
      speech: undefined,
      capabilities: {
        switchToBranch: true,
        switchBranchDuringRun: true,
        edit: true,
        reload: true,
        cancel: true,
        unstable_copy: true,
        speech: false,
        dictation: false,
        attachments: false,
        feedback: false,
      },
      isEmpty: true,
      isRunning: false,
      isDisabled: false,
      isLoading: false,
      messages: [],
      state: null,
      suggestions: [],
      extras: undefined,
    };

    this.set = set;
    this.get = get;
  }

  public get state(): ThreadState {
    return this._state;
  }

  private getAdapters(): ThreadAdapters {
    const adapters = this.get().adapters;
    return {
      speech: adapters.speech,
      feedback: adapters.feedback,
      attachments: adapters.attachment,
    };
  }

  private updateState(updates: Partial<ThreadState>) {
    const newState = { ...this._state, ...updates };

    // Recalculate isEmpty
    const messages = updates.messages ?? this._state.messages;
    const isLoading = updates.isLoading ?? this._state.isLoading;
    newState.isEmpty = messages.length === 0 && !isLoading;

    this._state = newState;

    this.set((store) => ({
      ...store,
      thread: {
        ...store.thread,
        ...this._state,
      }
    }));
  }

  public getState = (): ThreadState => {
    const { methods: _, ...state } = this.get().thread;
    return state;
  }

  private updateCapabilities() {
    const adapters = this.getAdapters();
    const newCapabilities: RuntimeCapabilities = {
      ...this._state.capabilities,
      speech: adapters.speech !== undefined,
      attachments: adapters.attachments !== undefined,
      feedback: adapters.feedback !== undefined,
    };

    if (JSON.stringify(newCapabilities) !== JSON.stringify(this._state.capabilities)) {
      this.updateState({ capabilities: newCapabilities });
    }
  }

  private ensureInitialized() {
    if (!this._isInitialized) {
      this._isInitialized = true;
      this._notifyEventSubscribers("initialize");
    }
  }

  private _notifyEventSubscribers(event: ThreadRuntimeEventType) {
    const subscribers = this._eventSubscribers.get(event);
    if (!subscribers) return;
    for (const callback of subscribers) callback();
  }

  private getMessagesState(): readonly MessageState[] {
    const messages = this._repository.getMessages();
    const composerState = extractComposerState(this.get().composer);

    return messages.map((message, index) => {
      const parentId = index > 0 ? messages[index - 1]?.id ?? null : null;
      const branches = this._repository.getBranches(message.id);
      const branchIndex = branches.indexOf(message.id);

      const COMPLETE_STATUS: MessagePartStatus = { type: 'complete' };
      const RUNNING_STATUS: MessagePartStatus = { type: 'running' };

      const parts: readonly PartState[] = message.content.map((part) => ({
        ...part,
        status: part.type === 'tool-call'
          ? (part.result !== undefined ? COMPLETE_STATUS : RUNNING_STATUS)
          : COMPLETE_STATUS,
      })) as readonly PartState[];

      return {
        ...message,
        parentId,
        isLast: index === messages.length - 1,
        branchNumber: branchIndex + 1,
        branchCount: branches.length,
        speech: this._speech?.messageId === message.id ? this._speech : undefined,
        submittedFeedback: message.metadata?.submittedFeedback,
        composer: composerState,
        parts,
        isCopied: false,
        isHovering: false,
        index,
      };
    });
  }

  private getThreadStateValue(): ReadonlyJSONValue {
    const messages = this._repository.getMessages();
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message?.role === "assistant") {
        return message.metadata?.unstable_state ?? null;
      }
    }
    return null;
  }

  private syncMessagesToState() {
    this.updateState({
      messages: this.getMessagesState(),
      state: this.getThreadStateValue(),
    });
  }

  // Convert CreateAppendMessage to AppendMessage
  private toAppendMessage(message: CreateAppendMessage): AppendMessage {
    const messages = this._repository.getMessages();

    if (typeof message === "string") {
      return {
        createdAt: new Date(),
        parentId: messages.at(-1)?.id ?? null,
        sourceId: null,
        role: "user",
        content: [{ type: "text", text: message }],
        attachments: [],
        runConfig: undefined,
        metadata: { custom: {} },
      };
    }

    return {
      createdAt: message.createdAt ?? new Date(),
      parentId: message.parentId ?? messages.at(-1)?.id ?? null,
      sourceId: message.sourceId ?? null,
      role: message.role ?? "user",
      content: typeof message.content === "string"
        ? [{ type: "text", text: message.content }]
        : message.content ?? [],
      attachments: message.attachments ?? [],
      runConfig: message.runConfig,
      startRun: message.startRun,
      metadata: message.metadata ?? { custom: {} },
    };
  }

  public append = (message: CreateAppendMessage): void => {
    this.ensureInitialized();

    const appendMessage = this.toAppendMessage(message);

    const newMessage = {
      id: crypto.randomUUID(),
      role: appendMessage.role,
      content: appendMessage.content,
      attachments: appendMessage.attachments,
      createdAt: appendMessage.createdAt,
      metadata: appendMessage.metadata ?? { custom: {} },
      status: { type: "complete" as const, reason: "unknown" as const },
    } as ThreadMessage;

    this._repository.addOrUpdateMessage(appendMessage.parentId, newMessage);

    const startRun = appendMessage.startRun ?? appendMessage.role === "user";
    if (startRun) {
      this.startRun({
        parentId: newMessage.id,
        sourceId: appendMessage.sourceId,
        runConfig: appendMessage.runConfig,
      });
    } else {
      this._repository.resetHead(newMessage.id);
      this.syncMessagesToState();
    }
  }

  public startRun = (config: CreateStartRunConfig): void => {
    this.ensureInitialized();

    const startConfig: StartRunConfig = {
      parentId: config.parentId ?? null,
      sourceId: config.sourceId ?? null,
      runConfig: config.runConfig ?? {},
    };

    this._lastRunConfig = startConfig.runConfig;
    this._notifyEventSubscribers("runStart");

    // Create assistant message placeholder
    const assistantMessage: ThreadMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: [],
      createdAt: new Date(),
      status: { type: "running" },
      metadata: {
        unstable_state: this.getThreadStateValue(),
        unstable_annotations: [],
        unstable_data: [],
        steps: [],
        custom: {},
      },
    };

    this._repository.addOrUpdateMessage(startConfig.parentId, assistantMessage);
    this.updateState({ isRunning: true, suggestions: [] });
    this.syncMessagesToState();

    // TODO: Integrate with chat model adapter to perform actual run
    // For now, just mark as complete after adding the placeholder
    // The actual implementation would stream results from the chat model
  }

  public unstable_resumeRun = (config: CreateResumeRunConfig): void => {
    if (!config.stream) {
      throw new Error("You must pass a stream parameter to resume runs.");
    }

    this.startRun({
      parentId: config.parentId,
      sourceId: config.sourceId,
      runConfig: config.runConfig,
    });
  }

  public cancelRun = (): void => {
    if (this._abortController) {
      this._abortController.abort();
      this._abortController = null;
    }

    this.updateState({ isRunning: false });
    this._notifyEventSubscribers("runEnd");
  }

  public getModelContext = (): ModelContext => {
    // TODO: Integrate with model context provider
    return {};
  }

  public export = (): ExportedMessageRepository => {
    return this._repository.export();
  }

  public import = (repository: ExportedMessageRepository): void => {
    this.ensureInitialized();
    this._repository.clear();
    this._repository.import(repository);
    this.syncMessagesToState();
  }

  public reset = (initialMessages?: readonly ThreadMessageLike[]): void => {
    const exportedRepo = ExportedMessageRepositoryUtils.fromArray(initialMessages ?? []);
    this.import(exportedRepo);
  }

  public message = (selector: { id: string } | { index: number }): MessageMethods => {
    const findMessage = (): { message: ThreadMessage; parentId: string | null; index: number } | undefined => {
      if ('id' in selector) {
        try {
          return this._repository.getMessage(selector.id);
        } catch {
          return undefined;
        }
      }

      const messages = this._repository.getMessages();
      const message = messages[selector.index];
      if (!message) return undefined;

      const parentId = selector.index > 0 ? messages[selector.index - 1]?.id ?? null : null;
      return { message, parentId, index: selector.index };
    };

    const messageData = findMessage();
    if (!messageData) {
      throw new Error("Message not found");
    }

    const composerMethods = this.get().composer.methods;

    return {
      composer: composerMethods,

      reload: (config?: { runConfig?: RunConfig }) => {
        const data = findMessage();
        if (!data) throw new Error("Message not found");

        this.startRun({
          parentId: data.parentId,
          runConfig: config?.runConfig,
        });
      },

      speak: () => {
        const data = findMessage();
        if (!data) throw new Error("Message not found");

        const adapter = this.getAdapters().speech;
        if (!adapter) throw new Error("Speech adapter not configured");

        this._stopSpeaking?.();

        const text = getThreadMessageText(data.message);
        const utterance = adapter.speak(text);

        const unsub = utterance.subscribe(() => {
          if (utterance.status.type === "ended") {
            this._stopSpeaking = undefined;
            this._speech = undefined;
          } else {
            this._speech = { messageId: data.message.id, status: utterance.status };
          }
          this.updateState({ speech: this._speech });
        });

        this._speech = { messageId: data.message.id, status: utterance.status };
        this.updateState({ speech: this._speech });

        this._stopSpeaking = () => {
          utterance.cancel();
          unsub();
          this._speech = undefined;
          this._stopSpeaking = undefined;
        };
      },

      stopSpeaking: () => {
        if (!this._stopSpeaking) throw new Error("No message is being spoken");
        this._stopSpeaking();
        this.updateState({ speech: undefined });
      },

      submitFeedback: (feedback: { type: "positive" | "negative" }) => {
        const data = findMessage();
        if (!data) throw new Error("Message not found");

        const adapter = this.getAdapters().feedback;
        if (!adapter) throw new Error("Feedback adapter not configured");

        adapter.submit({ message: data.message, type: feedback.type });

        if (data.message.role === "assistant") {
          const updatedMessage: ThreadMessage = {
            ...data.message,
            metadata: {
              ...data.message.metadata,
              submittedFeedback: { type: feedback.type },
            },
          };
          this._repository.addOrUpdateMessage(data.parentId, updatedMessage);
          this.syncMessagesToState();
        }
      },

      switchToBranch: (options: { position?: "previous" | "next"; branchId?: string }) => {
        const data = findMessage();
        if (!data) throw new Error("Message not found");

        if (options.branchId) {
          this._repository.switchToBranch(options.branchId);
        } else if (options.position) {
          const branches = this._repository.getBranches(data.message.id);
          const currentIndex = branches.indexOf(data.message.id);

          let newIndex: number;
          if (options.position === "previous") {
            newIndex = Math.max(0, currentIndex - 1);
          } else {
            newIndex = Math.min(branches.length - 1, currentIndex + 1);
          }

          const newBranchId = branches[newIndex];
          if (newBranchId) {
            this._repository.switchToBranch(newBranchId);
          }
        }

        this.syncMessagesToState();
      },

      getCopyText: () => {
        const data = findMessage();
        if (!data) throw new Error("Message not found");
        return getThreadMessageText(data.message);
      },

      part: (partSelector: { index: number } | { toolCallId: string }) => {
        const data = findMessage();
        if (!data) throw new Error("Message not found");

        const findPart = () => {
          if ('index' in partSelector) {
            return data.message.content[partSelector.index];
          }
          return data.message.content.find(
            (p) => p.type === "tool-call" && p.toolCallId === partSelector.toolCallId
          );
        };

        const part = findPart();
        if (!part) throw new Error("Part not found");

        const COMPLETE_STATUS: MessagePartStatus = { type: 'complete' };
        const RUNNING_STATUS: MessagePartStatus = { type: 'running' };

        return {
          getState: (): PartState => {
            const currentPart = findPart();
            if (!currentPart) throw new Error("Part not found");
            return {
              ...currentPart,
              status: currentPart.type === 'tool-call'
                ? (currentPart.result !== undefined ? COMPLETE_STATUS : RUNNING_STATUS)
                : COMPLETE_STATUS,
            } as PartState;
          },
          addToolResult: (result: unknown) => {
            if (part.type !== "tool-call") {
              throw new Error("Cannot add tool result to non-tool-call part");
            }
            // TODO: Implement tool result handling
          },
          resumeToolCall: (payload: unknown) => {
            if (part.type !== "tool-call") {
              throw new Error("Cannot resume tool call on non-tool-call part");
            }
            // TODO: Implement tool call resume handling
          },
        };
      },

      attachment: (attachmentSelector: { index: number } | { id: string }) => {
        const data = findMessage();
        if (!data) throw new Error("Message not found");

        const findAttachment = () => {
          if ('index' in attachmentSelector) {
            return data.message.attachments?.[attachmentSelector.index];
          }
          return data.message.attachments?.find((a) => a.id === attachmentSelector.id);
        };

        const attachment = findAttachment();
        if (!attachment) throw new Error("Attachment not found");

        return {
          getState: () => {
            const current = findAttachment();
            if (!current) throw new Error("Attachment not found");
            return current;
          },
          remove: async () => {
            // Message attachments are typically immutable after sending
            throw new Error("Cannot remove attachment from sent message");
          },
        };
      },

      setIsCopied: (_value: boolean) => {
        // This is UI state, typically handled at component level
        // For now, no-op as it doesn't affect core state
      },

      setIsHovering: (_value: boolean) => {
        // This is UI state, typically handled at component level
        // For now, no-op as it doesn't affect core state
      },
    };
  }

  public stopSpeaking = (): void => {
    if (!this._stopSpeaking) throw new Error("No message is being spoken");
    this._stopSpeaking();
    this.updateState({ speech: undefined });
  }

  public startVoice = async (): Promise<void> => {
    // TODO: Implement voice session start
    // This would typically establish WebRTC or similar connections
  }

  public stopVoice = async (): Promise<void> => {
    // TODO: Implement voice session stop
  }

  public getSlice(): AiChatStore['thread'] {
    return {
      // state: this._state,
      ... this._state,
      methods: {
        getState: this.getState,
        append: this.append,
        startRun: this.startRun,
        unstable_resumeRun: this.unstable_resumeRun,
        cancelRun: this.cancelRun,
        // getModelContext: this.getModelContext,
        export: this.export,
        import: this.import,
        reset: this.reset,
        message: this.message,
        stopSpeaking: this.stopSpeaking,
        startVoice: this.startVoice,
        stopVoice: this.stopVoice,
      }
    }
  }
}

export const createThreadSlice: StateCreator<
  AiChatStore,
  [],
  [],
  Pick<AiChatStore, 'thread'>
> = (...a) => ({
  thread: new ThreadRuntime(...a).getSlice()
})
