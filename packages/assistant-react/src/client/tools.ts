import { resource, tapState, tapEffect, tapCallback } from "@creatorem/ai-tap";
import {
  tapAssistantClientRef,
  type ClientOutput,
  attachDefaultPeers,
} from "@creatorem/ai-assistant-store";
import { ToolsState } from "../types/scopes";
import type { Tool } from "@creatorem/stream";
import { type Toolkit } from "../model-context/toolbox";
import { ToolCallMessagePartComponent } from "../types";
import { ModelContext } from "./model-context-client";

export const Tools = resource(
  ({ toolkit }: { toolkit?: Toolkit }): ClientOutput<"tools"> => {
    const [state, setState] = tapState<ToolsState>(() => ({
      tools: {},
    }));

    const clientRef = tapAssistantClientRef();

    const setToolUI = tapCallback(
      (toolName: string, render: ToolCallMessagePartComponent) => {
        setState((prev) => {
          return {
            ...prev,
            tools: {
              ...prev.tools,
              [toolName]: [...(prev.tools[toolName] ?? []), render],
            },
          };
        });

        return () => {
          setState((prev) => {
            return {
              ...prev,
              tools: {
                ...prev.tools,
                [toolName]:
                  prev.tools[toolName]?.filter((r) => r !== render) ?? [],
              },
            };
          });
        };
      },
      [],
    );

    tapEffect(() => {
      if (!toolkit) return;
      const unsubscribes: (() => void)[] = [];

      // Register tool UIs (exclude symbols)
      for (const [toolName, tool] of Object.entries(toolkit)) {
        if (tool.render) {
          unsubscribes.push(setToolUI(toolName, tool.render));
        }
      }

      // Register tools with model context (exclude symbols)
      const toolsWithoutRender = Object.entries(toolkit).reduce(
        (acc, [name, tool]) => {
          const { render, ...rest } = tool;
          acc[name] = rest;
          return acc;
        },
        {} as Record<string, Tool<any, any>>,
      );

      const modelContextProvider = {
        getModelContext: () => ({
          tools: toolsWithoutRender,
        }),
      };

      unsubscribes.push(
        clientRef.current!.modelContext().register(modelContextProvider),
      );

      return () => {
        unsubscribes.forEach((fn) => fn());
      };
    }, [toolkit, setToolUI, clientRef]);

    return {
      state,
      methods: {
        getState: () => state,
        setToolUI,
      },
    };
  },
);

attachDefaultPeers(Tools, {
  modelContext: ModelContext(),
});
