"use client";

import { ActionButtonElement, ActionButtonProps, createActionButton } from "../../utils/create-action-button";
import { useMessage } from "../message/message-by-index-provider";
import { useCallback } from "react";
import { useThread } from "../thread";

const useMessageComposerCancel = () => {
  const { id } = useMessage();
  const { stopEdit, editingComposers } = useThread()
  const disabled = !editingComposers.includes(id);

  const callback = useCallback(() => {
    stopEdit(id);
  }, [stopEdit, id]);

  if (disabled) return null;
  return callback;
};

export namespace ActionBarPrimitiveCancelEditing {
  export type Element = ActionButtonElement;
  /**
   * Props for the ComposerPrimitive.Cancel component.
   * Inherits all button element props and action button functionality.
   */
  export type Props = ActionButtonProps<typeof useMessageComposerCancel>;
}

/**
 * A button component that cancels the current message composition.
 *
 * This component automatically handles the cancel functionality and is disabled
 * when canceling is not available.
 *
 * @example
 * ```tsx
 * <ActionBarPrimitive.CancelEditing>
 *   Cancel
 * </ActionBarPrimitive.CancelEditing>
 * ```
 */
export const ActionBarPrimitiveCancelEditing = createActionButton(
  "ActionBarPrimitiveCancelEditing",
  useMessageComposerCancel,
);
