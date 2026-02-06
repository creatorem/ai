"use client";

import { useRef, useEffect, useState } from "react";
import { ExportedMessageRepository, MessageRepository } from "../../../utils/message-repository";
import { ThreadMessage } from "../../../types";
import { MessageFormatAdapter, MessageFormatRepository } from "../adapters/thread-history";
import { useAiChat, useAiChatShallow } from "../../../store";
import { getExternalStoreMessages } from "../../../utils/get-external-store-message";
import type { ThreadHistoryAdapter } from "../../../runtime/types";

export const toExportedMessageRepository = <TMessage,>(
  toThreadMessages: (messages: TMessage[]) => ThreadMessage[],
  messages: MessageFormatRepository<TMessage>,
): ExportedMessageRepository => {
  return {
    headId: messages.headId!,
    messages: messages.messages.map((m) => {
      const message = toThreadMessages([m.message])[0]!;
      return {
        ...m,
        message,
      };
    }),
  };
};

export const useExternalHistory = <TMessage,>(
  historyAdapter: ThreadHistoryAdapter | undefined,
  toThreadMessages: (messages: TMessage[]) => ThreadMessage[],
  storageFormatAdapter: MessageFormatAdapter<TMessage, any>,
  onSetMessages: (messages: TMessage[]) => void,
) => {
  const loadedRef = useRef(false);

  const optionalThreadListItem = useAiChatShallow(({threadListItem}) => threadListItem);
  const threadMethods = useAiChat(({thread}) => thread.methods);

  const [isLoading, setIsLoading] = useState(false);

  const historyIds = useRef(new Set<string>());

  const onSetMessagesRef = useRef<typeof onSetMessages>(() => onSetMessages);
  useEffect(() => {
    onSetMessagesRef.current = onSetMessages;
  });

  // Load messages from history adapter on mount
  useEffect(() => {
    if (!historyAdapter || loadedRef.current) return;

    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const repo = await historyAdapter
          .withFormat?.(storageFormatAdapter)
          .load();
        if (repo && repo.messages.length > 0) {
          const converted = toExportedMessageRepository(toThreadMessages, repo);
          threadMethods.import(converted);

          const tempRepo = new MessageRepository();
          tempRepo.import(converted);
          const messages = tempRepo.getMessages();

          onSetMessagesRef.current(
            messages.map(getExternalStoreMessages<TMessage>).flat(),
          );

          historyIds.current = new Set(
            converted.messages.map((m) => m.message.id),
          );
        }
      } catch (error) {
        console.error("Failed to load message history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!loadedRef.current) {
      loadedRef.current = true;
      // Access remoteId directly from the state (not via methods.getState())
      if (!optionalThreadListItem.remoteId) {
        setIsLoading(false);
        return;
      }

      loadHistory();
    }
  }, [
    historyAdapter,
    storageFormatAdapter,
    toThreadMessages,
    threadMethods,
    optionalThreadListItem,
  ]);

  // Subscribe to thread changes to persist new messages
  useEffect(() => {
    if (!historyAdapter) return;

    let prevMessagesLength = 0;
    let prevIsRunning = false;

    // Use Zustand's subscribe to watch for thread changes
    const unsubscribe = useAiChat.subscribe((state) => {
      const { messages, isRunning } = state.thread;

      // Skip if still running or no meaningful change
      if (isRunning) {
        prevIsRunning = isRunning;
        return;
      }

      // Only process if we just finished running or have new messages
      if (!prevIsRunning && messages.length === prevMessagesLength) {
        return;
      }

      prevMessagesLength = messages.length;
      prevIsRunning = isRunning;

      for (let i = 0; i < messages.length; i++) {
        const message = messages[i]!;
        if (
          message.status === undefined ||
          message.status.type === "complete" ||
          message.status.type === "incomplete"
        ) {
          if (historyIds.current.has(message.id)) continue;
          historyIds.current.add(message.id);

          const parentId = i > 0 ? messages[i - 1]!.id : null;
          historyAdapter.withFormat?.(storageFormatAdapter).append({
            parentId,
            message: getExternalStoreMessages<TMessage>(message)[0]!,
          });
        }
      }
    });

    return unsubscribe;
  }, [historyAdapter, storageFormatAdapter]);

  return isLoading;
};
