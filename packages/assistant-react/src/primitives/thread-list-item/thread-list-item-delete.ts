"use client";

import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "../../utils/create-action-button";
import { useAui } from "@creatorem/ai-store";
import { useCallback } from "react";

const useThreadListItemDelete = () => {
  const aui = useAui();
  return useCallback(() => {
    aui.threadListItem().delete();
  }, [aui]);
};

export namespace ThreadListItemPrimitiveDelete {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<typeof useThreadListItemDelete>;
}

export const ThreadListItemPrimitiveDelete = createActionButton(
  "ThreadListItemPrimitive.Delete",
  useThreadListItemDelete,
);
