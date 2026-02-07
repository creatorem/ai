"use client";

import { forwardRef, useMemo } from "react";
import { ActionButtonProps } from "../../utils/create-action-button";
import { composeEventHandlers } from "@radix-ui/primitive";
import { Primitive } from "@radix-ui/react-primitive";
import { useCallback } from "react";
import { useMessage } from "../message/message-by-index-provider";

const useActionBarFeedbackNegative = () => {
  const { submitFeedback } = useMessage();

  const callback = useCallback(() => {
    submitFeedback({ type: "negative" });
  }, [submitFeedback]);

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
  const { metadata } = useMessage()
  const isSubmitted = useMemo(
    () => metadata.submittedFeedback?.type === "negative",
    [metadata]);
    
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
