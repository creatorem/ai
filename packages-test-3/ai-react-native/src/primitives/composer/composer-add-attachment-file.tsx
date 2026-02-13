import { useCallback } from "react";
import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "@creatorem/ai-chat/utils";
import { useComposerStore } from "@creatorem/ai-chat/primitives/composer";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";

const uriToFile = async (
  uri: string,
  name: string,
  type: string,
): Promise<File> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new File([blob], name, { type });
};

const useComposerAddAttachmentFile = ({
  multiple = true,
}: {
  /** allow selecting multiple files */
  multiple?: boolean | undefined;
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

        for (const asset of result.assets) {
          const file = await uriToFile(
            asset.uri,
            asset.name,
            asset.mimeType || "application/octet-stream",
          );
          await addAttachment(file);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to pick attachment. Please try again.");
      }
    };

    pickAttachment();
  }, [composerStore, multiple]);

  return callback;
};

export namespace ComposerPrimitiveAddAttachmentFile {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<typeof useComposerAddAttachmentFile>;
}

export const ComposerPrimitiveAddAttachmentFile = createActionButton(
  "ComposerPrimitive.AddAttachmentFile",
  useComposerAddAttachmentFile,
  ["multiple"],
);
