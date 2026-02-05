import type {
  Attachment,
  CompleteAttachment,
  PendingAttachment,
} from "./types/attachment-types";
import type { Unsubscribe } from "./types/index";
import type { AttachmentAdapter } from "./types/adapters/attachment-adapter";
import type { MessageRole, RunConfig } from "./types/assistant-types";
import type { DictationAdapter } from "./types/adapters/speech";
import type { StateCreator } from "zustand";
import type { FilterStore } from "./store";
import type { ToolsState } from "./types/entities";
import type { AttachmentMethods } from "./types/entities/attachment";
import type { DictationState } from "./runtime-cores";


type ToolsSlice = StateCreator<
  FilterStore,
  [],
  [],
  Pick<FilterStore, 'tools'>
>

export const createToolsSlice: StateCreator<
  FilterStore,
  [],
  [],
  Pick<FilterStore, 'tools'>
> = (set, get) => ({
  tools: {
    state: {
      tools: {}
    },
    methods: {
      'setToolUI': (toolName, render) => {
        set((prev) => {
          return {
            ...prev,
            tools: {
              ...prev.tools,
              [toolName]: [...(prev.tools.state.tools[toolName] ?? []), render],
            },
          };
        });

        return () => {
          set((prev) => {
            return {
              ...prev,
              tools: {
                ...prev.tools,
                [toolName]:
                  prev.tools.state.tools[toolName]?.filter((r) => r !== render) ?? [],
              },
            };
          });
        };
      },
    }
  }
})
