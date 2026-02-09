'use client';

import { useChat } from "@ai-sdk/react";
import { DataUIPart, DefaultChatTransport, FileUIPart, generateId } from "ai";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createStore, useStore, type StoreApi } from 'zustand';
import { Thread, ThreadCapabilities } from '../../types/entities';
import { useAiContext, useThreads } from "../ai-provider";
import { ComposerCtxType } from "../composer/composer-provider";
import { MessageRepository } from "../../utils/message-repository";
import { AttachmentsProvider } from "../attachment/attachment-by-index-provider";

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

export type ThreadCtxType = Thread & Omit<ReturnType<typeof useChat<Thread['messages'][0]>>, 'status' | 'setMessages' | 'sendMessage'> & {
    dataStream: DataUIPart<CustomUIDataTypes>[];
    setDataStream: React.Dispatch<
        React.SetStateAction<DataUIPart<CustomUIDataTypes>[]>
    >;
    // chatStatus: ReturnType<typeof useChat<Thread['messages'][0]>>['status']
    // composerText: string,
    // setComposerText: (v: string) => void,
    send: (o: { clearText?: boolean, prompt?: string, files?: FileList | FileUIPart[] }) => void,
    sendEdit: (messageId: string, text: string, files?: FileList | FileUIPart[]) => void,
    beginEdit: (messageId: string) => void;
    stopEdit: (messageId: string) => void;
    getBranches: (messageId: string) => string[];
    switchToBranch: (messageId: string) => void;
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

const _noopRemoveAttachment = () => {};

export function ThreadPrimitiveRoot({ children, ...value }: { children: React.ReactNode }) {
    const eventHandler = useAiContext(s => s.eventHandler);
    const adapters = useAiContext(s => s.adapters);
    const chatOptions = useAiContext(s => s.chatOptions);
    const activeThreadId = useThreads(s => s.activeThreadId);
    const [title, setTitle] = useState('New thread');
    const [status, setStatus] = useState<Thread['status']>('regular');
    const [isLoading, setIsLoading] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);
    const [editingComposers, setEditingComposers] = useState<string[]>([]);
    const [capabilities, setCapabilities] = useState<ThreadCapabilities>({
        // switchToBranch: false,
        // switchBranchDuringRun: false,
        // edit: false,
        // reload: false,
        // cancel: false,
        // unstable_copy: false,
        // speech: false,
        // dictation: false,
        // attachments: false,
        // feedback: false,
        switchToBranch: true,
        switchBranchDuringRun: true,
        edit: true,
        reload: true,
        cancel: true,
        unstable_copy: true,
        speech: true,
        dictation: true,
        attachments: true,
        feedback: true,
    })
    const [dataStream, setDataStream] = useState<DataUIPart<CustomUIDataTypes>[]>(
        []
    );

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

    const send = useCallback(({ clearText = true, prompt, files }: { clearText?: boolean, prompt?: string, files?: FileList | FileUIPart[] }) => {
        const text = storeRef.current!.getState().composerStore!.getState().text
        const finalPrompt = prompt ?? text
        if (!finalPrompt && (!files || (Array.isArray(files) ? files.length === 0 : files.length === 0))) {
            throw new Error('No prompt passed.')
        }
        sendMessage({ text: finalPrompt ?? '', files })
        if (clearText) {
            storeRef.current!.getState().composerStore!.getState()!.setText('')
        }
    }, [sendMessage])

    const sendEdit = useCallback((messageId: string, text: string, files?: FileList | FileUIPart[]): void => {
        const currentMessages = storeRef.current!.getState().messages;
        const editIndex = currentMessages.findIndex(m => m.id === messageId);
        if (editIndex === -1) throw new Error('Message not found for edit');

        // Truncate to the parent (everything before the edited message).
        // The old message stays in the repository, creating a branch.
        const truncated = currentMessages.slice(0, editIndex);
        setMessages(truncated);

        // Send the new text — the SDK appends it after the truncated messages
        sendMessage({ text, files });

        // Close the edit composer
        setEditingComposers((prev) => prev.filter((id) => id !== messageId));
    }, [setMessages, sendMessage, setEditingComposers])

    const beginEdit = useCallback((messageId: string) => {
        setEditingComposers((prev) => [...prev, messageId])
    }, [setEditingComposers])

    const stopEdit = useCallback((messageId: string) => {
        setEditingComposers((prev) => prev.filter((id) => id !== messageId))
    }, [setEditingComposers])

    // --- Message branching repository ---
    type ThreadMessage = Thread['messages'][0];
    const repositoryRef = useRef(new MessageRepository<ThreadMessage>());

    // Sync repository with SDK messages (additive only — never delete,
    // so branches are preserved when the SDK temporarily removes messages
    // during regeneration or editing).
    useLayoutEffect(() => {
        const repo = repositoryRef.current;
        for (let i = 0; i < messages.length; i++) {
            const parentId = i > 0 ? messages[i - 1]!.id : null;
            repo.addOrUpdateMessage(parentId, messages[i]!);
        }
    }, [messages]);

    const getBranches = useCallback((messageId: string): string[] => {
        return repositoryRef.current.getBranches(messageId);
    }, []);

    const switchToBranchFn = useCallback((messageId: string): void => {
        repositoryRef.current.switchToBranch(messageId);
        setMessages(repositoryRef.current.getMessages() as ThreadMessage[]);
    }, [setMessages]);

    // console.log({ messages })

    useEffect(() => {
        (async function () {
            if (adapters?.thread && activeThreadId) {
                const thread = await adapters.thread.fetch(activeThreadId);
                setTitle(thread.title)
                setStatus(thread.status)
                setMessages(thread.messages)
                setIsLoading(false)
                eventHandler.trigger('thread.initialize', { 'threadId': id })
            }
        })()
    }, [adapters, id, eventHandler])

    const isRunningRef = useRef(false);
    useEffect(() => {
        if (chatStatus === 'streaming') {
            isRunningRef.current = true;
            console.warn('thread.runStart')
            eventHandler.trigger('thread.runStart', { 'threadId': id })
        } else if (isRunningRef.current && chatStatus === 'ready') {
            isRunningRef.current = false;
            eventHandler.trigger('thread.runEnd', { 'threadId': id })
        }
    }, [eventHandler, id, chatStatus])

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
            editingComposers,
            chatStatus,
            dataStream,
            setDataStream,
            beginEdit,
            stopEdit,
            // composerText,
            // setComposerText,
            send,
            sendEdit,
            getBranches,
            switchToBranch: switchToBranchFn,
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
            editingComposers,
            dataStream,
            setDataStream,
            beginEdit,
            stopEdit,
            // composerText,
            // setComposerText,
            send,
            sendEdit,
            getBranches,
            switchToBranch: switchToBranchFn,
            ...other
        });
    });

    return <ThreadStoreCtx.Provider value={storeRef.current}>
        <AttachmentsProvider attachments={[]} removeAttachment={_noopRemoveAttachment}>
            {children}
        </AttachmentsProvider>
    </ThreadStoreCtx.Provider>;
};
