"use client";

import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "../../utils/create-action-button";
import { useAui } from "@creatorem/ai-assistant-store";
import { useCallback } from "react";

const useThreadListItemArchive = () => {
  const aui = useAui();
  return useCallback(() => {
    aui.threadListItem().archive();
  }, [aui]);
};

export namespace ThreadListItemPrimitiveArchive {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<typeof useThreadListItemArchive>;
}

export const ThreadListItemPrimitiveArchive = createActionButton(
  "ThreadListItemPrimitive.Archive",
  useThreadListItemArchive,
);
