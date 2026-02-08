"use client";

import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "../../utils/create-action-button";
import { useCallback, useMemo } from "react";
import { useThread } from "../thread/thread-root";
import { useMessage, useMessageStore } from "../message/message-by-index-provider";

const useBranchPickerNext = () => {
  const isRunning = useThread(s => s.isRunning);
  const switchBranchDuringRun = useThread(s => s.capabilities.switchBranchDuringRun);
  const branchNumber = useMessage(s => s.branchNumber);
  const branchCount = useMessage(s => s.branchCount);
  const messageStore = useMessageStore();

  const disabled = useMemo(() => {
    // Disabled if no next branch
    if (branchNumber >= branchCount) return true;

    // Disabled if running and capability not supported
    if (isRunning && !switchBranchDuringRun) {
      return true;
    }

    return false;
  }, [isRunning, switchBranchDuringRun, branchNumber, branchCount]);

  const callback = useCallback(() => {
    messageStore.getState().switchToBranch({ position: "next" });
  }, [messageStore]);

  if (disabled) return null;
  return callback;
};

export namespace BranchPickerPrimitiveNext {
  export type Element = ActionButtonElement;
  /**
   * Props for the BranchPickerPrimitive.Next component.
   * Inherits all button element props and action button functionality.
   */
  export type Props = ActionButtonProps<typeof useBranchPickerNext>;
}

/**
 * A button component that navigates to the next branch in the message tree.
 *
 * This component automatically handles switching to the next available branch
 * and is disabled when there are no more branches to navigate to.
 *
 * @example
 * ```tsx
 * <BranchPickerPrimitive.Next>
 *   Next →
 * </BranchPickerPrimitive.Next>
 * ```
 */
export const BranchPickerPrimitiveNext = createActionButton(
  "BranchPickerPrimitive.Next",
  useBranchPickerNext,
);
