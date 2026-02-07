import type { Attachment } from "../attachment-types";

export type AttachmentState = Attachment;

export type AttachmentMethods = {
  getState(): AttachmentState;
  remove(): Promise<void>;
};

export type AttachmentMeta = {
  source: "message" | "composer";
  query: { type: "index"; index: number } | { type: "id"; id: string };
};

export type AttachmentClientSchema = {
  state: AttachmentState;
  methods: AttachmentMethods;
  meta: AttachmentMeta;
};
