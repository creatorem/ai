import type {
  Attachment,
  PendingAttachmentStatus,
} from "../types/attachment-types";
import type { ThreadUserMessagePart } from "../types/message-part-types";

const IMAGE_EXTENSIONS = new Set([
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "bmp",
  "heic",
  "heif",
  "tif",
  "tiff",
  "svg",
  "avif",
]);

const DOCUMENT_EXTENSIONS = new Set([
  "pdf",
  "txt",
  "md",
  "csv",
  "json",
  "xml",
  "yaml",
  "yml",
  "doc",
  "docx",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
  "rtf",
  "odt",
  "ods",
  "odp",
]);

const getExtension = (name: string): string => {
  const idx = name.lastIndexOf(".");
  if (idx < 0 || idx === name.length - 1) return "";
  return name.slice(idx + 1).toLowerCase();
};

const inferAttachmentType = (
  contentType: string,
  name: string,
): Attachment["type"] => {
  const ext = getExtension(name);

  if (contentType.startsWith("image/") || IMAGE_EXTENSIONS.has(ext)) {
    return "image";
  }

  if (
    contentType.startsWith("text/") ||
    (contentType.startsWith("application/") &&
      contentType !== "application/octet-stream") ||
    DOCUMENT_EXTENSIONS.has(ext)
  ) {
    return "document";
  }

  return "file";
};

export type FileToAttachmentOptions = {
  name?: string;
  contentType?: string;
  type?: Attachment["type"];
  status?: PendingAttachmentStatus;
  content?: ThreadUserMessagePart[];
  imagePreviewUri?: string;
};

export const fileToAttachment = (
  file: File,
  options: FileToAttachmentOptions = {},
): Omit<Attachment, "id"> => {
  const name = options.name ?? file.name ?? "attachment";
  const contentType =
    options.contentType ?? file.type ?? "application/octet-stream";
  const type = options.type ?? inferAttachmentType(contentType, name);
  const status: PendingAttachmentStatus =
    options.status ?? { type: "requires-action", reason: "composer-send" };

  const content =
    options.content ??
    (() => {
      if (type !== "image") return [];
      const previewUri = options.imagePreviewUri;
      if (!previewUri) return [];
      return [{ type: "image", image: previewUri, filename: name }];
    })();

  return {
    type,
    name,
    contentType,
    file,
    content,
    status,
  };
};
