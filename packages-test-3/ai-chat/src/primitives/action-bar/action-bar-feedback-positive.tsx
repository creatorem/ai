"use client";

import { forwardRef, useCallback, useMemo } from "react";
import { ActionButtonProps } from "../../utils/create-action-button";
import { composeEventHandlers } from "@radix-ui/primitive";
import { Primitive } from "@radix-ui/react-primitive";
import { useMessage, useMessageStore } from "../message/message-by-index-provider";

const useActionBarFeedbackPositive = () => {
  const messageStore = useMessageStore();

  const callback = useCallback(() => {
    messageStore.getState().submitFeedback({ type: "positive" });
  }, [messageStore]);

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
  const metadata = useMessage(s => s.metadata);
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
