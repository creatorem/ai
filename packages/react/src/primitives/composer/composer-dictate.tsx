"use client";

import { useCallback } from "react";
import { useAiChat, useAiChatShallow } from "@creatorem/ai-store";
import type {
  ActionButtonElement,
  ActionButtonProps,
} from "../../utils/create-action-button";
import { createActionButton } from "../../utils/create-action-button";

const useComposerDictate = () => {
  const composerMethods = useAiChat(({composer}) => composer.methods);
  const disabled = useAiChatShallow(
    ({ thread, composer }) =>
      composer.dictation != null ||
      !thread.capabilities.dictation ||
      !composer.isEditing,
  );

  const callback = useCallback(() => {
    composerMethods.startDictation();
  }, [composerMethods]);

  if (disabled) return null;
  return callback;
};

export namespace ComposerPrimitiveDictate {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<typeof useComposerDictate>;
}

/**
 * A button that starts dictation to convert voice to text.
 *
 * Requires a DictationAdapter to be configured in the runtime.
 *
 * @example
 * ```tsx
 * <ComposerPrimitive.Dictate>
 *   <MicIcon />
 * </ComposerPrimitive.Dictate>
 * ```
 */
export const ComposerPrimitiveDictate = createActionButton(
  "ComposerPrimitive.Dictate",
  useComposerDictate,
);
