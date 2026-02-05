"use client";

import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "../../utils/create-action-button";
import { useAiChat } from "@creatorem/ai-store";
import { useCallback } from "react";

const useThreadListItemDelete = () => {
  const threadListItemMethods = useAiChat(({threadListItem})=> threadListItem.methods)
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
