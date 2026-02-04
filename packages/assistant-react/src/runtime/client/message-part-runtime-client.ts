import { resource } from "@creatorem/ai-tap";
import { type ClientOutput } from "@creatorem/ai-assistant-store";
import { MessagePartRuntime } from "../runtime/message-part-runtime";
import { tapSubscribable } from "../util-hooks/tap-subscribable";

export const MessagePartClient = resource(
  ({ runtime }: { runtime: MessagePartRuntime }): ClientOutput<"part"> => {
    const state = tapSubscribable(runtime);

    return {
      state,
      methods: {
        getState: () => state,
        addToolResult: (result) => runtime.addToolResult(result),
        resumeToolCall: (payload) => runtime.resumeToolCall(payload),
        __internal_getRuntime: () => runtime,
      },
    };
  },
);
