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

const useComposerAddAttachmentTakePhoto = ({
  onAddAttachment,
}: {
  onAddAttachment?: () => void;
}) => {
  const composerStore = useComposerStore();

  const callback = useCallback(() => {
    const { addAttachment } = composerStore.getState();

    const takePhoto = async () => {
      try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Please grant camera access to take a photo.",
          );
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          quality: 1,
        });

        if (result.canceled || !result.assets?.length) return;
        const asset = result.assets[0];
        if (!asset) return;

        const file = await uriToFile(
          asset.uri,
          asset.fileName || `photo-${Date.now()}.jpg`,
          asset.mimeType || "image/jpeg",
        );

        await addAttachment(
          fileToNativeAttachment(file as File & { uri?: string }, {
            type: "image",
          }),
        );
        onAddAttachment?.();
      } catch {
        Alert.alert("Error", "Failed to take photo. Please try again.");
      }
    };

    takePhoto();
  }, [composerStore, onAddAttachment]);

  return callback;
};

export namespace ComposerPrimitiveAddAttachmentTakePhoto {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<
    typeof useComposerAddAttachmentTakePhoto
  >;
}

export const ComposerPrimitiveAddAttachmentTakePhoto = createActionButton(
  "ComposerPrimitive.AddAttachmentTakePhoto",
  useComposerAddAttachmentTakePhoto,
  ["onAddAttachment"],
);
