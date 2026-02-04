import { resource, tapEffect } from "@creatorem/ai-tap";
import { type ClientOutput, tapAssistantEmit } from "@creatorem/ai-store";
import {
  ThreadListItemEventType,
  ThreadListItemRuntime,
} from "../runtime/thread-list-item-runtime";
import { Unsubscribe } from "../../types";
import { tapSubscribable } from "../util-hooks/tap-subscribable";

export const ThreadListItemClient = resource(
  ({
    runtime,
  }: {
    runtime: ThreadListItemRuntime;
  }): ClientOutput<"threadListItem"> => {
    const state = tapSubscribable(runtime);
    const emit = tapAssistantEmit();

    // Bind thread list item events to event manager
    tapEffect(() => {
      const unsubscribers: Unsubscribe[] = [];

      // Subscribe to thread list item events
      const threadListItemEvents: ThreadListItemEventType[] = [
        "switchedTo",
        "switchedAway",
      ];

      for (const event of threadListItemEvents) {
        const unsubscribe = runtime.unstable_on(event, () => {
          emit(`threadListItem.${event}`, {
            threadId: runtime.getState()!.id,
          });
        });
        unsubscribers.push(unsubscribe);
      }

      return () => {
        for (const unsub of unsubscribers) unsub();
      };
    }, [runtime, emit]);

    return {
      state,
      methods: {
        getState: () => state,
        switchTo: runtime.switchTo,
        rename: runtime.rename,
        archive: runtime.archive,
        unarchive: runtime.unarchive,
        delete: runtime.delete,
        generateTitle: runtime.generateTitle,
        initialize: runtime.initialize,
        detach: runtime.detach,
        __internal_getRuntime: () => runtime,
      },
    };
  },
);
