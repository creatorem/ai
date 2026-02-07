"use client";

import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "../../utils/create-action-button";
import { useCallback } from "react";
import { useThreadViewport, useThreadViewportStore } from "./thread-viewport-context";

export namespace useThreadScrollToBottom {
  export type Options = {
    behavior?: ScrollBehavior | undefined;
  };
}

const useThreadScrollToBottom = ({
  behavior,
}: useThreadScrollToBottom.Options = {}) => {
  const isAtBottom = useThreadViewport((s) => s.isAtBottom);

  const threadViewportStore = useThreadViewportStore();

  const handleScrollToBottom = useCallback(() => {
    threadViewportStore.getState().scrollToBottom({ behavior });
  }, [threadViewportStore, behavior]);

  if (isAtBottom) return null;
  return handleScrollToBottom;
};

export namespace ThreadPrimitiveScrollToBottom {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<typeof useThreadScrollToBottom>;
}

export const ThreadPrimitiveScrollToBottom = createActionButton(
  "ThreadPrimitive.ScrollToBottom",
  useThreadScrollToBottom,
  ["behavior"],
);
