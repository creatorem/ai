'use client';

import { Tool, type UIMessage } from "ai";
// import { useChat } from "@ai-sdk/react";
import React, { useContext, useEffect, useMemo, useState } from "react";
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

const AiContext = React.createContext<AiContextType>({
    adapters: {},
    eventHandler: new AiChatEventHandler()
});

export const useAiContext = (): AiContextType => {
    const ctx = useContext(AiContext);
    if (!ctx) {
        throw new Error('AiContextType context not found.');
    }
    return ctx;
};

export const useTriggerAiEvent = <TEvent extends keyof AiChatEvents>(name: TEvent, p: AiChatEvents[TEvent]) => {
    const { eventHandler } = useAiContext()

    useEffect(() => {
        eventHandler.trigger(name, p)
    }, [eventHandler, name, p])
};

export const useAiEvent = <TEvent extends keyof AiChatEvents>(name: TEvent, p: (p: AiChatEvents[TEvent]) => void) => {
    const { eventHandler } = useAiContext()

    useEffect(() => {
        eventHandler.on(name, p)
    }, [eventHandler, name, p])
};

export function AiProvider({ children, ...value }: { children: React.ReactNode } & Omit<AiContextType, 'eventHandler'>) {
    const eventHandler = useMemo(() => new AiChatEventHandler(), []);

    return <AiContext.Provider value={{ ...value, eventHandler }}>
        <ThreadsProvider>
            {children}
        </ThreadsProvider>
    </AiContext.Provider>;
};

type ThreadsCtx = Threads & {
    setActiveThreadId: React.Dispatch<React.SetStateAction<Threads['activeThreadId']>>
    setThreadIds: React.Dispatch<React.SetStateAction<Threads['threadIds']>>
    setArchivedThreadIds: React.Dispatch<React.SetStateAction<Threads['archivedThreadIds']>>
}

const ThreadsContext = React.createContext<ThreadsCtx>({
    activeThreadId: null,
    setActiveThreadId: () => { },
    isLoading: true,
    threadIds: [],
    setThreadIds: () => { },
    archivedThreadIds: [],
    setArchivedThreadIds: () => { },
});

export const useThreads = (): Threads => {
    const ctx = useContext(ThreadsContext);
    if (!ctx) {
        throw new Error('AiContextType context not found.');
    }
    return ctx;
};


function ThreadsProvider({ children }: { children: React.ReactNode }) {
    const { adapters } = useAiContext();
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



    return (
        <ThreadsContext.Provider value={{
            activeThreadId,
            setActiveThreadId,
            isLoading,
            threadIds,
            setThreadIds,
            archivedThreadIds,
            setArchivedThreadIds,
        }}>
            {children}
        </ThreadsContext.Provider>
    )
};