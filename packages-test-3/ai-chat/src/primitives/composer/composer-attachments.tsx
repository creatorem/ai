"use client";

import { ComponentType, type FC, memo, useMemo } from "react";
import type { Attachment } from "../../types/attachment-types";
import { useComposer } from "./composer-root";
import {
  AttachmentsProvider,
  AttachmentByIndexProvider,
  useAttachment,
} from "../attachment/attachment-by-index-provider";

export namespace ComposerPrimitiveAttachments {
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
  components: ComposerPrimitiveAttachments.Props["components"],
  attachment: Attachment,
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
  components: ComposerPrimitiveAttachments.Props["components"];
}> = ({ components }) => {
  const attachment = useAttachment();

  const Component = getComponent(components, attachment);
  if (!Component) return null;
  return <Component />;
};

export namespace ComposerPrimitiveAttachmentByIndex {
  export type Props = {
    index: number;
    components?: ComposerPrimitiveAttachments.Props["components"];
  };
}

export const ComposerPrimitiveAttachmentByIndex: FC<ComposerPrimitiveAttachmentByIndex.Props> =
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

ComposerPrimitiveAttachmentByIndex.displayName =
  "ComposerPrimitive.AttachmentByIndex";

export const ComposerPrimitiveAttachments: FC<
  ComposerPrimitiveAttachments.Props
> = ({ components }) => {
  const attachments = useComposer(s => s.attachments);
  const removeAttachment = useComposer(s => s.removeAttachment);

  return (
    <AttachmentsProvider attachments={attachments} removeAttachment={removeAttachment}>
      <ComposerPrimitiveAttachmentsInner components={components} />
    </AttachmentsProvider>
  );
};

const ComposerPrimitiveAttachmentsInner: FC<
  ComposerPrimitiveAttachments.Props
> = ({ components }) => {
  const attachments = useComposer(s => s.attachments);

  const attachmentElements = useMemo(() => {
    return Array.from({ length: attachments.length }, (_, index) => (
      <ComposerPrimitiveAttachmentByIndex
        key={index}
        index={index}
        components={components}
      />
    ));
  }, [attachments.length, components]);

  return <>{attachmentElements}</>;
};

ComposerPrimitiveAttachments.displayName = "ComposerPrimitive.Attachments";
