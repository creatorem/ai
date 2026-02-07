'use client';

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, generateId, type UIMessage } from "ai";
// import { useChat } from "@ai-sdk/react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Thread, ThreadCapabilities } from '../../types/entities';
import { useAiContext, useThreads } from "../ai-provider";


export type ThreadMethods = {
  };

type ThreadCtxType = Thread & Omit<ReturnType<typeof useChat<UIMessage>>, 'status' | 'setMessages'> & {
    chatStatus: ReturnType<typeof useChat<UIMessage>>['status']
}

const ThreadCtx = React.createContext<ThreadCtxType | null>(null);

export const useThread = (): ThreadCtxType => {
    const ctx = useContext(ThreadCtx);
    if (!ctx) {
        throw new Error('useThread must be used within a ThreadPrimitiveRoot.');
    }
    return ctx;
};


// function CallChatSdk() {


//     return null
// };

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

    const {
        id,
        messages,
        setMessages,
        status: chatStatus,
        ...other
    } = useChat<UIMessage>({
        generateId: generateId,
        sendAutomaticallyWhen: ({ messages: currentMessages }) => {
            const lastMessage = currentMessages.at(-1);
            const shouldContinue =
                lastMessage?.parts?.some(
                    (part) =>
                        "state" in part &&
                        part.state === "approval-responded" &&
                        "approval" in part &&
                        (part.approval as { approved?: boolean })?.approved === true
                ) ?? false;
            return shouldContinue;
        },
        transport: new DefaultChatTransport({
            api: "/api/chat",
            // fetch: fetchWithErrorHandlers,
            prepareSendMessagesRequest(request) {
                const lastMessage = request.messages.at(-1);
                const isToolApprovalContinuation =
                    lastMessage?.role !== "user" ||
                    request.messages.some((msg) =>
                        msg.parts?.some((part) => {
                            const state = (part as { state?: string }).state;
                            return (
                                state === "approval-responded" || state === "output-denied"
                            );
                        })
                    );

                return {
                    body: {
                        id: request.id,
                        ...(isToolApprovalContinuation
                            ? { messages: request.messages }
                            : { message: lastMessage }),
                        // selectedChatModel: currentModelIdRef.current,
                        // selectedVisibilityType: visibilityType,
                        ...request.body,
                    },
                };
            },
        }),
        ...chatOptions,
        id: activeThreadId || undefined,
    });

    // const {} = other
    // other['']

    useEffect(() => {
        (async function () {
            console.log( 'use effect' )
            if (adapters?.thread && activeThreadId) {
                console.log( 'use adapter' )
                const thread = await adapters.thread.fetch(activeThreadId);
                setTitle(thread.title)
                setStatus(thread.status)
                setMessages(thread.messages)
                setIsLoading(false)
            }
            // setIsInitialized(true)
        })()
    }, [adapters, id])

    return <ThreadCtx.Provider value={{
        id,
        isEmpty: false,
        isDisabled,
        isLoading,
        isRunning,
        title,
        status,
        messages,
        capabilities,
        chatStatus,
        ...other
    }}>
        {/* {isInitialized && <CallChatSdk />} */}
        {children}
    </ThreadCtx.Provider>;
};
