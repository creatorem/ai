"use client";

import { useCallback, useMemo } from "react";
import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "../../utils/create-action-button";
import { useMessage, useMessageStore } from "../message/message-by-index-provider";

const useActionBarSpeak = () => {
  const status = useMessage(s => s.status);
  const role = useMessage(s => s.role);
  const parts = useMessage(s => s.parts);
  const messageStore = useMessageStore();

  const callback = useCallback(async () => {
    messageStore.getState().speak();
  }, [messageStore]);

  const hasSpeakableContent = useMemo(() => {
    return (
      (role !== "assistant" || status?.type !== "running") &&
      parts.some((c) => c.type === "text" && c.text.length > 0)
    );
  }, [status, role, parts]);

  if (!hasSpeakableContent) return null;
  return callback;
};

export namespace ActionBarPrimitiveSpeak {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<typeof useActionBarSpeak>;
}

export const ActionBarPrimitiveSpeak = createActionButton(
  "ActionBarPrimitive.Speak",
  useActionBarSpeak,
);
