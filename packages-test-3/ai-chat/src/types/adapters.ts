// export type ThreadMetadata = {
//   readonly status: "regular" | "archived";
//   readonly remoteId: string;
//   readonly externalId?: string | undefined;
//   readonly title?: string | undefined;
// };

import { Thread, Threads } from "./entities";


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