import type {
  AppendMessage,
  TextMessagePart,
  ThreadMessage,
} from "@creatorem/ai-store/types";

export const getThreadMessageText = (
  message: ThreadMessage | AppendMessage,
) => {
  const textParts = message.content.filter(
    (part) => part.type === "text",
  ) as TextMessagePart[];

  return textParts.map((part) => part.text).join("\n\n");
};
