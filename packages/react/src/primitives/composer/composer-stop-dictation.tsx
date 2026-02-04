"use client";

import { useCallback } from "react";
import { useAui } from "@creatorem/ai-store";
import type {
  ActionButtonElement,
  ActionButtonProps,
} from "../../utils/create-action-button";
import { createActionButton } from "../../utils/create-action-button";
import { useAuiState } from "@creatorem/ai-store";

const useComposerStopDictation = () => {
  const aui = useAui();
  const isDictating = useAuiState(({ composer }) => composer.dictation != null);

  const callback = useCallback(() => {
    aui.composer().stopDictation();
  }, [aui]);

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
