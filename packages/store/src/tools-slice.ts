import type { StateCreator } from "zustand";
import type { FilterStore } from "./store";

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
