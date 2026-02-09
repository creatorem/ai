type RepositoryParent = {
  children: string[];
  next: RepositoryMessage<any> | null;
};

type RepositoryMessage<TMessage extends { id: string }> = RepositoryParent & {
  prev: RepositoryMessage<TMessage> | null;
  current: TMessage;
  level: number;
};

const findHead = <TMessage extends { id: string }>(
  message: RepositoryMessage<TMessage> | RepositoryParent,
): RepositoryMessage<TMessage> | null => {
  if (message.next) return findHead(message.next);
  if ("current" in message) return message as RepositoryMessage<TMessage>;
  return null;
};

class CachedValue<T> {
  private _value: T | null = null;

  constructor(private func: () => T) {}

  get value() {
    if (this._value === null) {
      this._value = this.func();
    }
    return this._value;
  }

  dirty() {
    this._value = null;
  }
}

export class MessageRepository<TMessage extends { id: string }> {
  private messages = new Map<string, RepositoryMessage<TMessage>>();
  private head: RepositoryMessage<TMessage> | null = null;
  private root: RepositoryParent = {
    children: [],
    next: null,
  };

  private performOp(
    newParent: RepositoryMessage<TMessage> | null,
    child: RepositoryMessage<TMessage>,
    operation: "cut" | "link" | "relink",
  ) {
    const parentOrRoot = child.prev ?? this.root;
    const newParentOrRoot = newParent ?? this.root;

    if (operation === "relink" && parentOrRoot === newParentOrRoot) return;

    // cut
    if (operation !== "link") {
      parentOrRoot.children = parentOrRoot.children.filter(
        (m) => m !== child.current.id,
      );

      if (parentOrRoot.next === child) {
        const fallbackId = parentOrRoot.children.at(-1);
        const fallback = fallbackId
          ? this.messages.get(fallbackId) ?? null
          : null;
        parentOrRoot.next = fallback;
      }
    }

    // link
    if (operation !== "cut") {
      newParentOrRoot.children = [
        ...newParentOrRoot.children,
        child.current.id,
      ];

      if (findHead(child) === this.head || newParentOrRoot.next === null) {
        newParentOrRoot.next = child;
      }

      child.prev = newParent;

      const newLevel = newParent ? newParent.level + 1 : 0;
      this.updateLevels(child, newLevel);
    }
  }

  private updateLevels(
    message: RepositoryMessage<TMessage>,
    newLevel: number,
  ) {
    message.level = newLevel;
    for (const childId of message.children) {
      const childMessage = this.messages.get(childId);
      if (childMessage) {
        this.updateLevels(childMessage, newLevel + 1);
      }
    }
  }

  private _messages = new CachedValue<readonly TMessage[]>(() => {
    const messages = new Array<TMessage>((this.head?.level ?? -1) + 1);
    for (let current = this.head; current; current = current.prev) {
      messages[current.level] = current.current;
    }
    return messages;
  });

  addOrUpdateMessage(parentId: string | null, message: TMessage): void {
    const existingItem = this.messages.get(message.id);
    const prev = parentId ? this.messages.get(parentId) : null;
    if (parentId && prev === undefined) {
      throw new Error(
        "MessageRepository(addOrUpdateMessage): Parent message not found.",
      );
    }

    if (existingItem) {
      existingItem.current = message;
      this.performOp(prev ?? null, existingItem, "relink");
      this._messages.dirty();
      return;
    }

    const newItem: RepositoryMessage<TMessage> = {
      prev: prev ?? null,
      current: message,
      next: null,
      children: [],
      level: prev ? prev.level + 1 : 0,
    };

    this.messages.set(message.id, newItem);
    this.performOp(prev ?? null, newItem, "link");

    if (this.head === prev) {
      this.head = newItem;
    }

    this._messages.dirty();
  }

  getBranches(messageId: string): string[] {
    const message = this.messages.get(messageId);
    if (!message) {
      throw new Error(
        "MessageRepository(getBranches): Message not found.",
      );
    }

    const { children } = message.prev ?? this.root;
    return children;
  }

  switchToBranch(messageId: string): void {
    const message = this.messages.get(messageId);
    if (!message) {
      throw new Error(
        "MessageRepository(switchToBranch): Branch not found.",
      );
    }

    const prevOrRoot = message.prev ?? this.root;
    prevOrRoot.next = message;

    this.head = findHead(message);

    this._messages.dirty();
  }

  getMessages(): readonly TMessage[] {
    return this._messages.value;
  }

  resetHead(messageId: string | null): void {
    if (messageId === null) {
      this.clear();
      return;
    }

    const message = this.messages.get(messageId);
    if (!message) {
      throw new Error(
        "MessageRepository(resetHead): Message not found.",
      );
    }

    if (message.children.length > 0) {
      const deleteDescendants = (msg: RepositoryMessage<TMessage>) => {
        for (const childId of msg.children) {
          const childMessage = this.messages.get(childId);
          if (childMessage) {
            deleteDescendants(childMessage);
            this.messages.delete(childId);
          }
        }
      };
      deleteDescendants(message);

      message.children = [];
      message.next = null;
    }

    this.head = message;
    for (
      let current: RepositoryMessage<TMessage> | null = message;
      current;
      current = current.prev
    ) {
      if (current.prev) {
        current.prev.next = current;
      }
    }

    this._messages.dirty();
  }

  clear(): void {
    this.messages.clear();
    this.head = null;
    this.root = {
      children: [],
      next: null,
    };
    this._messages.dirty();
  }
}
