'use client';

import { useChat } from "@ai-sdk/react";
import { DataUIPart, DefaultChatTransport, generateId } from "ai";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createStore, useStore, type StoreApi } from 'zustand';
import { Thread, ThreadCapabilities } from '../../types/entities';
import { useAiContext, useThreads } from "../ai-provider";
import { ComposerCtxType } from "../composer/composer-provider";

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
    // chatStatus: ReturnType<typeof useChat<Thread['messages'][0]>>['status']
    // composerText: string,
    // setComposerText: (v: string) => void,
    send: (o: { clearText?: boolean, prompt?: string }) => void,
    /** The StoreApi of the first composer mounted within this thread. */
    composerStore: StoreApi<ComposerCtxType> | null,
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
    // const [isRunning, setIsRunning] = useState(false);
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
        const text = storeRef.current!.getState().composerStore!.getState().text
        console.log({ text })
        console.log({ prompt })
        const finalPrompt = prompt ?? text
        if (!finalPrompt) {
            throw new Error('No prompt passed.')
        }
        sendMessage({ text: finalPrompt })
        if (clearText) {
            storeRef.current!.getState().composerStore!.getState()!.setText('')
        }
    }, [sendMessage])

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
            isRunning: chatStatus === 'streaming',
            title,
            status,
            messages,
            capabilities,
            chatStatus,
            dataStream,
            setDataStream,
            // composerText,
            // setComposerText,
            send,
            composerStore: null,
            ...other
        }));
    }

    // Sync state after render (avoids "setState during render" warning)
    useLayoutEffect(() => {
        storeRef.current!.setState({
            id,
            isEmpty: messages.length === 0,
            isDisabled,
            isLoading,
            isRunning: chatStatus === 'streaming',
            title,
            status,
            messages,
            capabilities,
            dataStream,
            setDataStream,
            // composerText,
            // setComposerText,
            send,
            ...other
        });
    });

    return <ThreadStoreCtx.Provider value={storeRef.current}>
        {children}
    </ThreadStoreCtx.Provider>;
};
