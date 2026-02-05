import { AssistantStream } from "@creatorem/stream";
import { ThreadMessage } from "../assistant-types";

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