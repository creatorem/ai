import { StateCreator, create } from 'zustand'
import { ComposerMethods, ComposerState, MessageMethods, MessageState, PartMethods, PartState, SuggestionMethods, SuggestionsState, SuggestionState, ThreadListItemMethods, ThreadListItemState, ThreadMethods, ThreadsMethods, ThreadsState, ThreadState, ToolsMethods, ToolsState } from './types/entities';
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
import { useShallow } from 'zustand/shallow';

interface StoreAdapters {
  attachment: AttachmentAdapter
  dictation: DictationAdapter;
  feedback: FeedbackAdapter;
  speech: SpeechSynthesisAdapter;
  threadList: ThreadListAdapter
}

export interface AiChatStore {
  adapters: StoreAdapters
  setAdapters: <N extends keyof StoreAdapters>(name: N, adapter: StoreAdapters[N]) => void;
  attachment: { state: AttachmentState } & { methods: { remove: () => Promise<void> } };
  composer: ComposerState & { methods: ComposerMethods };
  message: MessageState & { methods: MessageMethods };
  part: PartState & { methods: PartMethods }
  suggestion: SuggestionState | null;
  suggestions: SuggestionsState;
  thread: ThreadState & {methods:ThreadMethods}
  threadListItem: ThreadListItemState & {methods:ThreadListItemMethods}
  threads: ThreadsState & {methods:ThreadsMethods}
  tools: ToolsState & {methods:ToolsMethods}
}

const createAdapterSlice: StateCreator<
  AiChatStore,
  [],
  [],
  Pick<AiChatStore, 'adapters' | 'setAdapters'>
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

export const useAiChat = create<AiChatStore>()((...a) => ({
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

export const useAiChatShallow = <T,>(selector: (state: AiChatStore) => T): T =>
  useAiChat(useShallow(selector))

// export const useAiChatState = <T,>(selector: (state: AiChatStore) => T): T => {
//   // I would like to return select only the state values
// }
// const isComposerEditing = useAiChatState(({ composer }) => composer.isEditing)
// instead of doing 
// const isComposerEditing = useAiChat(({ composer: {state: composer} }) => composer.isEditing);

// same for methods
// export const useAiChatMethods = <T,>(selector: (state: AiChatStore) => T): T => {
//   // I would like to return select only the state values
// }
// const isComposerEditing = useAiChatState(({ composer }) => composer.isEditing)
// instead of doing 
// const isComposerEditing = useAiChat(({ composer: {state: composer} }) => composer.isEditing);





