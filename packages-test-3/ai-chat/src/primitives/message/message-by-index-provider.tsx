'use client';

import React, { useCallback, useContext, useMemo, useRef, useState } from "react";
import type { UIMessage } from "ai";
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

const MessageCtx = React.createContext<MessageCtxType | null>(null);

export const useMessage = (): MessageCtxType => {
  const ctx = useContext(MessageCtx);
  if (!ctx) {
      throw new Error('useMessage must be used within a MessagePrimitiveRoot.');
  }
  return ctx;
};

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

  // UI state
  const [isCopied, setIsCopiedState] = useState(false);
  const [isHovering, setIsHoveringState] = useState(false);

  // Refs to avoid stale closures
  const _messageRef = useRef(message);
  _messageRef.current = message;

  // Derived state
  const status = _deriveMessageStatus(message, isLast, chatStatus);
  const metadata = {
      submittedFeedback: (message.metadata as Record<string, unknown> | undefined)?.submittedFeedback as
          | { readonly type: "positive" | "negative" }
          | undefined,
      custom: (message.metadata as Record<string, unknown> | undefined) ?? {},
  };

  // Methods

  const reload = useCallback((): void => {
      if (_messageRef.current.role !== "assistant") {
          throw new Error("Can only reload assistant messages");
      }
      threadStore.getState().regenerate({ messageId: _messageRef.current.id });
  }, []);

  const speak = useCallback((): void => {
      // TODO: requires SpeechSynthesisAdapter
  }, []);

  const stopSpeaking = useCallback((): void => {
      // TODO: requires SpeechSynthesisAdapter
  }, []);

  const submitFeedback = useCallback((_feedback: { type: "positive" | "negative" }): void => {
      // TODO: requires feedback adapter
  }, []);

  const switchToBranch = useCallback((_options: { position?: "previous" | "next"; branchId?: string }): void => {
      // TODO: requires branch support
  }, []);

  const getCopyText = useCallback((): string => {
      return _getMessageText(_messageRef.current);
  }, []);

  const setIsCopied = useCallback((value: boolean): void => {
      setIsCopiedState(value);
  }, []);

  const setIsHovering = useCallback((value: boolean): void => {
      setIsHoveringState(value);
  }, []);

  // Memoize context value to avoid unnecessary re-renders
  const contextValue = useMemo<MessageCtxType>(() => ({
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
      isCopied,
      isHovering,
      index,
      reload,
      speak,
      stopSpeaking,
      submitFeedback,
      switchToBranch,
      getCopyText,
      setIsCopied,
      setIsHovering,
  }), [
      message, parentId, isLast, status, isCopied, isHovering, index, metadata,
      reload, speak, stopSpeaking, submitFeedback, switchToBranch,
      getCopyText, setIsCopied, setIsHovering,
  ]);

  return <MessageCtx.Provider value={contextValue}>
      {children}
  </MessageCtx.Provider>;
};