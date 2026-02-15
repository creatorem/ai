"use client";

import { useThreadListItem } from "./thread-list-item-by-index-provider";
import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "../../utils/create-action-button";
import { useCallback } from "react";

const useThreadListItemArchive = () => {
  const threadListItemMethods = useThreadListItem((thread) => thread.methods);
  return useCallback(() => {
    threadListItemMethods.archive();
  }, [threadListItemMethods]);
};

export namespace ThreadListItemPrimitiveArchive {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<typeof useThreadListItemArchive>;
}

export const ThreadListItemPrimitiveArchive = createActionButton(
  "ThreadListItemPrimitive.Archive",
  useThreadListItemArchive,
);
