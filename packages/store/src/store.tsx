import { createContext, useContext, useRef } from 'react'
import { createStore, useStore, StateCreator, create, Mutate, StoreApi } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware';
// import {createContext} from 'zustand/context'
// import { AttachmentState, ComposerState, MessageState, PartState, SuggestionsState, SuggestionState, ThreadListItemState, ThreadsState, ThreadState, ToolsState } from './types/entities';
import { ComposerMethods, ComposerState, MessageMethods, MessageState, PartMethods, PartState, SuggestionMethods, SuggestionsState, SuggestionState, ThreadListItemMethods, ThreadListItemState, ThreadMethods, ThreadsMethods, ThreadsState, ThreadState, ToolsMethods, ToolsState } from './types/entities';
import { Attachment, ThreadMessage } from './types';
import { RemoteThreadInitializeResponse, RemoteThreadListResponse, RemoteThreadMetadata } from './runtime-cores/remote-thread-list/types';
import { AssistantStream } from '@creatorem/stream';
import { AttachmentAdapter } from './types/adapters/attachment-adapter';
import { FeedbackAdapter } from './types/adapters/feedback';
import { DictationAdapter, SpeechSynthesisAdapter } from './types/adapters/speech';
import { ThreadListAdapter } from './types/adapters/threadlist-adapter';
import { createComposerSlice } from './composer-slice';
import { createToolsSlice } from './tools-slice';
import { AttachmentState, createAttachmentSlice } from './attachment-slice';
import { createThreadSlice } from './thread-slice';
import { createThreadListItemSlice } from './thead-list-item-slice';
import { createMessageSlice } from './message-slice';
import { createPartSlice } from './part-slice';
import { createThreadsSlice } from './threads-slice';

interface StoreAdapters {
  attachment: AttachmentAdapter
  dictation: DictationAdapter;
  feedback: FeedbackAdapter;
  speech: SpeechSynthesisAdapter;
  threadList: ThreadListAdapter
}

export interface FilterStore {
  adapters: StoreAdapters
  setAdapters: <N extends keyof StoreAdapters>(name: N, adapter: StoreAdapters[N]) => void;
  attachment: { state: AttachmentState } & { methods: { remove: () => Promise<void> } };
  composer: { state: ComposerState, methods: ComposerMethods };
  message: {state: MessageState, methods: MessageMethods};
  part: {state:PartState, methods: PartMethods};
  suggestion: SuggestionState | null;
  suggestions: SuggestionsState;
  thread: {state: ThreadState, methods: ThreadMethods};
  threadListItem: {state: ThreadListItemState, methods: ThreadListItemMethods};
  threads: {state: ThreadsState, methods: ThreadsMethods};
  tools: { state: ToolsState, methods: ToolsMethods };
}

const createAdapterSlice: StateCreator<
  FilterStore,
  [],
  [],
  Pick<FilterStore, 'adapters' | 'setAdapters'>
> = (set) => ({
  adapters: {
    attachment: {} as AttachmentAdapter,
    dictation: {} as DictationAdapter,
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

export const useAssitantStore = create<FilterStore>()((...a) => ({
  ...createAdapterSlice(...a),
  ...createAttachmentSlice(...a),
  ...createComposerSlice(...a),
  ...createMessageSlice(...a),
  ...createPartSlice(...a),
  suggestions: {
    'suggestions': []
  },
  suggestion: null,
  ...createThreadSlice(...a),
  ...createThreadListItemSlice(...a),
  ...createThreadsSlice(...a),
  ...createToolsSlice(...a),
}))





