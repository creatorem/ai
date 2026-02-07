"use client";

import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "../../utils/create-action-button";
import { useCallback } from "react";
import { useAiChat, useAiChatShallow } from "@creatorem/ai-store";

const useComposerAddAttachment = ({
  multiple = true,
}: {
  /** allow selecting multiple files */
  multiple?: boolean | undefined;
} = {}) => {
  const disabled = useAiChat(({ composer }) => !composer.isEditing);
  const composerMethods = useAiChat(({composer}) => composer.methods);

  const callback = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = multiple;
    input.hidden = true;

    const attachmentAccept = composerMethods.getState().attachmentAccept;
    if (attachmentAccept !== "*") {
      input.accept = attachmentAccept;
    }

    document.body.appendChild(input);

    input.onchange = (e) => {
      const fileList = (e.target as HTMLInputElement).files;
      if (!fileList) return;
      for (const file of fileList) {
        composerMethods.addAttachment(file);
      }

      document.body.removeChild(input);
    };

    input.oncancel = () => {
      if (!input.files || input.files.length === 0) {
        document.body.removeChild(input);
      }
    };

    input.click();
  }, [composerMethods, multiple]);

  if (disabled) return null;
  return callback;
};

export namespace ComposerPrimitiveAddAttachment {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<typeof useComposerAddAttachment>;
}

export const ComposerPrimitiveAddAttachment = createActionButton(
  "ComposerPrimitive.AddAttachment",
  useComposerAddAttachment,
  ["multiple"],
);
