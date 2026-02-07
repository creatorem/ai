import type { UIMessage } from "ai";
import { MessageFormatAdapter } from "./thread-history";
import { MessageFormatItem, MessageStorageEntry } from './thread-history/message-format-adapter';
export type AISDKStorageFormat = Omit<UIMessage, "id">;

export const aiSDKV6FormatAdapter: MessageFormatAdapter<
  UIMessage,
  AISDKStorageFormat
> = {
  format: "ai-sdk/v6",

  encode({
    message: { id, parts, ...message },
  }: MessageFormatItem<UIMessage>): AISDKStorageFormat {
    return {
      ...message,
      parts,
    };
  },

  decode(
    stored: MessageStorageEntry<AISDKStorageFormat>,
  ): MessageFormatItem<UIMessage> {
    return {
      parentId: stored.parent_id,
      message: {
        id: stored.id,
        ...stored.content,
      },
    };
  },

  getId(message: UIMessage): string {
    return message.id;
  },
};
