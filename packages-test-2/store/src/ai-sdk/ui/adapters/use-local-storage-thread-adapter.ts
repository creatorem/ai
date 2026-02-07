import type { ThreadHistoryAdapter, GenericThreadHistoryAdapter } from "../../../runtime/types";
import type { ExportedMessageRepository } from "../../../utils/message-repository";
import type { MessageFormatAdapter, MessageFormatItem, MessageFormatRepository, MessageStorageEntry } from "../../../types/adapters/thread-history/index";

export type ExportedMessageRepositoryItem = ExportedMessageRepository["messages"][number];

const STORAGE_KEY_PREFIX = "assistant-thread-";

type StoredMessage<TStorageFormat> = {
  parentId: string | null;
  message: MessageStorageEntry<TStorageFormat>;
};

type LocalStorageFormat<TStorageFormat> = {
  headId: string | null;
  messages: StoredMessage<TStorageFormat>[];
  unstable_resume?: boolean;
};

/**
 * Creates a ThreadHistoryAdapter that persists thread messages to localStorage.
 *
 * @example
 * ```tsx
 * const adapter = createLocalStorageThreadAdapter();
 * ```
 */
export const createLocalStorageThreadAdapter = (): ThreadHistoryAdapter => {
  const getStorageKey = () => {
    // Use a default key - the thread ID could be incorporated via the store
    return `${STORAGE_KEY_PREFIX}messages`;
  };

  const adapter: ThreadHistoryAdapter = {
    async load(): Promise<ExportedMessageRepository & { unstable_resume?: boolean }> {
      if (typeof window === "undefined") {
        return { headId: null, messages: [] };
      }

      try {
        const stored = localStorage.getItem(getStorageKey());
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            headId: parsed.headId ?? null,
            messages: parsed.messages ?? [],
            unstable_resume: parsed.unstable_resume,
          };
        }
      } catch (error) {
        console.error("Failed to load thread history from localStorage:", error);
      }

      return { headId: null, messages: [] };
    },

    async append(item: ExportedMessageRepositoryItem): Promise<void> {
      if (typeof window === "undefined") return;

      try {
        const current = await adapter.load();
        const existingIndex = current.messages.findIndex(
          (m) => m.message.id === item.message.id
        );

        if (existingIndex >= 0) {
          // Update existing message
          current.messages[existingIndex] = item;
        } else {
          // Add new message
          current.messages.push(item);
        }

        // Update head to the new message
        current.headId = item.message.id;

        localStorage.setItem(getStorageKey(), JSON.stringify(current));
      } catch (error) {
        console.error("Failed to save message to localStorage:", error);
      }
    },

    withFormat<TMessage, TStorageFormat>(
      formatAdapter: MessageFormatAdapter<TMessage, TStorageFormat>
    ): GenericThreadHistoryAdapter<TMessage> {
      const formatStorageKey = () => `${getStorageKey()}-${formatAdapter.format}`;

      return {
        async load(): Promise<MessageFormatRepository<TMessage> & { unstable_resume?: boolean }> {
          if (typeof window === "undefined") {
            return { headId: null, messages: [] };
          }

          try {
            const stored = localStorage.getItem(formatStorageKey());
            if (stored) {
              const parsed = JSON.parse(stored) as LocalStorageFormat<TStorageFormat>;
              return {
                headId: parsed.headId ?? null,
                messages: parsed.messages.map((item) =>
                  formatAdapter.decode(item.message)
                ),
                unstable_resume: parsed.unstable_resume,
              };
            }
          } catch (error) {
            console.error("Failed to load formatted thread history from localStorage:", error);
          }

          return { headId: null, messages: [] };
        },

        async append(item: MessageFormatItem<TMessage>): Promise<void> {
          if (typeof window === "undefined") return;

          try {
            const key = formatStorageKey();
            let current: LocalStorageFormat<TStorageFormat> = { headId: null, messages: [] };

            const stored = localStorage.getItem(key);
            if (stored) {
              current = JSON.parse(stored);
            }

            const encoded = formatAdapter.encode(item);
            const messageId = formatAdapter.getId(item.message);

            const storageEntry: MessageStorageEntry<TStorageFormat> = {
              id: messageId,
              parent_id: item.parentId,
              format: formatAdapter.format,
              content: encoded,
            };

            const existingIndex = current.messages.findIndex(
              (m) => m.message.id === messageId
            );

            const storedItem: StoredMessage<TStorageFormat> = {
              parentId: item.parentId,
              message: storageEntry,
            };

            if (existingIndex >= 0) {
              current.messages[existingIndex] = storedItem;
            } else {
              current.messages.push(storedItem);
            }

            current.headId = messageId;
            localStorage.setItem(key, JSON.stringify(current));
          } catch (error) {
            console.error("Failed to save formatted message to localStorage:", error);
          }
        },
      };
    },
  };

  return adapter;
};

/**
 * Clears the thread history from localStorage.
 */
export const clearLocalStorageThreadHistory = (): void => {
  if (typeof window === "undefined") return;

  try {
    const key = `${STORAGE_KEY_PREFIX}messages`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to clear thread history from localStorage:", error);
  }
};
