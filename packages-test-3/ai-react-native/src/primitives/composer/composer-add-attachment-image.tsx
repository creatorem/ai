import { useCallback } from "react";
import {
  ActionButtonElement,
  ActionButtonProps,
  createActionButton,
} from "@creatorem/ai-chat/utils";
import { useComposerStore } from "@creatorem/ai-chat/primitives/composer";
import * as ImagePicker from "expo-image-picker";
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

const useComposerAddAttachmentImage = ({
  multiple = true,
}: {
  /** allow selecting multiple images */
  multiple?: boolean | undefined;
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

        for (const asset of result.assets) {
          const file = await uriToFile(
            asset.uri,
            asset.fileName || `image-${Date.now()}.jpg`,
            asset.mimeType || "image/jpeg",
          );
          await addAttachment(file);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to pick image. Please try again.");
      }
    };

    pickImage();
  }, [composerStore, multiple]);

  return callback;
};

export namespace ComposerPrimitiveAddAttachmentImage {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<typeof useComposerAddAttachmentImage>;
}

export const ComposerPrimitiveAddAttachmentImage = createActionButton(
  "ComposerPrimitive.AddAttachmentImage",
  useComposerAddAttachmentImage,
  ["multiple"],
);
