"use client";

import { forwardRef } from "react";
import { ActionButtonProps } from "../../utils/create-action-button";
import { composeEventHandlers } from "@radix-ui/primitive";
import { Primitive } from "@radix-ui/react-primitive";
import { useCallback } from "react";
import { useAiChat, useAiChatShallow } from "@creatorem/ai-store";

const useActionBarFeedbackNegative = () => {
  const messageMethods = useAiChat(({message}) => message.methods);

  const callback = useCallback(() => {
    messageMethods.submitFeedback({ type: "negative" });
  }, [messageMethods]);

  return callback;
};

export namespace ActionBarPrimitiveFeedbackNegative {
  export type Element = HTMLButtonElement;
  export type Props = ActionButtonProps<typeof useActionBarFeedbackNegative>;
}

export const ActionBarPrimitiveFeedbackNegative = forwardRef<
  ActionBarPrimitiveFeedbackNegative.Element,
  ActionBarPrimitiveFeedbackNegative.Props
>(({ onClick, disabled, ...props }, forwardedRef) => {
  const isSubmitted = useAiChat(
    (s) => s.message.metadata.submittedFeedback?.type === "negative",
  );
  const callback = useActionBarFeedbackNegative();
  return (
    <Primitive.button
      type="button"
      {...(isSubmitted ? { "data-submitted": "true" } : {})}
      {...props}
      ref={forwardedRef}
      disabled={disabled || !callback}
      onClick={composeEventHandlers(onClick, () => {
        callback?.();
      })}
    />
  );
});

ActionBarPrimitiveFeedbackNegative.displayName =
  "ActionBarPrimitive.FeedbackNegative";
