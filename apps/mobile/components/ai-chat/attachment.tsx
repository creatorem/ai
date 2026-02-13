"use client";

import { type FC, useCallback, useMemo } from "react";
import {
  Image as NativeImage,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { cn } from "~/utils/cn";

import * as AttachmentPrimitive from "@creatorem/ai-react-native/primitives/attachment";
import { useAttachment } from "@creatorem/ai-react-native/primitives/attachment";
import * as ComposerPrimitive from "@creatorem/ai-react-native/primitives/composer";
import * as MessagePrimitive from "@creatorem/ai-react-native/primitives/message";
import { useComposerStore } from "@creatorem/ai-chat/primitives/composer";

const uriToFile = async (
  uri: string,
  name: string,
  type: string,
): Promise<File> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new File([blob], name, { type });
};

const isImageOnlyAccept = (accept: string): boolean => {
  if (accept === "*") return false;
  return accept.split(",").every((item) => item.trim().startsWith("image"));
};

const useComposerAddAttachment = ({
  multiple = true,
}: {
  multiple?: boolean;
} = {}) => {
  const composerStore = useComposerStore();

  return useCallback(async () => {
    const { attachmentAccept, addAttachment } = composerStore.getState();

    try {
      if (isImageOnlyAccept(attachmentAccept)) {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission required",
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
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        multiple,
        type:
          attachmentAccept !== "*"
            ? attachmentAccept.split(",").map((item) => item.trim())
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
    } catch {
      Alert.alert("Error", "Failed to add attachment. Please try again.");
    }
  }, [composerStore, multiple]);
};

const useAttachmentImageSrc = () => {
  const attachment = useAttachment();
  return useMemo(() => {
    if (attachment.type !== "image") return undefined;
    return attachment.content?.find((part) => part.type === "image")?.image;
  }, [attachment.content, attachment.type]);
};

const AttachmentThumb: FC = () => {
  const attachment = useAttachment();
  const imageSrc = useAttachmentImageSrc();

  if (imageSrc) {
    return (
      <NativeImage
        source={{ uri: imageSrc }}
        resizeMode="cover"
        style={{ width: "100%", height: "100%" }}
      />
    );
  }

  return (
    <View className="flex h-full w-full items-center justify-center bg-muted">
      <Icon
        name={attachment.type === "image" ? "Image" : "File"}
        size={18}
        className="text-muted-foreground"
      />
    </View>
  );
};

const AttachmentRemove: FC = () => {
  return (
    <View className="absolute top-1 right-1 z-10">
      <AttachmentPrimitive.Remove
        size="icon"
        variant="ghost"
        className="h-6 w-6 rounded-full bg-background/90 p-1"
        aria-label="Remove attachment"
      >
        <Icon name="X" size={12} />
      </AttachmentPrimitive.Remove>
    </View>
  );
};

const AttachmentUI: FC = () => {
  const attachment = useAttachment();
  const isComposerAttachment = attachment.status.type !== "complete";
  const tileSizeClass =
    isComposerAttachment && attachment.type === "image"
      ? "h-24 w-24"
      : "h-14 w-14";

  return (
    <AttachmentPrimitive.Root className="relative">
      <View
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-secondary",
          tileSizeClass,
        )}
      >
        <AttachmentThumb />
      </View>

      {isComposerAttachment && <AttachmentRemove />}

      <View className="mt-1 max-w-24">
        <Text className="text-muted-foreground text-xs" numberOfLines={1}>
          <AttachmentPrimitive.Name />
        </Text>
      </View>
    </AttachmentPrimitive.Root>
  );
};

export const UserMessageAttachments: FC = () => {
  return (
    <View className="col-span-full col-start-1 row-start-1 mb-2 flex w-full flex-row justify-end gap-2">
      <MessagePrimitive.Attachments components={{ Attachment: AttachmentUI }} />
    </View>
  );
};

export const ComposerAttachments: FC = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 6, paddingBottom: 4 }}
      className="mb-2 w-full"
    >
      <ComposerPrimitive.Attachments
        components={{ Attachment: AttachmentUI }}
      />
    </ScrollView>
  );
};

// export const ComposerAddAttachment: FC<{ multiple?: boolean }> = ({
//   multiple = true,
// }) => {
//   const onAddAttachment = useComposerAddAttachment({ multiple });

//   return (
//     <Pressable
//       onPress={onAddAttachment}
//       className="size-8 items-center justify-center rounded-full"
//       accessibilityLabel="Add attachment"
//     >
//       <Icon name="Plus" size={18} />
//     </Pressable>
//   );
// };

const ComposerAddAttachmentTakePhoto: FC = () => {
  return (
    <ComposerPrimitive.AddAttachmentTakePhoto
      variant="secondary"
      className="flex h-20 flex-1 flex-col rounded-2xl p-2"
    >
      <Icon name="Camera" size={20} />
      <Text>Take photo</Text>
    </ComposerPrimitive.AddAttachmentTakePhoto>
  );
};

const ComposerAddAttachmentImage: FC = () => {
  return (
    <ComposerPrimitive.AddAttachmentImage
      variant="secondary"
      className="flex h-20 flex-1 flex-col rounded-2xl p-2"
    >
      <Icon name="Image" size={20} />
      <Text>Image</Text>
    </ComposerPrimitive.AddAttachmentImage>
  );
};

const ComposerAddAttachmentFile: FC = () => {
  return (
    <ComposerPrimitive.AddAttachmentFile
      variant="secondary"
      className="flex h-20 flex-1 flex-col rounded-2xl p-2"
    >
      <Icon name="Paperclip" size={20} />
      <Text>Files</Text>
    </ComposerPrimitive.AddAttachmentFile>
  );
};

export const ComposerAddAttachment: FC = () => {
  return (
    <View className="flex flex-row gap-4 p-6 pt-2">
      <ComposerAddAttachmentTakePhoto />
      <ComposerAddAttachmentImage />
      <ComposerAddAttachmentFile />
    </View>
  );
};
