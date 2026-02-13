import { Tool } from "../stream/tool-types";
import type { ToolCallMessagePartComponent } from "./message-part-component-types";

export type ToolDefinition<
  TArgs extends Record<string, unknown>,
  TResult,
> = Tool<TArgs, TResult> & {
  render?: ToolCallMessagePartComponent<TArgs, TResult> | undefined;
};

export type Toolkit = Record<string, ToolDefinition<any, any>>;

export type ToolsConfig = {
  toolkit: Toolkit;
};
