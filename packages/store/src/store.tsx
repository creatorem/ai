import { createContext, useContext, useRef } from 'react'
import { createStore, useStore, StateCreator, create, Mutate, StoreApi } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware';
// import {createContext} from 'zustand/context'
// import { AttachmentState, ComposerState, MessageState, PartState, SuggestionsState, SuggestionState, ThreadListItemState, ThreadsState, ThreadState, ToolsState } from './types/entities';
import { ComposerState, MessageState, PartState, SuggestionsState, SuggestionState, ThreadListItemState, ThreadsState, ThreadState, ToolsState } from './types/entities';
import { Attachment, ThreadMessage } from './types';
import { RemoteThreadInitializeResponse, RemoteThreadListResponse, RemoteThreadMetadata } from './runtime-cores/remote-thread-list/types';
import { AssistantStream } from '@creatorem/stream';
import { AttachmentAdapter } from './types/adapters/attachment-adapter';
import { FeedbackAdapter } from './types/adapters/feedback';
import { SpeechSynthesisAdapter } from './types/adapters/speech';
import { ThreadListAdapter } from './types/adapters/threadlist-adapter';

export type AttachmentState = Attachment | null;

interface StoreAdapters {
  attachment: AttachmentAdapter
  feedback: FeedbackAdapter;
  speech: SpeechSynthesisAdapter;
  threadList: ThreadListAdapter
}

interface FilterStore {
  adapters: StoreAdapters
  setAdapters: <N extends keyof StoreAdapters>(name: N, adapter: StoreAdapters[N]) => void;
  attachment: { state: AttachmentState, remove: () => Promise<void>; };
  // composer: ComposerState;
  // message: MessageState;
  // part: PartState;
  // suggestion: SuggestionState;
  // suggestions: SuggestionsState;
  // thread: ThreadState;
  // threadListItem: ThreadListItemState;
  // threads: ThreadsState;
  // tools: ToolsState;
}

const createAdapterSlice: StateCreator<
  FilterStore,
  [],
  [],
  Pick<FilterStore, 'adapters' | 'setAdapters'>
> = (set) => ({
  adapters: {
    attachment: {} as AttachmentAdapter,
    feedback: {} as FeedbackAdapter,
    speech: {} as SpeechSynthesisAdapter,
    threadList: {} as ThreadListAdapter
  },
  setAdapters: (name, adapter) => set((state) => ({
    adapters: {
      ...state.adapters,
      [name]: adapter
    }
  }))
})

const createAttachmentSlice: StateCreator<
FilterStore,
[],
[],
Pick<FilterStore, 'attachment'>
> = (set, get) => ({
  attachment: {
    state: null,
    remove: async () => {
      const {attachment, adapters} = get();

      if(!attachment.state){
        return;
      }
  
      await adapters.attachment.remove(attachment.state);

      set((state) => ({
        ...state,
        attachment: {
          ...state.attachment,
          state: null
        }
      }))
    }
  },
})

const useAssitantStore = create<FilterStore>()((...a) => ({
  ...createAdapterSlice(...a),
  ...createAttachmentSlice(...a),
}))





