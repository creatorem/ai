"use client";

import { ComponentType, FC, memo, useMemo } from "react";
import { useThreadList } from "./thread-list-provider";
import { ThreadListItemByIndexProvider } from "../thread-list-item/thread-list-item-by-index-provider";

export namespace ThreadListPrimitiveItems {
  export type Props = {
    archived?: boolean | undefined;
    components: {
      ThreadListItem: ComponentType;
    };
  };
}

export namespace ThreadListPrimitiveItemByIndex {
  export type Props = {
    index: number;
    archived?: boolean | undefined;
    components: ThreadListPrimitiveItems.Props["components"];
  };
}

export const ThreadListPrimitiveItemByIndex: FC<ThreadListPrimitiveItemByIndex.Props> =
  memo(
    ({ index, archived = false, components }) => {
      const ThreadListItemComponent = components.ThreadListItem;

      return (
        <ThreadListItemByIndexProvider index={index} archived={archived}>
          <ThreadListItemComponent />
        </ThreadListItemByIndexProvider>
      );
    },
    (prev, next) =>
      prev.index === next.index &&
      prev.archived === next.archived &&
      prev.components.ThreadListItem === next.components.ThreadListItem,
  );

ThreadListPrimitiveItemByIndex.displayName = "ThreadListPrimitive.ItemByIndex";

export const ThreadListPrimitiveItems: FC<ThreadListPrimitiveItems.Props> = ({
  archived = false,
  components,
}) => {
  const contentLength = useThreadList((s) =>
    archived ? s.archivedThreads.length : s.threads.length,
  );

  const listElements = useMemo(() => {
    return Array.from({ length: contentLength }, (_, index) => (
      <ThreadListPrimitiveItemByIndex
        key={index}
        index={index}
        archived={archived}
        components={components}
      />
    ));
  }, [contentLength, archived, components]);

  return listElements;
};

ThreadListPrimitiveItems.displayName = "ThreadListPrimitive.Items";
