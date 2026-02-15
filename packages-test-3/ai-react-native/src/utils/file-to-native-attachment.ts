import type { Attachment } from "@creatorem/ai-chat/types/attachment-types";

type NativeFile = File & { uri?: string };

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

const inferType = (contentType: string, name: string): Attachment["type"] => {
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

export type NativeFileToAttachmentOptions = {
  name?: string;
  contentType?: string;
  type?: Attachment["type"];
};

export const fileToNativeAttachment = (
  file: NativeFile,
  options: NativeFileToAttachmentOptions = {},
): Omit<Attachment, "id"> => {
  const name = options.name ?? file.name ?? "attachment";
  const contentType =
    options.contentType ?? file.type ?? "application/octet-stream";
  const type = options.type ?? inferType(contentType, name);

  const content =
    type === "image" && file.uri
      ? [{ type: "image" as const, image: file.uri, filename: name }]
      : [];

  return {
    type,
    name,
    contentType,
    file,
    content,
    status: { type: "requires-action", reason: "composer-send" },
  };
};

