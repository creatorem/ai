import { UIMessage } from "ai";
import { Attachment } from "./attachment-types";

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
}
