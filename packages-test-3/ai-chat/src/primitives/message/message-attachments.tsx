"use client";

import { ComponentType, type FC, memo, useMemo } from "react";
import type { CompleteAttachment } from "../../types/attachment-types";
import { useMessage } from "./message-by-index-provider";
import {
  AttachmentsProvider,
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
      const _exhaustiveCheck: never = type;
      throw new Error(`Unknown attachment type: ${_exhaustiveCheck}`);
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
    components?: MessagePrimitiveAttachments.Props["components"];
  };
}

export const MessagePrimitiveAttachmentByIndex: FC<MessagePrimitiveAttachmentByIndex.Props> =
  memo(
    ({ index, components }) => {
      return (
        <AttachmentByIndexProvider index={index}>
          <AttachmentComponent components={components} />
        </AttachmentByIndexProvider>
      );
    },
    (prev, next) =>
      prev.index === next.index &&
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
    const message = useMessage();
  if (message.role !== "user") return null;

  // const attachmentsCount = useAuiState(({ message }) => {
  //   if (message.role !== "user") return 0;
  //   return message.attachments.length;
  // });

  const attachmentElements = useMemo(() => {
    return Array.from({ length: message.attachments.length }, (_, index) => (
      <MessagePrimitiveAttachmentByIndex
        key={index}
        index={index}
        components={components}
      />
    ));
  }, [message.attachments.length, components]);

  return attachmentElements;
};

MessagePrimitiveAttachments.displayName = "MessagePrimitive.Attachments";


// const _noopRemoveAttachment = () => {};

// export const MessagePrimitiveAttachments: FC<
//   MessagePrimitiveAttachments.Props
// > = ({ components }) => {
//   const message = useMessage();

//   if (message.role !== "user") return null;

//   return (
//     <AttachmentsProvider
//       attachments={message.attachments}
//       removeAttachment={_noopRemoveAttachment}
//     >
//       <MessagePrimitiveAttachmentsInner components={components} />
//     </AttachmentsProvider>
//   );
// };

// const MessagePrimitiveAttachmentsInner: FC<
//   MessagePrimitiveAttachments.Props
// > = ({ components }) => {
//   const message = useMessage();

//   const attachmentsCount =
//     message.role === "user" ? message.attachments.length : 0;

//   const attachmentElements = useMemo(() => {
//     return Array.from({ length: attachmentsCount }, (_, index) => (
//       <MessagePrimitiveAttachmentByIndex
//         key={index}
//         index={index}
//         components={components}
//       />
//     ));
//   }, [attachmentsCount, components]);

//   return <>{attachmentElements}</>;
// };

// MessagePrimitiveAttachments.displayName = "MessagePrimitive.Attachments";
