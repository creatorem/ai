'use client';

import { Tool} from "ai";
// import { useChat } from "@ai-sdk/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createStore, useStore, type StoreApi } from 'zustand';
import { ThreadAdapter, AttachmentAdapter, DictationAdapter } from "../types/adapters";
import { Threads } from "../types/entities";
import { useChat } from "@ai-sdk/react";
import { AiChatEventHandler, AiChatEvents } from "./events";

type LanguageModelV1CallSettings = {
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
    seed?: number;
    headers?: Record<string, string | undefined>;
};

type LanguageModelConfig = {
    apiKey?: string;
    baseUrl?: string;
    modelName?: string;
};

export type AiContextType = {
    adapters?: {
        attachment?: AttachmentAdapter;
        thread?: ThreadAdapter;
        dictation?: DictationAdapter;
    }
    priority?: number | undefined;
    system?: string | undefined;
    tools?: Record<string, Tool<any, any>> | undefined;
    callSettings?: LanguageModelV1CallSettings | undefined;
    config?: LanguageModelConfig | undefined;
    chatOptions?: Omit<Parameters<typeof useChat>[0], 'id' | 'transport'>
    eventHandler: AiChatEventHandler
};

const AiContextStoreCtx = React.createContext<StoreApi<AiContextType> | null>(null);

export function useAiContext(): AiContextType;
export function useAiContext<T>(selector: (state: AiContextType) => T): T;
export function useAiContext<T>(selector?: (state: AiContextType) => T) {
    const store = React.useContext(AiContextStoreCtx);
    if (!store) throw new Error('This component must be used within AiProvider.');
    return useStore(store, selector as any);
}

export function useAiContextStore(): StoreApi<AiContextType> {
    const store = React.useContext(AiContextStoreCtx);
    if (!store) throw new Error('This component must be used within AiProvider.');
    return store;
}

export const useTriggerAiEvent = <TEvent extends keyof AiChatEvents>(name: TEvent, p: AiChatEvents[TEvent]) => {
    const eventHandler = useAiContext(s => s.eventHandler);

    useEffect(() => {
        eventHandler.trigger(name, p)
    }, [eventHandler, name, p])
};

export const useAiEvent = <TEvent extends keyof AiChatEvents>(name: TEvent, p: (p: AiChatEvents[TEvent]) => void) => {
    const eventHandler = useAiContext(s => s.eventHandler);

    useEffect(() => {
        eventHandler.on(name, p)
    }, [eventHandler, name, p])
};

export function AiProvider({ children, ...value }: { children: React.ReactNode } & Omit<AiContextType, 'eventHandler'>) {
    const eventHandler = useMemo(() => new AiChatEventHandler(), []);

    // Create store once
    const storeRef = useRef<StoreApi<AiContextType> | null>(null);
    if (storeRef.current === null) {
        storeRef.current = createStore<AiContextType>(() => ({ ...value, eventHandler }));
    }

    // Sync state during render (safe: zustand store is external to React)
    storeRef.current.setState({ ...value, eventHandler });

    return <AiContextStoreCtx.Provider value={storeRef.current}>
        <ThreadsProvider>
            {children}
        </ThreadsProvider>
    </AiContextStoreCtx.Provider>;
};

type ThreadsCtx = Threads & {
    setActiveThreadId: React.Dispatch<React.SetStateAction<Threads['activeThreadId']>>
    setThreadIds: React.Dispatch<React.SetStateAction<Threads['threadIds']>>
    setArchivedThreadIds: React.Dispatch<React.SetStateAction<Threads['archivedThreadIds']>>
}

const ThreadsStoreCtx = React.createContext<StoreApi<ThreadsCtx> | null>(null);

export function useThreads(): Threads;
export function useThreads<T>(selector: (state: ThreadsCtx) => T): T;
export function useThreads<T>(selector?: (state: ThreadsCtx) => T) {
    const store = React.useContext(ThreadsStoreCtx);
    if (!store) throw new Error('This component must be used within AiProvider.');
    return useStore(store, selector as any);
}

export function useThreadsStore(): StoreApi<ThreadsCtx> {
    const store = React.useContext(ThreadsStoreCtx);
    if (!store) throw new Error('This component must be used within AiProvider.');
    return store;
}


function ThreadsProvider({ children }: { children: React.ReactNode }) {
    const adapters = useAiContext(s => s.adapters);
    const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [threadIds, setThreadIds] = useState<string[]>([])
    const [archivedThreadIds, setArchivedThreadIds] = useState<string[]>([])

    useEffect(() => {
        (async function () {
            if (adapters?.thread) {
                const { threadIds: ids, archivedThreadIds: archivedIds } = await adapters.thread.list();
                setThreadIds(ids)
                setArchivedThreadIds(archivedIds)
            }
            setIsLoading(false)
        })()
    }, [adapters])

    // Create store once
    const storeRef = useRef<StoreApi<ThreadsCtx> | null>(null);
    if (storeRef.current === null) {
        storeRef.current = createStore<ThreadsCtx>(() => ({
            activeThreadId,
            setActiveThreadId,
            isLoading,
            threadIds,
            setThreadIds,
            archivedThreadIds,
            setArchivedThreadIds,
        }));
    }

    // Sync state during render
    storeRef.current.setState({
        activeThreadId,
        setActiveThreadId,
        isLoading,
        threadIds,
        setThreadIds,
        archivedThreadIds,
        setArchivedThreadIds,
    });

    return (
        <ThreadsStoreCtx.Provider value={storeRef.current}>
            {children}
        </ThreadsStoreCtx.Provider>
    )
};