"use client";

import { ComponentType, type FC, memo } from "react";
import type { Attachment, CompleteAttachment } from "../../types/attachment-types";
import { useMessage } from "./message-by-index-provider";
import {
  AttachmentByIndexProvider,
  useAttachment,
} from "../attachment/attachment-by-index-provider";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import { RuntimeComponents } from "@creatorem/ai-chat/component-types";

export namespace MessagePrimitiveAttachments {
  export type Props = React.ComponentProps<RuntimeComponents['Box']> & {
    components:
      | {
          Image?: ComponentType | undefined;
          Document?: ComponentType | undefined;
          File?: ComponentType | undefined;
          Attachment?: ComponentType | undefined;
        }
      | undefined;
      componentProps?: Record<string, unknown>;
  };
}

const getComponent = (
  components: MessagePrimitiveAttachments.Props["components"],
  attachment: CompleteAttachment,
) => {
  const type = attachment.type;
  switch (type) {
    case "image":
      return components?.Image ?? components?.Attachment;
    case "document":
      return components?.Document ?? components?.Attachment;
    case "file":
      return components?.File ?? components?.Attachment;
    default:
      return components?.Attachment;
  }
};

const AttachmentComponent: FC<{
  components: MessagePrimitiveAttachments.Props["components"];
  componentProps?: Record<string, unknown>;
}> = ({ components, componentProps }) => {
  const attachment = useAttachment();

  const Component = getComponent(components, attachment as CompleteAttachment);
  if (!Component) return null;
  return <Component {...componentProps} />;
};

export namespace MessagePrimitiveAttachmentByIndex {
  export type Props = {
    index: number;
    attachment?: Attachment;
    components?: MessagePrimitiveAttachments.Props["components"];
    componentProps?: Record<string, unknown>;
  };
}

export const MessagePrimitiveAttachmentByIndex: FC<MessagePrimitiveAttachmentByIndex.Props> =
  memo(
    ({ index, attachment, components, componentProps }) => {
      return (
        <AttachmentByIndexProvider index={index} attachment={attachment}>
          <AttachmentComponent components={components} componentProps={componentProps} />
        </AttachmentByIndexProvider>
      );
    },
    (prev, next) =>
      prev.index === next.index &&
      prev.attachment === next.attachment &&
      prev.components?.Image === next.components?.Image &&
      prev.components?.Document === next.components?.Document &&
      prev.components?.File === next.components?.File &&
      prev.components?.Attachment === next.components?.Attachment,
  );

MessagePrimitiveAttachmentByIndex.displayName =
  "MessagePrimitive.AttachmentByIndex";

export const MessagePrimitiveAttachments: FC<
  MessagePrimitiveAttachments.Props
> = ({ components, componentProps, ...props }) => {
  const role = useMessage(s => s.role);
  const attachments = useMessage(s => s.attachments);
  const {components: {Box}} = useRuntime()
  if (role !== "user") return null;

  return attachments.length > 0 ? (
    <Box {...props}>
      {attachments.map((attachment, index) => (
        <MessagePrimitiveAttachmentByIndex
          key={attachment.id ?? index}
          index={index}
          attachment={attachment}
          components={components}
          componentProps={componentProps}
        />
      ))}
    </Box>
  ) : null;
};

MessagePrimitiveAttachments.displayName = "MessagePrimitive.Attachments";
