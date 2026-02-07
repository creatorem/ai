"use client";

import { useCallback } from "react";
import { ActionButtonElement, ActionButtonProps, createActionButton } from "../../utils/create-action-button";
import { useComposer } from "./composer-root";
import { useThread } from "../thread/thread-root";

const useComposerCancel = () => {
  const {stop} = useThread()
  const { canCancel } = useComposer()

  const callback = useCallback(() => {
    stop();
  }, [canCancel, stop]);

  if (!canCancel) return null;
  return callback;
};

export namespace ComposerPrimitiveCancel {
  export type Element = ActionButtonElement;
  /**
   * Props for the ComposerPrimitive.Cancel component.
   * Inherits all button element props and action button functionality.
   */
  export type Props = ActionButtonProps<typeof useComposerCancel>;
}

/**
 * A button component that cancels the current message composition.
 *
 * This component automatically handles the cancel functionality and is disabled
 * when canceling is not available.
 *
 * @example
 * ```tsx
 * <ComposerPrimitive.Cancel>
 *   Cancel
 * </ComposerPrimitive.Cancel>
 * ```
 */
export const ComposerPrimitiveCancel = createActionButton(
  "ComposerPrimitive.Cancel",
  useComposerCancel,
);
