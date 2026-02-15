import { useCallback } from "react";
import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "@creatorem/ai-chat/utils";
import { useComposerStore } from "@creatorem/ai-chat/primitives/composer";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { fileToNativeAttachment, uriToFile } from "../../utils";

const useComposerAddAttachmentImage = ({
  multiple = true,
  onAddAttachment,
}: {
  /** allow selecting multiple images */
  multiple?: boolean | undefined;
  onAddAttachment?: () => void;
} = {}) => {
  const composerStore = useComposerStore();

  const callback = useCallback(() => {
    const { addAttachment } = composerStore.getState();

    const pickImage = async () => {
      try {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Please grant media library access to add attachments.",
          );
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsMultipleSelection: multiple,
          quality: 1,
        });

        if (result.canceled || !result.assets?.length) return;

        let addedCount = 0;

        for (const asset of result.assets) {
          const file = await uriToFile(
            asset.uri,
            asset.fileName || `image-${Date.now()}.jpg`,
            asset.mimeType || "image/jpeg",
          );
          await addAttachment(
            fileToNativeAttachment(file as File & { uri?: string }, {
              type: "image",
            }),
          );
          addedCount += 1;
        }

        if (addedCount > 0) {
          onAddAttachment?.();
        }
      } catch (error) {
        Alert.alert("Error", "Failed to pick image. Please try again.");
      }
    };

    pickImage();
  }, [composerStore, multiple, onAddAttachment]);

  return callback;
};

export namespace ComposerPrimitiveAddAttachmentImage {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<typeof useComposerAddAttachmentImage>;
}

export const ComposerPrimitiveAddAttachmentImage = createActionButton(
  "ComposerPrimitive.AddAttachmentImage",
  useComposerAddAttachmentImage,
  ["multiple", "onAddAttachment"],
);
