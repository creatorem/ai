"use client";

import { FC, PropsWithChildren, useMemo } from "react";
import { useMessagePartText } from "./use-message-part-text";
import { useThread } from "../thread";

export namespace MessagePartPrimitiveBeforeStream {
  export type Props = PropsWithChildren;
}

const SMOOTH_START_MIN_CHARS = 100;

export const useIsSmoothStreamingMessagePart = () => {
  const messagePartText = useMessagePartText();
  const { isRunning } = useThread();

  return useMemo(
    () => isRunning && messagePartText.text.length >= SMOOTH_START_MIN_CHARS,
    [messagePartText, isRunning],
  );
};

export const MessagePartPrimitiveBeforeStream: FC<
  MessagePartPrimitiveBeforeStream.Props
> = ({ children }) => {
  const { isRunning } = useThread();
  const messagePartText = useMessagePartText();

  return isRunning && messagePartText.text.length < SMOOTH_START_MIN_CHARS
    ? children
    : null;
};
