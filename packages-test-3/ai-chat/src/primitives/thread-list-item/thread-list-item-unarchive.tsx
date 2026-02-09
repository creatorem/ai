'use client';

import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "../../utils/create-action-button";
import { useThreadListItem } from "./thread-list-item-by-index-provider";
import { useCallback } from "react";

const useThreadListItemUnarchive = () => {
  const threadListItemMethods = useThreadListItem((thread) => thread.methods);
  return useCallback(() => {
    threadListItemMethods.unarchive();
  }, [threadListItemMethods]);
};

export namespace ThreadListItemPrimitiveUnarchive {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<typeof useThreadListItemUnarchive>;
}

export const ThreadListItemPrimitiveUnarchive = createActionButton(
  "ThreadListItemPrimitive.Unarchive",
  useThreadListItemUnarchive,
);
