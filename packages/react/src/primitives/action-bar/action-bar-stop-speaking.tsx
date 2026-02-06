"use client";

import { forwardRef } from "react";
import { ActionButtonProps } from "../../utils/create-action-button";
import { useEscapeKeydown } from "@radix-ui/react-use-escape-keydown";
import { Primitive } from "@radix-ui/react-primitive";
import { composeEventHandlers } from "@radix-ui/primitive";
import { useCallback } from "react";
import { useAiChat } from "@creatorem/ai-store";

const useActionBarStopSpeaking = () => {
  const messageMethods = useAiChat(({message}) => message.methods);
  const isSpeaking = useAiChat(({ message }) => message.speech != null);

  const callback = useCallback(() => {
    messageMethods.stopSpeaking();
  }, [messageMethods]);

  if (!isSpeaking) return null;

  return callback;
};

export namespace ActionBarPrimitiveStopSpeaking {
  export type Element = HTMLButtonElement;
  export type Props = ActionButtonProps<typeof useActionBarStopSpeaking>;
}

export const ActionBarPrimitiveStopSpeaking = forwardRef<
  ActionBarPrimitiveStopSpeaking.Element,
  ActionBarPrimitiveStopSpeaking.Props
>((props, ref) => {
  const callback = useActionBarStopSpeaking();

  // TODO this stops working if the user is not hovering over an older message
  useEscapeKeydown((e) => {
    if (callback) {
      e.preventDefault();
      callback();
    }
  });

  return (
    <Primitive.button
      type="button"
      disabled={!callback}
      {...props}
      ref={ref}
      onClick={composeEventHandlers(props.onClick, () => {
        callback?.();
      })}
    />
  );
});

ActionBarPrimitiveStopSpeaking.displayName = "ActionBarPrimitive.StopSpeaking";
