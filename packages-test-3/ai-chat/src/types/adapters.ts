// export type ThreadMetadata = {
//   readonly status: "regular" | "archived";
//   readonly remoteId: string;
//   readonly externalId?: string | undefined;
//   readonly title?: string | undefined;
// };

import { Thread, Threads } from "./entities";
import type { Attachment, PendingAttachment, CompleteAttachment } from "./attachment-types";
import type { Unsubscribe } from "./unsuscribe";


// export type ThreadListResponse = {
//   threads: ThreadMetadata[];
// };

// export type ThreadInitializeResponse = {
//   remoteId: string;
//   externalId: string | undefined;
// };

export type ThreadAdapter = {
    list(): Promise<Pick<Threads, 'threadIds' | 'archivedThreadIds'>>;

    // rename(remoteId: string, newTitle: string): Promise<void>;
    // archive(remoteId: string): Promise<void>;
    // unarchive(remoteId: string): Promise<void>;
    // delete(remoteId: string): Promise<void>;
    // initialize(threadId: string): Promise<ThreadInitializeResponse>;
    // generateTitle(
    //   remoteId: string,
    //   // unstable_messages: readonly ThreadMessage[],
    // ): Promise<string>;
    fetch(threadId: string): Promise<Pick<Thread, 'title' | 'status' | 'messages'>>;

    // unstable_Provider?: ComponentType<PropsWithChildren>;
  };

export type AttachmentAdapter = {
  accept: string;
  add(state: { file: File }): Promise<PendingAttachment> | AsyncGenerator<PendingAttachment, void>;
  remove(attachment: Attachment): Promise<void>;
  send(attachment: PendingAttachment): Promise<CompleteAttachment>;
};

export namespace DictationAdapter {
  export type Status =
    | { type: "starting" | "running" }
    | { type: "ended"; reason: "stopped" | "cancelled" | "error" };

  export type Result = {
    transcript: string;
    isFinal?: boolean;
  };

  export type Session = {
    status: Status;
    stop: () => Promise<void>;
    cancel: () => void;
    onSpeechStart: (callback: () => void) => Unsubscribe;
    onSpeechEnd: (callback: (result: Result) => void) => Unsubscribe;
    onSpeech: (callback: (result: Result) => void) => Unsubscribe;
  };
}

export type DictationAdapter = {
  listen: () => DictationAdapter.Session;
  disableInputDuringDictation?: boolean;
};

export type DictationState = {
  readonly status: DictationAdapter.Status;
  readonly transcript?: string;
  readonly inputDisabled?: boolean;
};