"use client";

import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "../../utils/create-action-button";
import { useThreadListItem } from "./thread-list-item-by-index-provider";
import { useCallback } from "react";

const useThreadListItemTrigger = () => {
  const threadListItemMethods = useThreadListItem((thread) => thread.methods);

  return useCallback(() => {
    threadListItemMethods.switchToThread();
  }, [threadListItemMethods]);
};

export namespace ThreadListItemPrimitiveTrigger {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<typeof useThreadListItemTrigger>;
}

export const ThreadListItemPrimitiveTrigger = createActionButton(
  "ThreadListItemPrimitive.Trigger",
  useThreadListItemTrigger,
);
