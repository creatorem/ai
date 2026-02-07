"use client";

import { forwardRef, useCallback, useMemo } from "react";
import { ActionButtonProps } from "../../utils/create-action-button";
import { composeEventHandlers } from "@radix-ui/primitive";
import { Primitive } from "@radix-ui/react-primitive";
import { useMessage } from "../message/message-by-index-provider";

const useActionBarFeedbackPositive = () => {
  const { submitFeedback } = useMessage();

  const callback = useCallback(() => {
    submitFeedback({ type: "positive" });
  }, [submitFeedback]);

  return callback;
};

export namespace ActionBarPrimitiveFeedbackPositive {
  export type Element = HTMLButtonElement;
  export type Props = ActionButtonProps<typeof useActionBarFeedbackPositive>;
}

export const ActionBarPrimitiveFeedbackPositive = forwardRef<
  ActionBarPrimitiveFeedbackPositive.Element,
  ActionBarPrimitiveFeedbackPositive.Props
>(({ onClick, disabled, ...props }, forwardedRef) => {
  const { metadata } = useMessage()
  const isSubmitted = useMemo(
    () => metadata.submittedFeedback?.type === "positive",
    [metadata]);

  const callback = useActionBarFeedbackPositive();
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

ActionBarPrimitiveFeedbackPositive.displayName =
  "ActionBarPrimitive.FeedbackPositive";
