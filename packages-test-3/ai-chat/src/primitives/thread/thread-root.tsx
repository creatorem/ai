'use client';

import { useChat } from "@ai-sdk/react";
import { DataUIPart, DefaultChatTransport, generateId } from "ai";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createStore, useStore, type StoreApi } from 'zustand';
import { Thread, ThreadCapabilities } from '../../types/entities';
import { useAiContext, useThreads } from "../ai-provider";

export type CustomUIDataTypes = {
    textDelta: string;
    imageDelta: string;
    sheetDelta: string;
    codeDelta: string;
    // suggestion: Suggestion;
    appendMessage: string;
    id: string;
    title: string;
    // kind: ArtifactKind;
    clear: null;
    finish: null;
    "chat-title": string;
};

export type ThreadMethods = {
};

type ThreadCtxType = Thread & Omit<ReturnType<typeof useChat<Thread['messages'][0]>>, 'status' | 'setMessages' | 'sendMessage'> & {
    dataStream: DataUIPart<CustomUIDataTypes>[];
    setDataStream: React.Dispatch<
        React.SetStateAction<DataUIPart<CustomUIDataTypes>[]>
    >;
    chatStatus: ReturnType<typeof useChat<Thread['messages'][0]>>['status']
    composerText: string,
    setComposerText: (v: string) => void,
    send: (o: { clearText?: boolean, prompt?: string }) => void
}

const ThreadStoreCtx = React.createContext<StoreApi<ThreadCtxType> | null>(null);

export function useThread(): ThreadCtxType;
export function useThread<T>(selector: (state: ThreadCtxType) => T): T;
export function useThread<T>(selector?: (state: ThreadCtxType) => T) {
    const store = React.useContext(ThreadStoreCtx);
    if (!store) throw new Error('This component must be used within ThreadCtx.Provider.');
    return useStore(store, selector as any);
}

export function useThreadStore(): StoreApi<ThreadCtxType> {
    const store = React.useContext(ThreadStoreCtx);
    if (!store) throw new Error('This component must be used within ThreadCtx.Provider.');
    return store;
}

export function ThreadPrimitiveRoot({ children, ...value }: { children: React.ReactNode }) {
    const adapters = useAiContext(s => s.adapters);
    const chatOptions = useAiContext(s => s.chatOptions);
    const activeThreadId = useThreads(s => s.activeThreadId);
    const [title, setTitle] = useState('New thread');
    const [status, setStatus] = useState<Thread['status']>('regular');
    const [isLoading, setIsLoading] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [capabilities, setCapabilities] = useState<ThreadCapabilities>({
        switchToBranch: false,
        switchBranchDuringRun: false,
        edit: false,
        reload: false,
        cancel: false,
        unstable_copy: false,
        speech: false,
        dictation: false,
        attachments: false,
        feedback: false,
    })
    const [dataStream, setDataStream] = useState<DataUIPart<CustomUIDataTypes>[]>(
        []
    );
    const [composerText, setComposerText] = useState<string>('')

    const {
        id,
        messages,
        setMessages,
        status: chatStatus,
        sendMessage,
        ...other
    } = useChat<Thread['messages'][0]>({
        generateId: generateId,
        // sendAutomaticallyWhen: ({ messages: currentMessages }) => {
        //     const lastMessage = currentMessages.at(-1);
        //     const shouldContinue =
        //         lastMessage?.parts?.some(
        //             (part) =>
        //                 "state" in part &&
        //                 part.state === "approval-responded" &&
        //                 "approval" in part &&
        //                 (part.approval as { approved?: boolean })?.approved === true
        //         ) ?? false;
        //     return shouldContinue;
        // },
        // transport: new DefaultChatTransport({
        //     api: "/api/chat",
        //     // fetch: fetchWithErrorHandlers,
        //     prepareSendMessagesRequest(request) {
        //         const lastMessage = request.messages.at(-1);
        //         const isToolApprovalContinuation =
        //             lastMessage?.role !== "user" ||
        //             request.messages.some((msg) =>
        //                 msg.parts?.some((part) => {
        //                     const state = (part as { state?: string }).state;
        //                     return (
        //                         state === "approval-responded" || state === "output-denied"
        //                     );
        //                 })
        //             );

        //         return {
        //             body: {
        //                 id: request.id,
        //                 ...(isToolApprovalContinuation
        //                     ? { messages: request.messages }
        //                     : { message: lastMessage }),
        //                 // selectedChatModel: currentModelIdRef.current,
        //                 // selectedVisibilityType: visibilityType,
        //                 ...request.body,
        //             },
        //         };
        //     },
        // }),
        ...chatOptions,
        onData: (dataPart) => {
            setDataStream((ds) => (ds ? [...ds, dataPart] : []));
        },
        // id: activeThreadId || undefined,
    });

    const send = useCallback(({ clearText = true, prompt }: { clearText?: boolean, prompt?: string }) => {
        sendMessage({ text: prompt ?? composerText })
        if (clearText) {
            setComposerText('')
        }
    }, [sendMessage, composerText])

    useEffect(() => {
        (async function () {
            if (adapters?.thread && activeThreadId) {
                const thread = await adapters.thread.fetch(activeThreadId);
                setTitle(thread.title)
                setStatus(thread.status)
                setMessages(thread.messages)
                setIsLoading(false)
            }
        })()
    }, [adapters, id])

    // Create store once
    const storeRef = useRef<StoreApi<ThreadCtxType> | null>(null);
    if (storeRef.current === null) {
        storeRef.current = createStore<ThreadCtxType>(() => ({
            id,
            isEmpty: messages.length === 0,
            isDisabled,
            isLoading,
            isRunning,
            title,
            status,
            messages,
            capabilities,
            chatStatus,
            dataStream,
            setDataStream,
            composerText,
            setComposerText,
            send,
            ...other
        }));
    }

    // Sync state during render (safe: zustand store is external to React)
    storeRef.current.setState({
        id,
        isEmpty: messages.length === 0,
        isDisabled,
        isLoading,
        isRunning,
        title,
        status,
        messages,
        capabilities,
        chatStatus,
        dataStream,
        setDataStream,
        composerText,
        setComposerText,
        send,
        ...other
    });

    return <ThreadStoreCtx.Provider value={storeRef.current}>
        {children}
    </ThreadStoreCtx.Provider>;
};
