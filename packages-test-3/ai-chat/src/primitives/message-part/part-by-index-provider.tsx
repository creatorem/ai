"use client";

import React, { useLayoutEffect, useRef } from "react";
import { createStore, useStore, type StoreApi } from 'zustand';
import { PartState } from "../../types/entities";
import { useMessage, useMessageStore } from "../message/message-by-index-provider";
import { useThreadStore } from "../thread/thread-root";

type PartMethods = {
    /**
     * Add tool result to a tool call message part that has no tool result yet.
     * This is useful when you are collecting a tool result via user input ("human tool calls").
     */
    addToolResult(result: unknown): void;

    /**
     * Resume a tool call that is waiting for human input with a payload.
     */
    resumeToolCall(payload: unknown): void;
};

type PartCtxType = PartState & PartMethods;

const PartStoreCtx = React.createContext<StoreApi<PartCtxType> | null>(null);

export function usePart(): PartCtxType;
export function usePart<T>(selector: (state: PartCtxType) => T): T;
export function usePart<T>(selector?: (state: PartCtxType) => T) {
    const store = React.useContext(PartStoreCtx);
    if (!store) throw new Error('usePart must be used within a PartByIndexProvider.');
    return useStore(store, selector as any);
}

export function usePartStore(): StoreApi<PartCtxType> {
    const store = React.useContext(PartStoreCtx);
    if (!store) throw new Error('usePart must be used within a PartByIndexProvider.');
    return store;
}

const _COMPLETE_STATUS: PartState['status'] = Object.freeze({
    type: "complete" as const,
});

const _RUNNING_STATUS: PartState['status'] = Object.freeze({
    type: "running" as const,
});

function _derivePartStatus(
    part: PartState['type'] extends string ? PartState : never,
    partIndex: number,
    totalParts: number,
    messageStatus: { type: string },
): PartState['status'] {
    // Text parts: check the streaming state
    if (part.type === "text" && 'state' in part && part.state === "streaming") {
        return _RUNNING_STATUS;
    }

    // Reasoning parts: check the streaming state
    if (part.type === "reasoning" && 'state' in part && part.state === "streaming") {
        return _RUNNING_STATUS;
    }

    // Tool invocation parts: check the invocation state
    if (part.type === "tool-invocation" && 'toolInvocation' in part) {
        const state = (part.toolInvocation as { state?: string }).state;
        if (state === "partial-call" || state === "call") {
            return _RUNNING_STATUS;
        }
    }

    // Last part of a running message inherits the running status
    const isLastPart = partIndex === Math.max(0, totalParts - 1);
    if (isLastPart && messageStatus.type === "running") {
        return _RUNNING_STATUS;
    }

    return _COMPLETE_STATUS;
}

export const PartByIndexProvider: React.FC<
    React.PropsWithChildren<{ index: number }>
> = ({ index, children }) => {
    const parts = useMessage(s => s.parts);
    const messageStatus = useMessage(s => s.status);
    const messageStore = useMessageStore();
    const threadStore = useThreadStore();
    const part = parts[index]!;

    // Derived status
    const status = _derivePartStatus(
        part as any,
        index,
        parts.length,
        messageStatus,
    );

    const storeRef = useRef<StoreApi<PartCtxType> | null>(null);
    if (storeRef.current === null) {
        storeRef.current = createStore<PartCtxType>(() => ({
            ...part,
            status,
            addToolResult: (result: unknown) => {
                const currentPart = messageStore.getState().parts[index];
                if (!currentPart || currentPart.type !== "tool-invocation") {
                    throw new Error("Tried to add tool result to non-tool message part");
                }

                const toolCallId = (currentPart as { toolInvocation: { toolCallId: string } }).toolInvocation.toolCallId;
                threadStore.getState().addToolResult({ toolCallId, result });
            },
            resumeToolCall: (_payload: unknown) => {
                // TODO: requires thread runtime support for resuming tool calls
            },
        }));
    }

    // Sync React-derived state after render
    useLayoutEffect(() => {
        storeRef.current!.setState({
            ...part,
            status,
        });
    });

    return <PartStoreCtx.Provider value={storeRef.current}>
        {children}
    </PartStoreCtx.Provider>;
};
