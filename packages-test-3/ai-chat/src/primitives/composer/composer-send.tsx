"use client";

import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "../../utils/create-action-button";
import { useCallback, useMemo } from "react";
import { useThread } from "../thread/thread-root";
import { useComposer } from "./composer-root";

export const useComposerSend = () => {
  const { isEditing, isEmpty } = useComposer();
  const { isRunning, sendMessage } = useThread()
  const disabled = useMemo(() => isRunning || !isEditing || isEmpty, [isRunning, isEditing, isEmpty])

  const callback = useCallback(() => {
    sendMessage();
  }, [sendMessage]);

  if (disabled) return null;
  return callback;
};

export namespace ComposerPrimitiveSend {
  export type Element = ActionButtonElement;
  /**
   * Props for the ComposerPrimitive.Send component.
   * Inherits all button element props and action button functionality.
   */
  export type Props = ActionButtonProps<typeof useComposerSend>;
}

/**
 * A button component that sends the current message in the composer.
 *
 * This component automatically handles the send functionality and is disabled
 * when sending is not available (e.g., when the thread is running, the composer
 * is empty, or not in editing mode).
 *
 * @example
 * ```tsx
 * <ComposerPrimitive.Send>
 *   Send Message
 * </ComposerPrimitive.Send>
 * ```
 */
export const ComposerPrimitiveSend = createActionButton(
  "ComposerPrimitive.Send",
  useComposerSend,
);
