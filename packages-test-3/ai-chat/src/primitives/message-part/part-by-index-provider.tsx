"use client";

import React, { useCallback, useContext, useMemo, useRef } from "react";
import { Part, PartStatus } from "../../types/entities";
import { useMessage } from "../message/message-by-index-provider";
import { useThread } from "../thread/thread-root";

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

type PartCtxType = Part & PartMethods;

const PartCtx = React.createContext<PartCtxType | null>(null);

export const usePart = (): PartCtxType => {
    const ctx = useContext(PartCtx);
    if (!ctx) {
        throw new Error('usePart must be used within a PartByIndexProvider.');
    }
    return ctx;
};

const _COMPLETE_STATUS: PartStatus = Object.freeze({
    type: "complete" as const,
});

const _RUNNING_STATUS: PartStatus = Object.freeze({
    type: "running" as const,
});

function _derivePartStatus(
    part: Part['type'] extends string ? Part : never,
    partIndex: number,
    totalParts: number,
    messageStatus: { type: string },
): PartStatus {
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
    const message = useMessage();
    const thread = useThread();
    const part = message.parts[index]!;

    // Refs to avoid stale closures
    const _threadRef = useRef(thread);
    _threadRef.current = thread;
    const _messageRef = useRef(message);
    _messageRef.current = message;

    // Derived status
    const status = _derivePartStatus(
        part as any,
        index,
        message.parts.length,
        message.status,
    );

    // Methods

    const addToolResult = useCallback((result: unknown): void => {
        const currentPart = _messageRef.current.parts[index];
        if (!currentPart || currentPart.type !== "tool-invocation") {
            throw new Error("Tried to add tool result to non-tool message part");
        }

        const toolCallId = (currentPart as { toolInvocation: { toolCallId: string } }).toolInvocation.toolCallId;
        _threadRef.current.addToolResult({ toolCallId, result });
    }, [index]);

    const resumeToolCall = useCallback((_payload: unknown): void => {
        // TODO: requires thread runtime support for resuming tool calls
    }, []);

    // Memoize context value
    const contextValue = useMemo<PartCtxType>(() => ({
        ...part,
        status,
        index,
        addToolResult,
        resumeToolCall,
    }), [part, status, index, addToolResult, resumeToolCall]);

    return <PartCtx.Provider value={contextValue}>
        {children}
    </PartCtx.Provider>;
};
