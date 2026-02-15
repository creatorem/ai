import { useCallback } from "react";
import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "@creatorem/ai-chat/utils";
import { useComposerStore } from "@creatorem/ai-chat/primitives/composer";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";
import { fileToNativeAttachment, uriToFile } from "../../utils";

const useComposerAddAttachmentFile = ({
  multiple = true,
  onAddAttachment,
}: {
  /** allow selecting multiple files */
  multiple?: boolean | undefined;
  onAddAttachment?: () => void;
} = {}) => {
  const composerStore = useComposerStore();

  const callback = useCallback(() => {
    const { attachmentAccept, addAttachment } = composerStore.getState();

    const pickAttachment = async () => {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          multiple,
          type:
            attachmentAccept !== "*"
              ? attachmentAccept.split(",").map((t) => t.trim())
              : undefined,
        });

        if (result.canceled || !result.assets?.length) return;

        let addedCount = 0;

        for (const asset of result.assets) {
          const file = await uriToFile(
            asset.uri,
            asset.name,
            asset.mimeType || "application/octet-stream",
          );
          await addAttachment(
            fileToNativeAttachment(file as File & { uri?: string }),
          );
          addedCount += 1;
        }

        if (addedCount > 0) {
          onAddAttachment?.();
        }
      } catch (error) {
        Alert.alert("Error", "Failed to pick attachment. Please try again.");
      }
    };

    pickAttachment();
  }, [composerStore, multiple, onAddAttachment]);

  return callback;
};

export namespace ComposerPrimitiveAddAttachmentFile {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<typeof useComposerAddAttachmentFile>;
}

export const ComposerPrimitiveAddAttachmentFile = createActionButton(
  "ComposerPrimitive.AddAttachmentFile",
  useComposerAddAttachmentFile,
  ["multiple", "onAddAttachment"],
);
