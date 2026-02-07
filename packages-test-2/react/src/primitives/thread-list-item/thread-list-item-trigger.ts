"use client";

import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "../../utils/create-action-button";
import { useAiChat } from "@creatorem/ai-store";
import { useCallback } from "react";

const useThreadListItemTrigger = () => {
  const threadListItemMethods = useAiChat(({threadListItem})=> threadListItem.methods)

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
