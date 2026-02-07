import type { ThreadMessage } from "../types";

/**
 * Extracts all text content from a thread message.
 * Concatenates all text parts into a single string.
 */
export function getThreadMessageText(message: ThreadMessage): string {
  return message.content
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("\n");
}
