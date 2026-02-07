'use client';

import { useChat } from "@ai-sdk/react";
import { DataUIPart, DefaultChatTransport, generateId } from "ai";
import React, { useContext, useEffect, useState } from "react";
import { Thread, ThreadCapabilities } from '../../types/entities';
import { useAiContext, useThreads } from "../ai-provider";
import { createContextHook } from "../../utils/create-context-hook";

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

type ThreadCtxType = Thread & Omit<ReturnType<typeof useChat<Thread['messages'][0]>>, 'status' | 'setMessages'> & {
    dataStream: DataUIPart<CustomUIDataTypes>[];
    setDataStream: React.Dispatch<
        React.SetStateAction<DataUIPart<CustomUIDataTypes>[]>
    >;
    chatStatus: ReturnType<typeof useChat<Thread['messages'][0]>>['status']
}

const ThreadCtx = React.createContext<ThreadCtxType | null>(null);

export const useThread = createContextHook(
    ThreadCtx,
    "ThreadCtx.Provider",
);

export function ThreadPrimitiveRoot({ children, ...value }: { children: React.ReactNode }) {
    const { adapters, chatOptions } = useAiContext();
    const { activeThreadId } = useThreads();
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

    const {
        id,
        messages,
        setMessages,
        status: chatStatus,
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

    return <ThreadCtx.Provider value={{
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
        ...other
    }}>
        {children}
    </ThreadCtx.Provider>;
};
