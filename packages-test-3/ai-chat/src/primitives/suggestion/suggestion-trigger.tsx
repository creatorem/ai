"use client";

import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "../../utils/create-action-button";
import { useCallback } from "react";
import { useSuggestion } from "./suggestion-by-index-provider";
import { useThread, useThreadStore } from "../thread/thread-root";

const useSuggestionTrigger = ({
  send,
  clearComposer = true,
}: {
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
  // const aui = useAui();
  const disabled = useThread(s => s.isDisabled);
  const threadStore = useThreadStore();
  const prompt = useSuggestion(s => s.prompt);

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

export namespace SuggestionPrimitiveTrigger {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<typeof useSuggestionTrigger>;
}

/**
 * A button that triggers the suggestion action (send or insert into composer).
 *
 * @example
 * ```tsx
 * <SuggestionPrimitive.Trigger send>
 *   Click me
 * </SuggestionPrimitive.Trigger>
 * ```
 */
export const SuggestionPrimitiveTrigger = createActionButton(
  "SuggestionPrimitive.Trigger",
  useSuggestionTrigger,
  ["send", "clearComposer"],
);
