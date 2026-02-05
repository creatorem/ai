import { resource } from "@creatorem/ai-tap";
import { type ClientOutput } from "@creatorem/ai-assistant-store";
import { AttachmentRuntime } from "../_runtime";
import { tapSubscribable } from "../util-hooks/tap-subscribable";

export const AttachmentRuntimeClient = resource(
  ({ runtime }: { runtime: AttachmentRuntime }): ClientOutput<"attachment"> => {
    const state = tapSubscribable(runtime);

    return {
      state,
      methods: {
        getState: () => state,
        remove: runtime.remove,
        __internal_getRuntime: () => runtime,
      },
    };
  },
);
