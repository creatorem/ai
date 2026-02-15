"use client";

import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "../../utils/create-action-button";
import { useThreadListItem } from "./thread-list-item-by-index-provider";
import { useCallback } from "react";

const useThreadListItemDelete = () => {
  const threadListItemMethods = useThreadListItem((thread) => thread.methods);
  return useCallback(() => {
    threadListItemMethods.delete();
  }, [threadListItemMethods]);
};

export namespace ThreadListItemPrimitiveDelete {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<typeof useThreadListItemDelete>;
}

export const ThreadListItemPrimitiveDelete = createActionButton(
  "ThreadListItemPrimitive.Delete",
  useThreadListItemDelete,
);
