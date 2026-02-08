'use client';

import React, { useLayoutEffect, useRef } from "react";
import type { UIMessage } from "ai";
import { createStore, useStore, type StoreApi } from 'zustand';
import { Message, MessageStatus } from "../../types/entities";
import { useThread, useThreadStore } from "../thread/thread-root";

type MessageMethods = {
  reload(): void;
  speak(): void;
  stopSpeaking(): void;
  submitFeedback(feedback: { type: "positive" | "negative" }): void;
  switchToBranch(options: { position?: "previous" | "next"; branchId?: string }): void;
  getCopyText(): string;
  setIsCopied(value: boolean): void;
  setIsHovering(value: boolean): void;
};

type MessageCtxType = Message & MessageMethods;

const MessageStoreCtx = React.createContext<StoreApi<MessageCtxType> | null>(null);

export function useMessage(): MessageCtxType;
export function useMessage<T>(selector: (state: MessageCtxType) => T): T;
export function useMessage<T>(selector?: (state: MessageCtxType) => T) {
    const store = React.useContext(MessageStoreCtx);
    if (!store) throw new Error('useMessage must be used within a MessagePrimitiveRoot.');
    return useStore(store, selector as any);
}

export function useMessageStore(): StoreApi<MessageCtxType> {
    const store = React.useContext(MessageStoreCtx);
    if (!store) throw new Error('useMessage must be used within a MessagePrimitiveRoot.');
    return store;
}

function _getMessageText(message: UIMessage): string {
  return message.parts
      .filter((part): part is Extract<typeof part, { type: "text" }> => part.type === "text")
      .map((part) => part.text)
      .join("\n");
}

const _COMPLETE_STATUS: MessageStatus = Object.freeze({
  type: "complete" as const,
  reason: "unknown" as const,
});

const _RUNNING_STATUS: MessageStatus = Object.freeze({
  type: "running" as const,
});

function _deriveMessageStatus(
  message: UIMessage,
  isLast: boolean,
  chatStatus: string,
): MessageStatus {
  if (message.role !== "assistant") return _COMPLETE_STATUS;
  if (isLast && (chatStatus === "streaming" || chatStatus === "submitted")) {
      return _RUNNING_STATUS;
  }
  return _COMPLETE_STATUS;
}

export function MessageByIndexProvider({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const message = useThread(s => s.messages[index]!);
  const chatStatus = useThread(s => s.chatStatus);
  const parentId = useThread(s => index > 0 ? s.messages[index - 1]?.id ?? null : null);
  const isLast = useThread(s => index === s.messages.length - 1);
  const threadStore = useThreadStore();

  // Derived state
  const status = _deriveMessageStatus(message, isLast, chatStatus);
  const metadata = {
      submittedFeedback: (message.metadata as Record<string, unknown> | undefined)?.submittedFeedback as
          | { readonly type: "positive" | "negative" }
          | undefined,
      custom: (message.metadata as Record<string, unknown> | undefined) ?? {},
  };

  const storeRef = useRef<StoreApi<MessageCtxType> | null>(null);
  if (storeRef.current === null) {
      storeRef.current = createStore<MessageCtxType>(() => ({
          id: message.id,
          role: message.role,
          parts: message.parts,
          metadata,
          status,
          attachments: [],
          speech: undefined,
          parentId,
          isLast,
          branchNumber: 1,
          branchCount: 1,
          isCopied: false,
          isHovering: false,
          index,
          reload: () => {
              const state = storeRef.current!.getState();
              if (state.role !== "assistant") {
                  throw new Error("Can only reload assistant messages");
              }
              threadStore.getState().regenerate({ messageId: state.id });
          },
          speak: () => {
              // TODO: requires SpeechSynthesisAdapter
          },
          stopSpeaking: () => {
              // TODO: requires SpeechSynthesisAdapter
          },
          submitFeedback: (_feedback: { type: "positive" | "negative" }) => {
              // TODO: requires feedback adapter
          },
          switchToBranch: (_options: { position?: "previous" | "next"; branchId?: string }) => {
              // TODO: requires branch support
          },
          getCopyText: () => {
              const state = storeRef.current!.getState();
              return _getMessageText(state as unknown as UIMessage);
          },
          setIsCopied: (value: boolean) => {
              storeRef.current!.setState({ isCopied: value });
          },
          setIsHovering: (value: boolean) => {
              storeRef.current!.setState({ isHovering: value });
          },
      }));
  }

  // Sync React-derived state after render (isCopied/isHovering are store-internal, not synced)
  useLayoutEffect(() => {
      storeRef.current!.setState({
          id: message.id,
          role: message.role,
          parts: message.parts,
          metadata,
          status,
          attachments: [],
          speech: undefined,
          parentId,
          isLast,
          branchNumber: 1,
          branchCount: 1,
          index,
      });
  });

  return <MessageStoreCtx.Provider value={storeRef.current}>
      {children}
  </MessageStoreCtx.Provider>;
};