"use client";

import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "../../utils/create-action-button";
import { useCallback } from "react";
import { useAttachmentStore } from "./attachment-by-index-provider";

const useAttachmentRemove = () => {
  const attachmentStore = useAttachmentStore();

  const handleRemoveAttachment = useCallback(() => {
    attachmentStore.getState().remove();
  }, [attachmentStore]);

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
