import type { ComponentType, PropsWithChildren } from "react";
import type {
  MessagePartStatus,
  FileMessagePart,
  ImageMessagePart,
  ReasoningMessagePart,
  SourceMessagePart,
  TextMessagePart,
  ToolCallMessagePart,
  Unstable_AudioMessagePart,
  ThreadUserMessagePart,
  ThreadAssistantMessagePart,
  ToolCallMessagePartStatus,
} from "./assistant-types";
import { ToolResponse } from "@creatorem/stream";

export type MessagePartState = (
  | ThreadUserMessagePart
  | ThreadAssistantMessagePart
) & {
  readonly status: MessagePartStatus | ToolCallMessagePartStatus;
};

export type EmptyMessagePartProps = {
  status: MessagePartStatus;
};
export type EmptyMessagePartComponent = ComponentType<EmptyMessagePartProps>;

export type TextMessagePartProps = MessagePartState & TextMessagePart;
export type TextMessagePartComponent = ComponentType<TextMessagePartProps>;

export type ReasoningMessagePartProps = MessagePartState & ReasoningMessagePart;
export type ReasoningMessagePartComponent =
  ComponentType<ReasoningMessagePartProps>;

export type ReasoningGroupProps = PropsWithChildren<{
  startIndex: number;
  endIndex: number;
}>;
export type ReasoningGroupComponent = ComponentType<ReasoningGroupProps>;

export type SourceMessagePartProps = MessagePartState & SourceMessagePart;
export type SourceMessagePartComponent = ComponentType<SourceMessagePartProps>;

export type ImageMessagePartProps = MessagePartState & ImageMessagePart;
export type ImageMessagePartComponent = ComponentType<ImageMessagePartProps>;

export type FileMessagePartProps = MessagePartState & FileMessagePart;
export type FileMessagePartComponent = ComponentType<FileMessagePartProps>;

export type Unstable_AudioMessagePartProps = MessagePartState &
  Unstable_AudioMessagePart;
export type Unstable_AudioMessagePartComponent =
  ComponentType<Unstable_AudioMessagePartProps>;

export type ToolCallMessagePartProps<
  TArgs = any,
  TResult = unknown,
> = MessagePartState &
  ToolCallMessagePart<TArgs, TResult> & {
    addResult: (result: TResult | ToolResponse<TResult>) => void;
    resume: (payload: unknown) => void;
  };

export type ToolCallMessagePartComponent<
  TArgs = any,
  TResult = any,
> = ComponentType<ToolCallMessagePartProps<TArgs, TResult>>;
