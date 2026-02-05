"use client";

import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "../../utils/create-action-button";
import { useCallback } from "react";
import { useAiChat, useAiChatShallow } from "@creatorem/ai-store";

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
  const composerMethods = useAiChat(({composer}) => composer.methods);
  const threadMethods = useAiChat(({thread}) => thread.methods);

  const disabled = useAiChat(({ thread }) => thread.isDisabled);
  const prompt = useAiChat(({ suggestion }) => suggestion?.prompt);

  const resolvedSend = send ?? false;

  const callback = useCallback(() => {
    const isRunning = threadMethods.getState().isRunning;

    if (resolvedSend && !isRunning) {
      threadMethods.append(prompt);
      if (clearComposer) {
        composerMethods.setText("");
      }
    } else {
      if (clearComposer) {
        composerMethods.setText(prompt);
      } else {
        const currentText = composerMethods.getState().text;
        composerMethods.setText(currentText.trim() ? `${currentText} ${prompt}` : prompt);
      }
    }
  }, [composerMethods, threadMethods, resolvedSend, clearComposer, prompt]);

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
