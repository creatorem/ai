"use client";

import { forwardRef, useMemo } from "react";
import { ActionButtonProps } from "../../utils/create-action-button";
import { useCallback } from "react";
import { useMessage, useMessageStore } from "../message";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import { composeEventHandlers } from "@creatorem/ai-chat/utils";

const useActionBarFeedbackNegative = () => {
  const messageStore = useMessageStore();

  const callback = useCallback(() => {
    messageStore.getState().submitFeedback({ type: "negative" });
  }, [messageStore]);

  return callback;
};

export namespace ActionBarPrimitiveFeedbackNegative {
  export type Element = RuntimeComponents["Button"];
  export type Props = ActionButtonProps<typeof useActionBarFeedbackNegative>;
}

export const ActionBarPrimitiveFeedbackNegative = forwardRef<
  ActionBarPrimitiveFeedbackNegative.Element,
  ActionBarPrimitiveFeedbackNegative.Props
>(({ onClick, disabled, ...props }, forwardedRef) => {
  const metadata = useMessage((s) => s.metadata);
  const isSubmitted = useMemo(
    () => metadata.submittedFeedback?.type === "negative",
    [metadata],
  );

  const callback = useActionBarFeedbackNegative();

  const {
    components: { Button },
  } = useRuntime();

  return (
    <Button
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
