import type { StateCreator } from "zustand";
import type { AiChatStore } from "./store";
import type { MessageState, PartState } from "./types/entities";
import type { AttachmentMethods } from "./types/entities/attachment";
import type { PartMethods } from "./types/entities/part";
import type { RunConfig, ThreadMessage, MessagePartStatus, ToolCallMessagePartStatus } from "./types/assistant-types";
import { getThreadMessageText } from "./utils/get-thread-message-text";

type MessageSlice = StateCreator<
  AiChatStore,
  [],
  [],
  Pick<AiChatStore, 'message'>
>

// Selected message info - which message from thread.messages is currently selected
type SelectedMessage = {
  type: "index";
  index: number;
} | {
  type: "id";
  id: string;
};

const COMPLETE_STATUS: MessagePartStatus = Object.freeze({
  type: "complete",
});

const toMessagePartStatus = (
  message: ThreadMessage,
  partIndex: number,
  part: ThreadMessage["content"][number],
): ToolCallMessagePartStatus => {
  if (message.role !== "assistant") return COMPLETE_STATUS;

  if (part.type === "tool-call") {
    if (!part.result) {
      return message.status as ToolCallMessagePartStatus;
    } else {
      return COMPLETE_STATUS;
    }
  }

  const isLastPart = partIndex === Math.max(0, message.content.length - 1);
  if (message.status?.type === "requires-action") return COMPLETE_STATUS;
  return isLastPart ? (message.status as MessagePartStatus) : COMPLETE_STATUS;
};

class MessageRuntime {
  private set: Parameters<MessageSlice>[0]
  private get: Parameters<MessageSlice>[1]

  private _state: MessageState
  private _selectedMessage: SelectedMessage = { type: "index", index: 0 };

  constructor(...[set, get]: Parameters<MessageSlice>) {
    this._state = {
      id: "",
      role: "user",
      content: [],
      createdAt: new Date(),
      status: { type: "complete", reason: "unknown" },
      parentId: null,
      isLast: true,
      branchNumber: 1,
      branchCount: 1,
      speech: undefined,
      submittedFeedback: undefined,
      composer: get().composer,
      parts: [],
      isCopied: false,
      isHovering: false,
      index: 0,
      metadata: {
        custom: {}
      },
    };

    this.set = set;
    this.get = get;
  }

  public get state(): MessageState {
    return this._state;
  }

  private updateState(updates: Partial<MessageState>) {
    this._state = { ...this._state, ...updates };

    this.set((store) => ({
      ...store,
      message: {
        ...store.message,
        state: this._state,
      }
    }));
  }

  private getCurrentMessage(): ThreadMessage | undefined {
    const threadState = this.get().thread;
    const messages = threadState.messages;

    if (this._selectedMessage.type === "index") {
      return messages[this._selectedMessage.index];
    } else {
      return messages.find(m => m.id === this._selectedMessage.id);
    }
  }

  private getCurrentMessageIndex(): number {
    const threadState = this.get().thread;
    const messages = threadState.messages;

    if (this._selectedMessage.type === "index") {
      return this._selectedMessage.index;
    } else {
      return messages.findIndex(m => m.id === this._selectedMessage.id);
    }
  }

  private syncFromThread() {
    const message = this.getCurrentMessage();
    if (!message) return;

    const threadState = this.get().thread;
    const messages = threadState.messages;
    const index = this.getCurrentMessageIndex();

    // Build parts with status
    const parts: PartState[] = message.content.map((part, partIndex) => ({
      ...part,
      status: toMessagePartStatus(message, partIndex, part),
    }));

    // Calculate branch info - in simplified version, we don't have full branching support
    // This would need to be enhanced with a MessageRepository for full branch support

    this.updateState({
      ...message,
      parentId: index > 0 ? messages[index - 1]?.id ?? null : null,
      isLast: index === messages.length - 1,
      branchNumber: 1, // Simplified - would need branch calculation
      branchCount: 1,  // Simplified - would need branch calculation
      speech: threadState.speech?.messageId === message.id ? threadState.speech : undefined,
      submittedFeedback: message.metadata?.submittedFeedback,
      composer: this.get().composer,
      parts,
      index,
    });
  }

  public reload = (config?: { runConfig?: RunConfig }): void => {
    const message = this.getCurrentMessage();
    if (!message) throw new Error("No message selected");

    if (message.role !== "assistant") {
      throw new Error("Can only reload assistant messages");
    }

    const threadMethods = this.get().thread.methods;
    const composerState = this.get().composer;

    threadMethods.startRun({
      parentId: this._state.parentId,
      sourceId: message.id,
      runConfig: config?.runConfig ?? composerState.runConfig,
    });
  }

  public speak = (): void => {
    const message = this.getCurrentMessage();
    if (!message) throw new Error("No message selected");

    const threadMethods = this.get().thread.methods;
    const messageMethods = threadMethods.message({ id: message.id });
    messageMethods.speak();
  }

  public stopSpeaking = (): void => {
    const message = this.getCurrentMessage();
    if (!message) throw new Error("No message selected");

    const threadState = this.get().thread;
    if (threadState.speech?.messageId !== message.id) {
      throw new Error("Message is not being spoken");
    }

    const threadMethods = this.get().thread.methods;
    threadMethods.stopSpeaking();
  }

  public submitFeedback = (feedback: { type: "positive" | "negative" }): void => {
    const message = this.getCurrentMessage();
    if (!message) throw new Error("No message selected");

    const threadMethods = this.get().thread.methods;
    const messageMethods = threadMethods.message({ id: message.id });
    messageMethods.submitFeedback(feedback);

    // Sync after feedback
    this.syncFromThread();
  }

  public switchToBranch = (options: { position?: "previous" | "next"; branchId?: string }): void => {
    const message = this.getCurrentMessage();
    if (!message) throw new Error("No message selected");

    if (options.branchId && options.position) {
      throw new Error("May not specify both branchId and position");
    }
    if (!options.branchId && !options.position) {
      throw new Error("Must specify either branchId or position");
    }

    const threadMethods = this.get().thread.methods;
    const messageMethods = threadMethods.message({ id: message.id });
    messageMethods.switchToBranch(options);

    // Sync after branch switch
    this.syncFromThread();
  }

  public getCopyText = (): string => {
    const message = this.getCurrentMessage();
    if (!message) return "";

    return getThreadMessageText(message);
  }

  public part = (selector: { index: number } | { toolCallId: string }): PartMethods => {
    const message = this.getCurrentMessage();
    if (!message) throw new Error("No message selected");

    const findPart = (): { part: ThreadMessage["content"][number]; index: number } | undefined => {
      if ('index' in selector) {
        const part = message.content[selector.index];
        return part ? { part, index: selector.index } : undefined;
      }
      const index = message.content.findIndex(
        (p) => p.type === "tool-call" && p.toolCallId === selector.toolCallId
      );
      if (index === -1) return undefined;
      return { part: message.content[index]!, index };
    };

    const partData = findPart();
    if (!partData) throw new Error("Part not found");

    return {
      addToolResult: (result: unknown): void => {
        const currentMessage = this.getCurrentMessage();
        if (!currentMessage) throw new Error("Message not found");

        const data = findPart();
        if (!data) throw new Error("Part not found");

        if (data.part.type !== "tool-call") {
          throw new Error("Can only add tool result to tool-call parts");
        }

        // Use thread's message method to add tool result
        const threadMethods = this.get().thread.methods;
        const messageMethods = threadMethods.message({ id: currentMessage.id });
        const partMethods = messageMethods.part(selector);
        partMethods.addToolResult({ result });

        // Sync after adding tool result
        this.syncFromThread();
      },

      resumeToolCall: (payload: unknown): void => {
        // This would typically resume a tool call that's waiting for human input
        // Implementation depends on how tool calls are resumed in the thread runtime
        console.warn("resumeToolCall not fully implemented");
      },
    };
  }

  public attachment = (selector: { index: number } | { id: string }): AttachmentMethods => {
    const message = this.getCurrentMessage();
    if (!message) throw new Error("No message selected");

    const findAttachment = () => {
      if ('index' in selector) {
        return message.attachments?.[selector.index];
      }
      return message.attachments?.find((a) => a.id === selector.id);
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
        // Message attachments are typically immutable after the message is sent
        throw new Error("Cannot remove attachment from sent message");
      },
    };
  }

  public setIsCopied = (value: boolean): void => {
    this.updateState({ isCopied: value });
  }

  public setIsHovering = (value: boolean): void => {
    this.updateState({ isHovering: value });
  }

  // Method to select a different message
  public selectMessage = (selector: SelectedMessage): void => {
    this._selectedMessage = selector;
    this.syncFromThread();
  }

  public getSlice(): AiChatStore['message'] {
    return {
      // state: this._state,
      ... this._state,
      methods: {
        composer: this.get().composer.methods,
        reload: this.reload,
        speak: this.speak,
        stopSpeaking: this.stopSpeaking,
        submitFeedback: this.submitFeedback,
        switchToBranch: this.switchToBranch,
        getCopyText: this.getCopyText,
        part: this.part,
        attachment: this.attachment,
        setIsCopied: this.setIsCopied,
        setIsHovering: this.setIsHovering,
      }
    }
  }
}

export const createMessageSlice: StateCreator<
  AiChatStore,
  [],
  [],
  Pick<AiChatStore, 'message'>
> = (...a) => ({
  message: new MessageRuntime(...a).getSlice()
})
