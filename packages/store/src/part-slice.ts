import type { StateCreator } from "zustand";
import type { FilterStore } from "./store";
import type { PartState } from "./types/entities";
import type {
  ThreadMessage,
  MessagePartStatus,
  ToolCallMessagePartStatus,
} from "./types/assistant-types";
import { ToolResponse } from "@creatorem/stream";

type PartSlice = StateCreator<
  FilterStore,
  [],
  [],
  Pick<FilterStore, 'part'>
>

// Selected part info - which part from message.content is currently selected
type SelectedPart = {
  type: "index";
  index: number;
} | {
  type: "toolCallId";
  toolCallId: string;
};

const COMPLETE_STATUS: MessagePartStatus = Object.freeze({
  type: "complete",
});

const toPartStatus = (
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

class PartRuntime {
  private set: Parameters<PartSlice>[0]
  private get: Parameters<PartSlice>[1]

  private _state: PartState
  private _selectedPart: SelectedPart = { type: "index", index: 0 };

  constructor(...[set, get]: Parameters<PartSlice>) {
    this._state = {
      type: "text",
      text: "",
      status: COMPLETE_STATUS,
    };

    this.set = set;
    this.get = get;
  }

  public get state(): PartState {
    return this._state;
  }

  private updateState(newState: PartState) {
    this._state = newState;

    this.set((store) => ({
      ...store,
      part: {
        ...store.part,
        state: this._state,
      }
    }));
  }

  private getCurrentMessage(): ThreadMessage | undefined {
    const messageState = this.get().message.state;
    // The message state already contains the full message data
    if (!messageState.id) return undefined;
    return messageState;
  }

  private getCurrentPart(): { part: ThreadMessage["content"][number]; index: number } | undefined {
    const message = this.getCurrentMessage();
    if (!message) return undefined;

    if (this._selectedPart.type === "index") {
      const part = message.content[this._selectedPart.index];
      return part ? { part, index: this._selectedPart.index } : undefined;
    } else {
      const index = message.content.findIndex(
        (p) => p.type === "tool-call" && p.toolCallId === this._selectedPart.toolCallId
      );
      if (index === -1) return undefined;
      return { part: message.content[index]!, index };
    }
  }

  private syncFromMessage() {
    const message = this.getCurrentMessage();
    if (!message) return;

    const partData = this.getCurrentPart();
    if (!partData) return;

    const status = toPartStatus(message, partData.index, partData.part);

    this.updateState({
      ...partData.part,
      status,
    } as PartState);
  }

  public addToolResult = (result: unknown): void => {
    const message = this.getCurrentMessage();
    if (!message) throw new Error("No message available");

    const partData = this.getCurrentPart();
    if (!partData) throw new Error("Part not found");

    if (partData.part.type !== "tool-call") {
      throw new Error("Tried to add tool result to non-tool message part");
    }

    const toolName = partData.part.toolName;
    const toolCallId = partData.part.toolCallId;

    // Convert result to ToolResponse format
    const response = ToolResponse.toResponse(result);

    // Get the thread methods and call addToolResult
    // Since we don't have direct access to the thread runtime core's addToolResult,
    // we need to work through the message's part method
    const threadMethods = this.get().thread.methods;
    const messageMethods = threadMethods.message({ id: message.id });

    // Use the part method from message to add tool result
    const partSelector = this._selectedPart.type === "index"
      ? { index: this._selectedPart.index }
      : { toolCallId: this._selectedPart.toolCallId };

    const partMethods = messageMethods.part(partSelector);
    partMethods.addToolResult({
      result: response.result,
      isError: response.isError,
      artifact: response.artifact,
    });

    // Sync after adding tool result
    this.syncFromMessage();
  }

  public resumeToolCall = (payload: unknown): void => {
    const message = this.getCurrentMessage();
    if (!message) throw new Error("No message available");

    const partData = this.getCurrentPart();
    if (!partData) throw new Error("Part not found");

    if (partData.part.type !== "tool-call") {
      throw new Error("Tried to resume tool call on non-tool message part");
    }

    const toolCallId = partData.part.toolCallId;

    // Resume tool call through thread runtime
    // This would typically call threadRuntime.resumeToolCall({ toolCallId, payload })
    // For now, this is a placeholder as the thread slice doesn't expose resumeToolCall directly
    console.warn("resumeToolCall: This operation requires thread runtime support for resuming tool calls", {
      toolCallId,
      payload,
    });
  }

  // Method to select a different part
  public selectPart = (selector: SelectedPart): void => {
    this._selectedPart = selector;
    this.syncFromMessage();
  }

  public getSlice(): FilterStore['part'] {
    return {
      state: this._state,
      methods: {
        addToolResult: this.addToolResult,
        resumeToolCall: this.resumeToolCall,
      }
    }
  }
}

export const createPartSlice: StateCreator<
  FilterStore,
  [],
  [],
  Pick<FilterStore, 'part'>
> = (...a) => ({
  part: new PartRuntime(...a).getSlice()
})
