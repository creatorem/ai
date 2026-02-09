"use client";

import { ComponentType, type FC, memo } from "react";
import type { Attachment, CompleteAttachment } from "../../types/attachment-types";
import { useMessage } from "./message-by-index-provider";
import {
  AttachmentByIndexProvider,
  useAttachment,
} from "../attachment/attachment-by-index-provider";

export namespace MessagePrimitiveAttachments {
  export type Props = {
    components:
      | {
          Image?: ComponentType | undefined;
          Document?: ComponentType | undefined;
          File?: ComponentType | undefined;
          Attachment?: ComponentType | undefined;
        }
      | undefined;
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
}> = ({ components }) => {
  const attachment = useAttachment();

  const Component = getComponent(components, attachment as CompleteAttachment);
  if (!Component) return null;
  return <Component />;
};

export namespace MessagePrimitiveAttachmentByIndex {
  export type Props = {
    index: number;
    attachment?: Attachment;
    components?: MessagePrimitiveAttachments.Props["components"];
  };
}

export const MessagePrimitiveAttachmentByIndex: FC<MessagePrimitiveAttachmentByIndex.Props> =
  memo(
    ({ index, attachment, components }) => {
      return (
        <AttachmentByIndexProvider index={index} attachment={attachment}>
          <AttachmentComponent components={components} />
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
> = ({ components }) => {
  const role = useMessage(s => s.role);
  const attachments = useMessage(s => s.attachments);
  if (role !== "user") return null;

  return (
    <>
      {attachments.map((attachment, index) => (
        <MessagePrimitiveAttachmentByIndex
          key={attachment.id ?? index}
          index={index}
          attachment={attachment}
          components={components}
        />
      ))}
    </>
  );
};

MessagePrimitiveAttachments.displayName = "MessagePrimitive.Attachments";
