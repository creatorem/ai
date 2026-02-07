import { AssistantStream } from "@creatorem/stream";
import { ThreadMessage } from "../assistant-types";

export type RemoteThreadMetadata = {
  readonly status: "regular" | "archived";
  readonly remoteId: string;
  readonly externalId?: string | undefined;
  readonly title?: string | undefined;
};


export type RemoteThreadListResponse = {
  threads: RemoteThreadMetadata[];
};

export type RemoteThreadInitializeResponse = {
  remoteId: string;
  externalId: string | undefined;
};

export type ThreadListAdapter = {
    list(): Promise<RemoteThreadListResponse>;
  
    rename(remoteId: string, newTitle: string): Promise<void>;
    archive(remoteId: string): Promise<void>;
    unarchive(remoteId: string): Promise<void>;
    delete(remoteId: string): Promise<void>;
    initialize(threadId: string): Promise<RemoteThreadInitializeResponse>;
    generateTitle(
      remoteId: string,
      unstable_messages: readonly ThreadMessage[],
    ): Promise<AssistantStream>;
    fetch(threadId: string): Promise<RemoteThreadMetadata>;
  
    // unstable_Provider?: ComponentType<PropsWithChildren>;
  };