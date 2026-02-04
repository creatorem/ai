import { useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { AttachmentState, ComposerState, MessageState, PartState, SuggestionsState, SuggestionState, ThreadListItemState, ThreadsState, ThreadState, ToolsState } from './types/entities';

interface FilterStore {
    attachment: AttachmentState;
    composer: ComposerState;
    message: MessageState;
    part: PartState;
    suggestion: SuggestionState;
    suggestions: SuggestionsState;
    thread: ThreadState;
    threadListItem: ThreadListItemState;
    threads: ThreadsState;
    tools: ToolsState;
}


const useFilterStore = create<FilterStore>()(
    subscribeWithSelector((set, get) => ({
    }))
);