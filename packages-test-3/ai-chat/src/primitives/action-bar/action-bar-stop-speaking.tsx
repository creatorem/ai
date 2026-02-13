"use client";

import { forwardRef, useMemo } from "react";
import { ActionButtonProps } from "../../utils/create-action-button";
import { useCallback } from "react";
import { useMessage, useMessageStore } from "../message";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";

const useActionBarStopSpeaking = () => {
  const speech = useMessage(s => s.speech);
  const messageStore = useMessageStore();
  const isSpeaking = useMemo(() => speech != null, [speech]);

  const callback = useCallback(() => {
    messageStore.getState().stopSpeaking();
  }, [messageStore]);

  if (!isSpeaking) return null;

  return callback;
};

export namespace ActionBarPrimitiveStopSpeaking {
  export type Element = RuntimeComponents['Button'];
  export type Props = ActionButtonProps<typeof useActionBarStopSpeaking>;
}

export const ActionBarPrimitiveStopSpeaking = forwardRef<
  ActionBarPrimitiveStopSpeaking.Element,
  ActionBarPrimitiveStopSpeaking.Props
>((props, ref) => {
  const callback = useActionBarStopSpeaking();

  const { components: {Button} } = useRuntime();

  return (
    // @ts-ignore
    <Button
      type="button"
      disabled={!callback}
      {...props}
      ref={ref}
      onClick={(e) => {
        props.onClick?.(e);
        callback?.();
      }}
    />
  );
});

ActionBarPrimitiveStopSpeaking.displayName = "ActionBarPrimitive.StopSpeaking";
