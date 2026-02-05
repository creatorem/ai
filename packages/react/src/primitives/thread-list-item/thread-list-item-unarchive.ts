"use client";

import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "../../utils/create-action-button";
import { useAiChat  } from "@creatorem/ai-store";
import { useCallback } from "react";

const useThreadListItemUnarchive = () => {
  const threadListItemMethods = useAiChat(({threadListItem})=> threadListItem.methods)
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
