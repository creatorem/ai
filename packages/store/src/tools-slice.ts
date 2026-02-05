import type { StateCreator } from "zustand";
import type { AiChatStore } from "./store";

export const createToolsSlice: StateCreator<
  AiChatStore,
  [],
  [],
  Pick<AiChatStore, 'tools'>
> = (set, get) => ({
  tools: {
    tools: {},
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
