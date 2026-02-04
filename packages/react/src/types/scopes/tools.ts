import type { ToolCallMessagePartComponent } from "../message-part-component-types";
import type { Unsubscribe } from "../unsubscribe";

export type ToolsState = {
  tools: Record<string, ToolCallMessagePartComponent[]>;
};

export type ToolsMethods = {
  getState(): ToolsState;
  setToolUI(
    toolName: string,
    render: ToolCallMessagePartComponent,
  ): Unsubscribe;
};

export type ToolsClientSchema = {
  state: ToolsState;
  methods: ToolsMethods;
};
