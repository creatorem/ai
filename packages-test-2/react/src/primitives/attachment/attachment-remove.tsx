"use client";

import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "../../utils/create-action-button";
import { useCallback } from "react";
import { useAiChat } from "@creatorem/ai-store";

const useAttachmentRemove = () => {
  const attachmentMethods = useAiChat(({attachment}) => attachment.methods);

  const handleRemoveAttachment = useCallback(() => {
    attachmentMethods.remove();
  }, [attachmentMethods]);

  return handleRemoveAttachment;
};

export namespace AttachmentPrimitiveRemove {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<typeof useAttachmentRemove>;
}

export const AttachmentPrimitiveRemove = createActionButton(
  "AttachmentPrimitive.Remove",
  useAttachmentRemove,
);
