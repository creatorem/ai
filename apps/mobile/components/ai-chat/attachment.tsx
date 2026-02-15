"use client";

import { type FC, useMemo } from "react";
import { Image as NativeImage, ScrollView, View } from "react-native";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
import { cn } from "~/lib/cn";

import * as AttachmentPrimitive from "@creatorem/ai-react-native/primitives/attachment";
import { useAttachment } from "@creatorem/ai-react-native/primitives/attachment";
import * as ComposerPrimitive from "@creatorem/ai-react-native/primitives/composer";
import * as MessagePrimitive from "@creatorem/ai-react-native/primitives/message";
import { useActionSheet } from "../ui/action-sheet";

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

const AttachmentUI: FC<{ noRemoveButton?: boolean }> = ({ noRemoveButton }) => {
  return (
    <AttachmentPrimitive.Root className="relative">
      <View
        className={cn(
          "aspect-square flex-1 overflow-hidden rounded-2xl border border-input",
        )}
      >
        <AttachmentThumb />
      </View>

      {!noRemoveButton && (
        <View className="absolute top-1.5 right-1.5 z-20">
          <AttachmentPrimitive.Remove
            size="icon"
            variant="ghost"
            className="size-5 rounded-full bg-background p-0 text-foreground"
            aria-label="Remove attachment"
          >
            <Icon name="X" size={14} strokeWidth={3} />
          </AttachmentPrimitive.Remove>
        </View>
      )}
    </AttachmentPrimitive.Root>
  );
};

export const UserMessageAttachments: FC = () => {
  return (
    <View className="col-span-full col-start-1 row-start-1 mb-2 flex h-32 w-full flex-row justify-end gap-2">
      <MessagePrimitive.Attachments
        components={{ Attachment: AttachmentUI }}
        componentProps={{ noRemoveButton: true }}
      />
    </View>
  );
};

export const ComposerAttachments: FC = () => {
  const attachments = ComposerPrimitive.useComposer((s) => s.attachments);
  return attachments.length > 0 ? (
    <View className="h-28 w-full">
      <ScrollView
        horizontal
        contentContainerStyle={{
          gap: 8,
          paddingHorizontal: 6,
          paddingBottom: 4,
        }}
        className="h-full w-full p-2"
      >
        <ComposerPrimitive.Attachments
          components={{ Attachment: AttachmentUI }}
        />
      </ScrollView>
    </View>
  ) : null;
};

const ComposerAddAttachmentTakePhoto: FC<{ onAddAttachment?: () => void }> = ({
  onAddAttachment,
}) => {
  return (
    <ComposerPrimitive.AddAttachmentTakePhoto
      variant="secondary"
      className="flex h-20 flex-1 flex-col rounded-2xl p-2"
      onAddAttachment={onAddAttachment}
    >
      <Icon name="Camera" size={20} />
      <Text>Take photo</Text>
    </ComposerPrimitive.AddAttachmentTakePhoto>
  );
};

const ComposerAddAttachmentImage: FC<{ onAddAttachment?: () => void }> = ({
  onAddAttachment,
}) => {
  return (
    <ComposerPrimitive.AddAttachmentImage
      variant="secondary"
      className="flex h-20 flex-1 flex-col rounded-2xl p-2"
      onAddAttachment={onAddAttachment}
    >
      <Icon name="Image" size={20} />
      <Text>Image</Text>
    </ComposerPrimitive.AddAttachmentImage>
  );
};

const ComposerAddAttachmentFile: FC<{ onAddAttachment?: () => void }> = ({
  onAddAttachment,
}) => {
  return (
    <ComposerPrimitive.AddAttachmentFile
      variant="secondary"
      className="flex h-20 flex-1 flex-col rounded-2xl p-2"
      onAddAttachment={onAddAttachment}
    >
      <Icon name="Paperclip" size={20} />
      <Text>Files</Text>
    </ComposerPrimitive.AddAttachmentFile>
  );
};

export const ComposerAddAttachmentSheet: FC = () => {
  const { setOpen } = useActionSheet();

  const handleAddAttachment = () => {
    setOpen(false);
  };

  return (
    <View className="flex flex-row gap-4">
      <ComposerAddAttachmentTakePhoto onAddAttachment={handleAddAttachment} />
      <ComposerAddAttachmentImage onAddAttachment={handleAddAttachment} />
      <ComposerAddAttachmentFile onAddAttachment={handleAddAttachment} />
    </View>
  );
};
