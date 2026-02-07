"use client";

import { useCallback } from "react";
import { useAiChat, useAiChatShallow } from "@creatorem/ai-store";
import type {
  ActionButtonElement,
  ActionButtonProps,
} from "../../utils/create-action-button";
import { createActionButton } from "../../utils/create-action-button";

const useComposerStopDictation = () => {
  const isDictating = useAiChatShallow(({ composer }) => composer.dictation != null);
  const composerMethods = useAiChat(({composer}) => composer.methods);


  const callback = useCallback(() => {
    composerMethods.stopDictation();
  }, [composerMethods]);

  if (!isDictating) return null;
  return callback;
};

export namespace ComposerPrimitiveStopDictation {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<typeof useComposerStopDictation>;
}

/**
 * A button that stops the current dictation session.
 *
 * Only rendered when dictation is active.
 *
 * @example
 * ```tsx
 * <ComposerPrimitive.StopDictation>
 *   <StopIcon />
 * </ComposerPrimitive.StopDictation>
 * ```
 */
export const ComposerPrimitiveStopDictation = createActionButton(
  "ComposerPrimitive.StopDictation",
  useComposerStopDictation,
);
