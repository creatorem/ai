"use client";

import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "../../utils/create-action-button";
import { useCallback } from "react";
import { useThread, useThreadStore } from "./thread-root";
// import { useAuiState, useAui } from "@creatorem/ai-assistant-store";

const useThreadSuggestion = ({
  prompt,
  send,
  clearComposer = true,
}: {
  /** The suggestion prompt. */
  prompt: string;

  /**
   * When true, automatically sends the message.
   * When false, replaces or appends the composer text with the suggestion - depending on the value of `clearComposer`.
   */
  send?: boolean | undefined;

  /**
   * Whether to clear the composer after sending.
   * When send is set to false, determines if composer text is replaced with suggestion (true, default),
   * or if it's appended to the composer text (false).
   *
   * @default true
   */
  clearComposer?: boolean | undefined;
}) => {
  const disabled = useThread(s => s.isDisabled);
  const threadStore = useThreadStore();

  const resolvedSend = send ?? false;

  const callback = useCallback(() => {
    const { isRunning, composerStore, send: sendThread } = threadStore.getState();
    const composerText = composerStore!.getState().text

    if (resolvedSend && !isRunning) {
      sendThread({ clearText: clearComposer, prompt })
    } else {
      if (clearComposer) {
        composerStore!.getState().setText(prompt);
      } else {
        composerStore!.getState().setText(composerText.trim() ? `${composerText} ${prompt}` : prompt);
      }
    }
  }, [threadStore, resolvedSend, clearComposer, prompt]);

  if (disabled) return null;
  return callback;
};

export namespace ThreadPrimitiveSuggestion {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<typeof useThreadSuggestion>;
}

export const ThreadPrimitiveSuggestion = createActionButton(
  "ThreadPrimitive.Suggestion",
  useThreadSuggestion,
  ["prompt", "send", "clearComposer"],
);
