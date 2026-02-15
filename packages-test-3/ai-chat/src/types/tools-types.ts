import type { StandardSchemaV1 } from "@standard-schema/spec";
import { ToolCallMessagePartComponent } from "./message-part-component-types";
import type { JSONSchema7 } from "json-schema";

export type ToolDisplayProps = {
  icon?: string;
  title: string;
  description?: string;
};

export type ToolExecutionContext = {
  toolCallId: string;
  abortSignal: AbortSignal;
  human: (payload: unknown) => Promise<unknown>;
};

export type ToolExecuteFunction<TArgs, TResult> = (
  args: TArgs,
  context: ToolExecutionContext,
) => TResult | Promise<TResult>;

export type BackendUITool<TArgs, TResult> = {
    type?: 'backend'
    toolName: string;
    disabled?:boolean;
    display?: ToolDisplayProps;
    execute?: ToolExecuteFunction<TArgs, TResult>;
    render: ToolCallMessagePartComponent<TArgs, TResult>;
};

export type FrontendUITool<TArgs, TResult> = Omit<BackendUITool<TArgs, TResult>, 'type'> & {
    type: 'frontend'
    description: string;
    parameters: StandardSchemaV1<TArgs> | JSONSchema7;
};

export type UITool<TArgs, TResult> = BackendUITool<TArgs, TResult> | FrontendUITool<TArgs, TResult>;