import { UIMessage } from "ai";
import { Attachment } from "./attachment-types";
import type { DictationState } from "./adapters";

export type Threads = {
    isLoading: boolean;
    activeThreadId: string | null;
    threadIds: string[];
    archivedThreadIds: string[];
    // readonly threadItems: readonly ThreadListItemState[];
    // readonly main: ThreadState;
};

export type ThreadCapabilities = {
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

export type Thread = {
    id: string;
    /**
    * Whether the thread is empty. A thread is considered empty when it has no messages and is not loading.
    */
    isEmpty: boolean;
    /**
     * Whether the thread is disabled. Disabled threads cannot receive new messages.
     */
    isDisabled: boolean;
    /**
     * Whether the thread is loading its history.
     */
    isLoading: boolean;
    /**
     * Whether the thread is running. A thread is considered running when there is an active stream connection to the backend.
     */
    isRunning: boolean;
    /**
     * The capabilities of the thread, such as whether the thread supports editing, branch switching, etc.
     */
    capabilities: ThreadCapabilities;
    title: string;
    status: 'regular' | 'archived',
    // metadata?: Record<string, unknown>,
    /**
     * The messages in the currently selected branch of the thread.
     */
    messages: UIMessage[];
};

export type Composer = {
    text: string;
    role: UIMessage['role'];
    attachments: readonly Attachment[];
    isEditing: boolean;
    canCancel: boolean;
    attachmentAccept: string;
    isEmpty: boolean;
    type: "thread" | "edit";
    dictation?: DictationState;
}

export type MessageStatus =
    | { readonly type: "running" }
    | { readonly type: "requires-action"; readonly reason: "tool-calls" | "interrupt" }
    | { readonly type: "complete"; readonly reason: "stop" | "unknown" }
    | {
        readonly type: "incomplete";
        readonly reason: "cancelled" | "tool-calls" | "length" | "content-filter" | "other" | "error";
        readonly error?: unknown;
    };

export type SpeechState = {
    readonly messageId: string;
};

export type PartStatus =
    | { readonly type: "running" }
    | { readonly type: "complete" }
    | { readonly type: "requires-action"; readonly reason: "tool-calls" | "interrupt" };

export type Part = UIMessage['parts'][number] & {
    status: PartStatus;
    /** The position of this part in the message */
    index: number;
}

export type Message = Omit<UIMessage, 'metadata'> & {
    metadata: {
        submittedFeedback?: { readonly type: "positive" | "negative" };
        custom?: Record<string, unknown>;
    };
    status: MessageStatus;
    attachments: readonly Attachment[];
    speech: SpeechState | undefined;
    parentId: string | null;
    isLast: boolean;
    branchNumber: number;
    branchCount: number;
    isCopied: boolean;
    isHovering: boolean;
    /** The position of this message in the thread (0 for first message) */
    index: number;
}
