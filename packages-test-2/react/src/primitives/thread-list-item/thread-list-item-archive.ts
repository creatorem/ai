"use client";

import { useAiChat } from "@creatorem/ai-store";
import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "../../utils/create-action-button";
import { useCallback } from "react";

const useThreadListItemArchive = () => {
  const threadListItemMethods = useAiChat(({threadListItem})=> threadListItem.methods)
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
